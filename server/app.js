const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const carRoute = require("./routes/carRoutes");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Serve uploaded images publicly
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/cars", carRoute);

mongoose
  .connect("mongodb://127.0.0.1:27017/CarRental")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log(err));

const PORT = 5000;
app.listen(PORT, () => console.log(`🚗 Server running on port ${PORT}`));
