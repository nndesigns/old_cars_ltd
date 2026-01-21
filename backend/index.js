const express = require("express");
const cors = require("cors");
// const db = require("./config/db");


require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5001;

// Health check route 
app.get("/", (req, res) => { 
  res.status(200).send("Backend is running"); 
});


// Middleware
app.use(cors());
app.use(express.json());

// const inventoryRoute = require("./routes/inventoryRoute")(app); //old SQL fetch inventory Route
// const modelImages = require("./routes/modelImages")(app);
const awsRoutes = require("./routes/awsRoutes")(app);
const locationSearch = require("./routes/locationsSearch")(app);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
