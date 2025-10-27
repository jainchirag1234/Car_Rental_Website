const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  costPerKm: { type: Number, required: true },
  image: { type: String }, // URL of the car image
});

module.exports = mongoose.model("Car", carSchema);
