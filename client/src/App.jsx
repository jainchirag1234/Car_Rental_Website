import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CarForm from "./component/CarForm";
import CarList from "./component/CarList";
import CalculateCost from "./component/CalculateCost";

const App = () => {
  return (
    <Router>
      <div className="container mt-4">
        <h1 className="text-center mb-4 text-primary fw-bold">
          🚗 Car Rental Service
        </h1>

        {/* Navigation Links */}
        <nav className="mb-4">
          <Link className="btn btn-primary me-2" to="/">
            Add Car
          </Link>
          <Link className="btn btn-success me-2" to="/list">
            Car List
          </Link>
        </nav>

        <hr />

        {/* Routes */}
        <Routes>
          <Route path="/" element={<CarForm />} />
          <Route path="/list" element={<CarList />} />
          <Route path="/calculate" element={<CalculateCost />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
