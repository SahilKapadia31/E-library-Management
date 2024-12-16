// src/pages/BookDetails.js
import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api"; // Import API instance
import { AuthContext } from "../context/AuthContext"; // Import AuthContext for user

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBorrowed, setIsBorrowed] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await api.get(`/books/${id}`);
        setBook(response.data);
        setLoading(false);

        if (user && response.data.borrowedBy.includes(user._id)) {
          setIsBorrowed(true);
        }
      } catch {
        setError("Error fetching book details");
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id, user]);

  const handleBorrow = async () => {
    try {
      await api.post(`/books/${id}/borrow`);
      setIsBorrowed(true);
      setBook((prevBook) => ({
        ...prevBook,
        availableCopies: prevBook.availableCopies - 1,
      }));
    } catch {
      setError("Error borrowing book");
    }
  };

  const handleReturn = async () => {
    try {
      await api.post(`/books/${id}/return`);
      setIsBorrowed(false);
      setBook((prevBook) => ({
        ...prevBook,
        availableCopies: prevBook.availableCopies + 1,
      }));
    } catch {
      setError("Error returning book");
    }
  };

  if (loading) return <div>Loading book details...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container p-6 mx-auto bg-gray-100">
      <div className="mb-8 text-center">
        <h1 className="mb-4 text-4xl font-bold text-gray-900">Book Details</h1>
        <p className="text-lg text-gray-700">Discover the story behind this book</p>
      </div>

      {book && (
        <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md lg:flex-row">
          {/* Book Details - Left Side */}
          <div className="w-full mb-6 lg:w-1/2 lg:mb-0 lg:pr-6">
            <h2 className="mb-4 text-3xl font-semibold text-gray-900">{book.title}</h2>
            <p className="mb-2 text-lg font-medium text-gray-700">By {book.author}</p>
            <p className="mb-2 text-gray-600 text-md">
              <strong>Genre:</strong> {book.genre}
            </p>
            <p className="mb-2 text-gray-600 text-md">
              <strong>Published:</strong> {new Date(book.publicationDate).toLocaleDateString()}
            </p>
            <p className="mb-2 text-gray-600 text-md">
              <strong>Available Copies:</strong> {book.availableCopies}
            </p>
            <p className="mt-4 text-gray-700">{book.description}</p>

            {/* Borrow/Return Buttons */}
            {user && (
              <div className="mt-6">
                {isBorrowed ? (
                  <button
                    onClick={handleReturn}
                    className="px-6 py-2 text-white transition bg-gray-700 rounded hover:bg-gray-800"
                  >
                    Return Book
                  </button>
                ) : book.availableCopies > 0 ? (
                  <button
                    onClick={handleBorrow}
                    className="px-6 py-2 text-white transition bg-gray-700 rounded hover:bg-gray-800"
                  >
                    Borrow Book
                  </button>
                ) : (
                  <p className="text-red-500 text-md">No copies available for borrowing</p>
                )}
              </div>
            )}
          </div>

          {/* Book Image - Right Side */}
          <div className="flex justify-center w-full lg:w-1/2">
            <div className="p-4 border-4 border-gray-300 rounded-md">
              <img
                src={
                  book.imageUrl
                    ? `https://swiftrut-task-7.onrender.com${book.imageUrl}`
                    : "/no-image.png"
                }
                alt={book.title}
                className="object-cover w-full h-auto rounded-md"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetails;