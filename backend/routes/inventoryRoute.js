const connection = require("../config/db");

module.exports = function (app) {
  app.get("/api/inventory", async (req, res) => {
    const invQuery = `
    SELECT
      inventory.id,
      inventory.year,
      inventory.make,
      inventory.model,
      inventory.color,
      inventory.price,
      inventory.mpg_city,
      inventory.mpg_hwy,
      inventory.transmission,
      inventory.engine,
      inventory.drive_type,
      inventory.prev_owners,
      inventory.mileage,
      inventory.vin,
      inventory.status,
      inventory.date_created,
      inventory.style,
      inventory.city,
      inventory.state,
      inventory.images
     
    FROM inventory
  `;

    try {
      const [results] = await connection.promise().query(invQuery); // Use the `promise()` wrapper for `mysql2` for async/await.
      console.log("Inventory fetch successful");
      res.send(results);
    } catch (err) {
      console.error("There was an error fetching inventory:", err);
      res.status(500).send("Error fetching inventory");
    }
  });
};
