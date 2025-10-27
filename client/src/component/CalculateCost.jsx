import React, { useState } from "react";

// Sample car data (you can replace with backend fetch later)
const cars = [
  { id: "1", name: "Hyundai Creta", costPerKm: 20 },
  { id: "2", name: "Swift Dzire", costPerKm: 15 },
  { id: "3", name: "Innova Crysta", costPerKm: 25 },
];

function CalculateCost() {
  const [selectedCar, setSelectedCar] = useState("");
  const [distance, setDistance] = useState("");
  const [total, setTotal] = useState(null);

  const handleCalculate = (e) => {
    e.preventDefault();
    if (!selectedCar || !distance) {
      alert("Please select a car and enter distance!");
      return;
    }

    const car = cars.find((c) => c.id === selectedCar);
    const totalCost = car.costPerKm * Number(distance);
    setTotal({
      carName: car.name,
      distance,
      costPerKm: car.costPerKm,
      totalCost,
    });
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Calculate Journey Cost</h2>
      <form
        onSubmit={handleCalculate}
        style={{ display: "inline-block", textAlign: "left" }}
      >
        <label>Select Car:</label>
        <select
          value={selectedCar}
          onChange={(e) => setSelectedCar(e.target.value)}
          style={{ display: "block", marginBottom: "10px", width: "100%" }}
        >
          <option value="">-- Select Car --</option>
          {cars.map((car) => (
            <option key={car.id} value={car.id}>
              {car.name} (₹{car.costPerKm}/km)
            </option>
          ))}
        </select>

        <label>Distance (km):</label>
        <input
          type="number"
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
          placeholder="Enter distance"
          style={{ display: "block", marginBottom: "10px", width: "100%" }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "8px",
            backgroundColor: "#28a745",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Calculate
        </button>
      </form>

      {total && (
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            border: "1px solid #ccc",
            display: "inline-block",
          }}
        >
          <h4>{total.carName}</h4>
          <p>Distance: {total.distance} km</p>
          <p>Cost per km: ₹{total.costPerKm}</p>
          <h4>Total Cost: ₹{total.totalCost}</h4>
        </div>
      )}
    </div>
  );
}

export default CalculateCost;
