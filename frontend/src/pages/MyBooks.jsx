// src/pages/MyBooks.js
import React, { useEffect, useState } from "react";
import api from "../api/api"; // Import the Axios instance for making API requests
import { FaEdit, FaTrash } from "react-icons/fa"; // Import icons for edit and delete
import { useNavigate } from "react-router-dom"; // Import useNavigate for routing

const BookCard = ({ book, onEdit, onDelete }) => {
  return (
    <div className="overflow-hidden transition-shadow duration-300 bg-white rounded-lg shadow-md hover:shadow-xl">
      {/* Book Image */}
      <img
        src={
          book.imageUrl
            ? `https://swiftrut-task-7.onrender.com${book.imageUrl}`
            : "/no-image.png"
        }
        alt={book.title}
        className="object-cover w-full transition-transform duration-300 h-96 hover:scale-105"
      />
      <div className="p-6">
        <h2 className="mb-2 text-2xl font-semibold text-gray-800">{book.title}</h2>
        <p className="mb-2 text-gray-600">By {book.author}</p>
        <p className="mb-2 text-sm text-gray-500">Genre: {book.genre}</p>
        <p className="mb-2 text-sm text-gray-500">
          Published: {new Date(book.publicationDate).toLocaleDateString()}
        </p>
        <p className="mb-2 text-sm text-gray-500">
          Available Copies: {book.availableCopies}
        </p>
        <p className="mb-4 text-sm text-gray-500">
          Status: {book.available ? "Available" : "Not Available"}
        </p>
        {/* Borrowed By (List of users who borrowed the book) */}
        {book.borrowedBy && book.borrowedBy.length > 0 ? (
          <div className="text-left">
            <h3 className="mb-2 text-lg font-semibold">Borrowed by:</h3>
            <ul className="text-sm text-gray-700">
              {book.borrowedBy.map((user) => (
                <li key={user._id}>
                  {user.name} ({user.email})
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="mb-4 text-gray-500">Not borrowed yet</p>
        )}
        {/* Edit and Delete buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => onEdit(book._id)}
            className="flex items-center px-4 py-2 space-x-2 text-white transition duration-300 bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            <FaEdit />
            <span>Edit</span>
          </button>
          <button
            onClick={() => onDelete(book._id)}
            className="flex items-center px-4 py-2 space-x-2 text-white transition duration-300 bg-red-500 rounded-lg hover:bg-red-600"
          >
            <FaTrash />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const MyBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await api.get("/books/mycreatedbooks");
        setBooks(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch books:", error);
      }
    };

    fetchBooks();
  }, []);

  const handleDelete = async (bookId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this book?");
    if (confirmDelete) {
      try {
        await api.delete(`/books/${bookId}`);
        setBooks((prevBooks) => prevBooks.filter((book) => book._id !== bookId));
      } catch (error) {
        console.error("Failed to delete book:", error);
      }
    }
  };

  const handleEdit = (bookId) => {
    navigate(`/edit-book/${bookId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-white">
      <div className="container mx-auto">
        <h1 className="mb-12 text-4xl font-bold text-center text-gray-800">This is your bookshelf</h1>
        {books.length === 0 ? (
          <p className="text-center text-gray-600">You have not added any books yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {books.map((book) => (
              <BookCard
                key={book._id}
                book={book}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBooks;