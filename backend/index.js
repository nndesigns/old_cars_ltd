const express = require("express");
const cors = require("cors");
// const db = require("./config/db");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// const inventoryRoute = require("./routes/inventoryRoute")(app);
// const modelImages = require("./routes/modelImages")(app);
const awsRoutes = require("./routes/awsRoutes")(app);
const locationSearch = require("./routes/locationsSearch")(app);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
