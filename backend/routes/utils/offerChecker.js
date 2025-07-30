const db = require("../../config/db");

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
