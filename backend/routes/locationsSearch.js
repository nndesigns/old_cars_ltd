// routes/locationSearch.js
const { getDistance } = require("geolib");
const fs = require("fs");
const csv = require("csv-parser");

const { offerCheckerBatch } = require("./utils/offerChecker");

//for calling new DynamoDB 'offerCheckerBatch'
const { ScanCommand } = require("@aws-sdk/client-dynamodb");
const { unmarshall } = require("@aws-sdk/util-dynamodb");
const client = require("../config/dynamoClient");

module.exports = function (app) {
  const zipData = [];

  // create array (zipData) of obj's from .csv of all US zip,lat,lng,city,state_id,population, <-- obj's with those properties
  fs.createReadStream("us_zips.csv")
    .pipe(csv(["zip", "latitude", "longitude", "city", "state", "pop"]))
    .on("data", (row) => {
      zipData.push({
        zip: row.zip,
        latitude: row.latitude,
        longitude: row.longitude,
        city: row.city,
        state: row.state,
        pop: row.pop,
      });
    })
    .on("end", () => {
      console.log("CSV file successfully processed");
    });
  /////// UTILITY FUNCTIONS
  function getNearbyCities(match, zipData, radiusMiles, distFilter) {
    const matchLat = parseFloat(match.latitude);
    const matchLon = parseFloat(match.longitude);
    const seen = new Set();

    return zipData
      .filter((item) => {
        // allow same-city if distFilter is true
        const allowSameCity = distFilter || item.city !== match.city;

        if (allowSameCity && item.latitude && item.longitude) {
          const distance = getDistance(
            { latitude: matchLat, longitude: matchLon },
            {
              latitude: parseFloat(item.latitude),
              longitude: parseFloat(item.longitude),
            }
          );
          const miles = distance / 1609.34;

          if (miles <= radiusMiles) {
            const key = `${item.city.toLowerCase()}_${item.state}`;
            if (!seen.has(key)) {
              seen.add(key);
              item._distance = miles;
              return true;
            }
          }
        }
        return false;
      })
      .sort((a, b) => a._distance - b._distance)
      .map(({ _distance, ...rest }) => rest); // strip distance field
  }

  /////// API Endpoint
  app.get("/api/locations/search", async (req, res) => {
    const { zip, city, distFilter } = req.query;

    let matches = [];

    // existing zip / city matching logic...
    if (zip) {
      const match = zipData.find((item) => item.zip === zip);
      if (!match) {
        return res.status(404).json({ message: "No matching ZIP code found." });
      }
      matches.push(match);
    } else if (city) {
      const seen = new Set();
      matches = zipData.filter((item) => {
        if (item.city.toLowerCase() === city.toLowerCase()) {
          const key = `${item.city.toLowerCase()}_${item.state}`;
          if (!seen.has(key)) {
            seen.add(key);
            return true;
          }
        }
        return false;
      });

      if (matches.length === 0) {
        return res.status(404).json({ message: "No matching city found." });
      }
    } else {
      return res
        .status(400)
        .json({ message: "Must provide a zip or city query." });
    }

    if (matches.length > 1) {
      matches = matches.sort((a, b) => a.state.localeCompare(b.state));
    }

    // 👇 distFilter influences radius + slicing
    const isDistFilter = distFilter === "true"; // query params are always strings
    const radius = isDistFilter ? 200 : 30;

    let finalResults;

    const command = new ScanCommand({
      TableName: "Inventory_OldCarsLtd",
    });
    const response = await client.send(command);
    const inventory = response.Items.map(unmarshall);

    if (matches.length > 1) {
      const matchOfferCounts = await offerCheckerBatch(matches, inventory);
      const enrichedMatches = matches
        .map((loc) => ({
          ...loc,
          offerCt: matchOfferCounts[`${loc.city}_${loc.state}`] || 0,
        }))
        .sort((a, b) => b.offerCt - a.offerCt);

      finalResults = enrichedMatches;
    } else {
      const enrichedNearbyLists = await Promise.all(
        matches.map(async (match) => {
          const nearbyCities = getNearbyCities(
            match,
            zipData,
            radius,
            isDistFilter
          );
          const nearbyOfferCounts = await offerCheckerBatch(
            nearbyCities,
            inventory
          );

          let enrichedNearby = nearbyCities
            .map((loc) => ({
              ...loc,
              offerCt: nearbyOfferCounts[`${loc.city}_${loc.state}`] || 0,
            }))
            .sort((a, b) => b.offerCt - a.offerCt);

          // 👇 only slice if not distFilter
          if (!isDistFilter) {
            enrichedNearby = enrichedNearby.slice(0, 5);
          }

          return [match, ...enrichedNearby];
        })
      );

      finalResults = enrichedNearbyLists.flat();
    }

    res.json(finalResults);
  });

  //// GET LONG, LAT OBJ
  app.get("/api/locations/coords", async (req, res) => {
    const { zip } = req.query;

    if (!zip) {
      return res.status(400).json({ message: "Missing zip query parameter." });
    }

    // Find the matching entry in your local zipData array
    const match = zipData.find((item) => item.zip === zip);

    if (!match) {
      return res
        .status(404)
        .json({ message: `No coordinates found for ZIP: ${zip}` });
    }

    // Only return the essentials
    const { city, state, latitude, longitude } = match;

    res.json({
      zip,
      city,
      state,
      latitude,
      longitude,
    });
  });
};
