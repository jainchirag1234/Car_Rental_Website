import React, { useEffect, useState } from "react";
import axios from "axios";

const CarList = () => {
  const [cars, setCars] = useState([]);
  const [editingCar, setEditingCar] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    costPerKm: "",
    image: null,
  });

  const [distances, setDistances] = useState({});
  const [calculatedCosts, setCalculatedCosts] = useState({});
  const [distanceErrors, setDistanceErrors] = useState({}); // store inline errors

  useEffect(() => {
    loadCars();
  }, []);

  const loadCars = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/cars");
      setCars(res.data);
    } catch (err) {
      console.error("Error fetching cars:", err);
    }
  };

  const deleteCar = async (id) => {
    if (window.confirm("Are you sure you want to delete this car?")) {
      await axios.delete(`http://localhost:5000/api/cars/${id}`);
      loadCars();
    }
  };

  const startEdit = (car) => {
    setEditingCar(car._id);
    setFormData({
      name: car.name,
      category: car.category,
      costPerKm: car.costPerKm,
      image: null,
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const updateCar = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("category", formData.category);
    data.append("costPerKm", formData.costPerKm);
    if (formData.image) data.append("image", formData.image);

    try {
      await axios.put(`http://localhost:5000/api/cars/${editingCar}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setEditingCar(null);
      loadCars();
    } catch (err) {
      console.error("Error updating car:", err);
    }
  };

  const cancelEdit = () => {
    setEditingCar(null);
    setFormData({ name: "", category: "", costPerKm: "", image: null });
  };

  const handleDistanceChange = (carId, value) => {
    setDistances({ ...distances, [carId]: value });
    setDistanceErrors({ ...distanceErrors, [carId]: "" }); // reset error
    setCalculatedCosts({ ...calculatedCosts, [carId]: undefined }); // reset previous cost
  };

  const calculateCost = (carId, costPerKm) => {
    const distance = distances[carId];

    if (!distance || isNaN(distance) || Number(distance) <= 0) {
      setDistanceErrors({
        ...distanceErrors,
        [carId]: "Please enter a valid distance (greater than 0)",
      });
      setCalculatedCosts({ ...calculatedCosts, [carId]: undefined });
      return;
    }

    const total = Number(distance) * Number(costPerKm);

    if (total <= 0) {
      setDistanceErrors({
        ...distanceErrors,
        [carId]: "Total cost cannot be zero or negative",
      });
      setCalculatedCosts({ ...calculatedCosts, [carId]: undefined });
      return;
    }

    setCalculatedCosts({ ...calculatedCosts, [carId]: total });
    setDistanceErrors({ ...distanceErrors, [carId]: "" }); // clear error
  };

  return (
    <div className="container mt-4">
      <h4 className="text-danger mb-3">Available Cars</h4>
      <div className="row">
        {cars.map((car) => (
          <div className="col-md-4 mb-3" key={car._id}>
            <div className="card shadow-sm h-100">
              <img
                src={
                  car.image
                    ? `http://localhost:5000/uploads/${car.image}`
                    : "https://via.placeholder.com/300x200?text=No+Image"
                }
                alt={car.name}
                className="card-img-top"
                style={{ height: "200px", objectFit: "cover" }}
              />
              <div className="card-body">
                {editingCar === car._id ? (
                  <form onSubmit={updateCar}>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Car Name"
                      className="form-control mb-2"
                      required
                    />
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      placeholder="Category"
                      className="form-control mb-2"
                      required
                    />
                    <input
                      type="number"
                      name="costPerKm"
                      value={formData.costPerKm}
                      onChange={handleChange}
                      placeholder="Cost/km"
                      className="form-control mb-2"
                      required
                    />
                    <input
                      type="file"
                      name="image"
                      onChange={handleImageChange}
                      className="form-control mb-2"
                      accept="image/*"
                    />
                    <div className="d-flex gap-2">
                      <button className="btn btn-success w-50" type="submit">
                        Save
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary w-50"
                        onClick={cancelEdit}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <h5>{car.name}</h5>
                    <p className="mb-1">Category: {car.category}</p>
                    <p className="mb-2">Cost/km: ₹{car.costPerKm}</p>

                    {/* Distance Input */}
                    <input
                      type="number"
                      min="1"
                      className="form-control mb-2"
                      placeholder="Enter distance (km)"
                      value={distances[car._id] || ""}
                      onChange={(e) =>
                        handleDistanceChange(car._id, e.target.value)
                      }
                    />

                    {/* Inline error message */}
                    {distanceErrors[car._id] && (
                      <p className="text-danger mb-2">
                        {distanceErrors[car._id]}
                      </p>
                    )}

                    {/* Calculate Cost Button */}
                    <button
                      className="btn btn-sm btn-success w-100 mb-2"
                      onClick={() => calculateCost(car._id, car.costPerKm)}
                    >
                      Calculate Cost
                    </button>

                    {/* Show Calculated Cost if valid */}
                    {calculatedCosts[car._id] !== undefined && (
                      <p className="alert alert-info py-2 mb-2">
                        Total Cost: ₹{calculatedCosts[car._id]}
                      </p>
                    )}

                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-outline-primary w-50"
                        onClick={() => startEdit(car)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger w-50"
                        onClick={() => deleteCar(car._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}

        {cars.length === 0 && (
          <p className="text-center text-muted">No cars available yet.</p>
        )}
      </div>
    </div>
  );
};

export default CarList;
