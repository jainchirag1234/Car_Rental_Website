import React, { useState } from "react";
import axios from "axios";

const CarForm = () => {
  const [car, setCar] = useState({
    name: "",
    category: "",
    costPerKm: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setCar({ ...car, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setCar({ ...car, image: file });
    setPreview(URL.createObjectURL(file)); // ✅ show preview
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", car.name);
    formData.append("category", car.category);
    formData.append("costPerKm", car.costPerKm);
    formData.append("image", car.image);

    try {
      await axios.post("http://localhost:5000/api/cars", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Car added successfully!");
      setCar({ name: "", category: "", costPerKm: "", image: null });
      setPreview(null);
      e.target.reset();
    } catch (err) {
      alert("❌ Error adding car!");
      console.error(err);
    }
  };

  return (
    <div className="card p-4 shadow">
      <h4 className="text-success mb-3">Add New Car</h4>
      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-2"
          name="name"
          placeholder="Car Name"
          value={car.name}
          onChange={handleChange}
          required
        />
        <input
          className="form-control mb-2"
          name="category"
          placeholder="Category (SUV, Sedan, etc.)"
          value={car.category}
          onChange={handleChange}
          required
        />
        <input
          className="form-control mb-2"
          name="costPerKm"
          placeholder="Cost per Km"
          type="number"
          value={car.costPerKm}
          onChange={handleChange}
          required
        />
        {/* ✅ File Upload Field */}
        <input
          className="form-control mb-3"
          type="file"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
          required
        />

        {/* ✅ Show Image Preview */}
        {preview && (
          <div className="text-center mb-3">
            <img
              src={preview}
              alt="Preview"
              width="200"
              className="rounded shadow-sm"
            />
          </div>
        )}

        <button className="btn btn-primary w-100">Add Car</button>
      </form>
    </div>
  );
};

export default CarForm;
