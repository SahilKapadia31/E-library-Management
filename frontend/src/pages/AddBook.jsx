// src/pages/AddBook.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api"; // Import your Axios instance for API requests

const AddBook = () => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    publicationDate: "",
    availableCopies: 1,
    image: null,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: name === "image" ? files[0] : value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Create form data object to handle image file
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      // Send POST request to add book to backend API
      await api.post("/books", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setSuccess("Book added successfully!");
      navigate("/my-books"); // Redirect to the My Books page after successful submission
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add book");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-lg p-8 rounded-lg shadow-md bg-gray-50">
        <h2 className="mb-6 text-2xl font-semibold text-center text-gray-700">
          Add a New Book
        </h2>
        {error && <div className="mb-4 text-center text-red-500">{error}</div>}
        {success && (
          <div className="mb-4 text-center text-green-500">{success}</div>
        )}
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {[
            { label: "Title", type: "text", name: "title" },
            { label: "Author", type: "text", name: "author" },
            { label: "Genre", type: "text", name: "genre" },
            { label: "Publication Date", type: "date", name: "publicationDate" },
            { label: "Available Copies", type: "number", name: "availableCopies", min: 1 },
          ].map(({ label, ...inputProps }) => (
            <div className="mb-4" key={inputProps.name}>
              <label className="block mb-2 font-medium text-gray-600">
                {label}
              </label>
              <input
                {...inputProps}
                value={formData[inputProps.name] || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                required
              />
            </div>
          ))}
          <div className="mb-6">
            <label className="block mb-2 font-medium text-gray-600">
              Book Cover Image
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 font-medium text-white transition duration-200 bg-gray-700 rounded-md hover:bg-gray-800"
          >
            Add Book
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBook;