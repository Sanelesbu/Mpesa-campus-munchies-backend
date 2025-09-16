const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const mpesaRoutes = require("./routes/mpesa");

const app = express();
app.use(bodyParser.json());

// Use the PORT Render provides, fallback to 5000
const PORT = process.env.PORT || 5000;

// Routes
app.use("/api/mpesa", mpesaRoutes);

app.get("/", (req, res) => {
  res.send("✅ Campus Munchies Mpesa Backend is running!");
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
