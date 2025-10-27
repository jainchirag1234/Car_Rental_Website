const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Car = require("../models/carModel");

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// ======================= ADD NEW CAR =======================
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, category, costPerKm } = req.body;

    const newCar = new Car({
      name,
      category,
      costPerKm,
      image: req.file ? req.file.filename : null,
    });

    await newCar.save();
    res.status(201).json({ message: "Car added successfully", car: newCar });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ======================= GET ALL CARS =======================
router.get("/", async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ======================= UPDATE CAR =======================
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, category, costPerKm } = req.body;
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found" });

    // If a new image is uploaded, delete the old one
    if (req.file && car.image) {
      const oldPath = path.join(uploadDir, car.image);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    // Update fields
    car.name = name || car.name;
    car.category = category || car.category;
    car.costPerKm = costPerKm || car.costPerKm;
    if (req.file) car.image = req.file.filename;

    await car.save();
    res.json({ message: "Car updated successfully", car });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ======================= DELETE CAR =======================
router.delete("/:id", async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found" });

    // Delete image from folder
    if (car.image) {
      const filePath = path.join(uploadDir, car.image);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await car.deleteOne();
    res.json({ message: "Car deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ======================= CALCULATE JOURNEY COST =======================
router.post("/calculate", async (req, res) => {
  try {
    const { carId, distance } = req.body;

    // Validate distance
    if (!distance || isNaN(distance) || Number(distance) <= 0) {
      return res
        .status(400)
        .json({ message: "Please enter a valid distance (greater than 0)" });
    }

    const car = await Car.findById(carId);
    if (!car) return res.status(404).json({ message: "Car not found" });

    const totalCost = car.costPerKm * Number(distance);

    if (totalCost <= 0) {
      return res
        .status(400)
        .json({ message: "Total cost cannot be zero or negative" });
    }

    res.json({
      carName: car.name,
      distance: Number(distance),
      costPerKm: car.costPerKm,
      totalCost,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
