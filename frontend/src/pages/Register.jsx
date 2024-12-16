// src/pages/Register.js
import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { FaFacebookF, FaGoogle, FaTwitter, FaLinkedinIn } from "react-icons/fa"; // Importing icons

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState(""); // State for error handling

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors

    if (!formData.username || !formData.email || !formData.password) {
      setError("Please fill in all the fields.");
      return;
    }

    try {
      await register(formData.username, formData.email, formData.password);
      navigate("/"); // Redirect to homepage after registration
    } catch (error) {
      // Set the error message from the server or display a generic message
      setError(
        error.response?.data?.message || "Registration failed. Try again."
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-full p-8 bg-white rounded-lg shadow-md w-96">
        <h2 className="mb-6 text-3xl font-semibold text-center text-gray-800">Create Account</h2>
        <p className="mb-4 text-center text-gray-500">Choose your preferred sign-up method</p>

        <div className="flex justify-center mb-6 space-x-4">
          <button className="p-3 text-white transition-colors duration-300 bg-blue-600 rounded-full hover:bg-blue-500">
            <FaFacebookF />
          </button>
          <button className="p-3 text-white transition-colors duration-300 bg-red-600 rounded-full hover:bg-red-500">
            <FaGoogle />
          </button>
          <button className="p-3 text-white transition-colors duration-300 bg-blue-500 rounded-full hover:bg-blue-400">
            <FaTwitter />
          </button>
          <button className="p-3 text-white transition-colors duration-300 bg-green-600 rounded-full hover:bg-green-500">
            <FaLinkedinIn />
          </button>
        </div>

        <p className="mb-4 text-center text-gray-400">Or sign up with your email</p>

        {error && <div className="mb-4 text-center text-red-500">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Username"
              className="w-full p-3 text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
          </div>

          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div className="mb-6">
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 text-white transition-colors duration-300 bg-gray-800 rounded-md hover:bg-gray-700"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 transition-colors duration-300 hover:text-blue-400">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;