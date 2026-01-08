require("dotenv").config();
const { ScanCommand, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const lookupZip = require("../lookupZip.js");
const cityToZipMap = require("../cityToZipMap.js");
const client = require("../config/dynamoClient.js");

async function buildUniqueInvLocations() {
  // 1. Fetch active inventory
  const scanRes = await client.send(
    new ScanCommand({
      TableName: "Inventory_OldCarsLtd",
      FilterExpression: "#s = :one",
      ExpressionAttributeNames: { "#s": "status" },
      ExpressionAttributeValues: { ":one": { N: "1" } },
    })
  );

  const items = scanRes.Items || [];

  // 2. Extract unique city/state pairs
  const unique = {};
  for (const item of items) {
    const city = item.city.S;
    const state = item.state.S;
    const key = `${city}|${state}`;
    unique[key] = { city, state };
  }

  console.log("Unique locations:", Object.keys(unique).length);

  // 3. Resolve zip + lat/lon and insert into new table
  for (const key of Object.keys(unique)) {
    const { city, state } = unique[key];

    const zip = cityToZipMap[`${city}, ${state}`];
    if (!zip) {
      console.log(`Skipping ${city}, ${state} - no ZIP available`);
      continue;
    }

    const loc = await lookupZip(zip);

    if (!loc || !loc.latitude || !loc.longitude) {
      console.log(`Skipping ${city}, ${state} - no lat/lon from lookup`);
      continue;
    }

    const pk = `${city}|${state}`;

    console.log(`Saving ${pk} (ZIP: ${zip})`);

    await client.send(
      new PutItemCommand({
        TableName: "uniqueInvLocations",
        Item: {
          city_state: { S: pk },
          city: { S: city },
          state: { S: state },
          zip: { S: zip },
          latitude: { N: String(loc.latitude) },
          longitude: { N: String(loc.longitude) },
        },
      })
    );
  }

  console.log("Done.");
}

buildUniqueInvLocations().catch(console.error);
