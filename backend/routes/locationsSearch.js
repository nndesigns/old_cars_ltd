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
  //sum pop values of all zips from same city.
  /*   function sumCityPopulation(city, state, zipData) {
    return zipData
      .filter((item) => item.city === city && item.state === state)
      .reduce((sum, item) => sum + parseInt(item.pop || "0", 10), 0);
  } */

  function getNearbyCities(match, zipData, radiusMiles) {
    const matchLat = parseFloat(match.latitude);
    const matchLon = parseFloat(match.longitude);
    const seen = new Set();

    return zipData
      .filter((item) => {
        if (item.city !== match.city && item.latitude && item.longitude) {
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
    const { zip, city } = req.query;

    let matches = [];

    //if searched a zip, push single zipData obj into 'matches'
    if (zip) {
      const match = zipData.find((item) => item.zip === zip);
      if (!match) {
        return res.status(404).json({ message: "No matching ZIP code found." });
      }
      matches.push(match);
      //if searched city...
    } else if (city) {
      const seen = new Set();
      matches = zipData.filter((item) => {
        //push into 'matches' all first instances of unique 'city + state' zipData obj  w/matching 'city'
        if (item.city.toLowerCase() === city.toLowerCase()) {
          const key = `${item.city.toLowerCase()}_${item.state}`;
          //only adding unique city + state combos to matches
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

    // if > 1 match (aka not zip search & > 1 matching city + state), alphabetize matching zipData obj's by state
    if (matches.length > 1) {
      matches = matches.sort((a, b) => a.state.localeCompare(b.state));
    }

    const radius = 30;
    let finalResults;

    const command = new ScanCommand({
      TableName: "Inventory_OldCarsLtd",
    });
    const response = await client.send(command);
    const inventory = response.Items.map(unmarshall);

    // if >1 matches obj
    if (matches.length > 1) {
      //check 'inventory' table for unique 'city + state' records, return map (city_state: # of inv rows)

      const matchOfferCounts = await offerCheckerBatch(matches, inventory);
      //map offerCts to 'matches' (now 'enrichedMatches')
      //sorted by .offerCt values (most first)
      const enrichedMatches = matches
        .map((loc) => ({
          ...loc,
          offerCt: matchOfferCounts[`${loc.city}_${loc.state}`] || 0,
        }))
        .sort((a, b) => b.offerCt - a.offerCt);

      finalResults = enrichedMatches;
    }
    // if only 1 'matches' obj (aka a zip search)
    else {
      const enrichedNearbyLists = await Promise.all(
        matches.map(async (match) => {
          //use single 'matches' zipData obj's lat & long, to get all other zipData obj's (uniq city + state) w/in 'radius' (array)
          const nearbyCities = getNearbyCities(match, zipData, radius);
          //get map (city_state: # of inv rows) for nearbyCities
          const nearbyOfferCounts = await offerCheckerBatch(
            nearbyCities,
            inventory
          );

          // console.log("nearbyOfferCounts", nearbyOfferCounts);

          const enrichedNearby = nearbyCities
            .map((loc) => ({
              ...loc,
              // pop: sumCityPopulation(loc.city, loc.state, zipData),//<--- not necessary just left over (was going to sort on pop(bigger pop w/in radius 1st), but still sorting according to offerCt)
              offerCt: nearbyOfferCounts[`${loc.city}_${loc.state}`] || 0,
            }))
            .sort((a, b) => b.offerCt - a.offerCt)
            .slice(0, 5);

          // console.log("enrichedNearby", enrichedNearby);

          return [match, ...enrichedNearby];
        })
      );

      finalResults = enrichedNearbyLists.flat();
    }

    res.json(finalResults);
  });
};
