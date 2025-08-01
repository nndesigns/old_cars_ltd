/* const db = require("../../config/db");

async function offerCheckerBatch(locationsArray) {
  if (!locationsArray.length) return {};

  const cityStatePairs = locationsArray.map((loc) => [loc.city, loc.state]);
  const placeholders = cityStatePairs
    .map(() => "(city = ? AND state = ?)")
    .join(" OR ");
  const values = cityStatePairs.flat();

  const [rows] = await db.promise().query(
    `
      SELECT city, state, COUNT(*) AS offers
      FROM inventory
     WHERE status = 1 AND (${placeholders})
      GROUP BY city, state
      `,
    values
  );

  const resultMap = {};
  for (const row of rows) {
    const key = `${row.city}_${row.state}`;
    resultMap[key] = row.offers;
  }
  return resultMap;
}
module.exports = { offerCheckerBatch };
 */

async function offerCheckerBatch(locationsArray, inventoryData) {
  if (!locationsArray.length) return {};

  const resultMap = {};

  // Create a Set of city_state keys to quickly look up
  const targetKeys = new Set(
    locationsArray.map(({ city, state }) => `${city}_${state}`)
  );

  // Filter inventory and count matches
  for (const item of inventoryData) {
    const key = `${item.city}_${item.state}`;
    const status = String(item.status); // DynamoDB fields might come in as strings or numbers

    if (targetKeys.has(key) && (status === "1" || status === 1)) {
      resultMap[key] = (resultMap[key] || 0) + 1;
    }
  }

  return resultMap;
}

module.exports = { offerCheckerBatch };
