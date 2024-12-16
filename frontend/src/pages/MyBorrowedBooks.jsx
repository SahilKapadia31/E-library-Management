import React, { useEffect, useState, useContext } from "react";
import api from "../api/api";
import { AuthContext } from "../context/AuthContext";

const MyBorrowedBooks = () => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  // Fetch borrowed books only when the user is logged in
  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      try {
        const response = await api.get("/books/myborrowedbooks");
        setBorrowedBooks(response.data);
      } catch (err) {
        setError("Error fetching borrowed books");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchBorrowedBooks();
    }
  }, [user]);

  // Handle book return
  const handleReturn = async (bookId) => {
    try {
      await api.post(`/books/${bookId}/return`);
      setBorrowedBooks((prevBooks) =>
        prevBooks.filter((book) => book._id !== bookId)
      );
    } catch (err) {
      setError("Error returning book");
    }
  };

  if (loading) return <div className="text-center text-gray-600">Loading borrowed books...</div>;
  if (error) return <div className="text-center text-red-600">{error}</div>;

  return (
    <div className="min-h-screen py-12 bg-white">
      <div className="container p-8 mx-auto">
        <h1 className="mb-12 text-4xl font-semibold text-center text-gray-900">My Borrowed Books</h1>
        {borrowedBooks.length === 0 ? (
          <p className="text-center text-gray-500">You haven't borrowed any books yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {borrowedBooks.map((book) => (
              <div key={book._id} className="overflow-hidden transition-shadow duration-300 bg-white rounded-lg shadow-md hover:shadow-xl">
                <div className="relative">
                  <img
                    src={book.imageUrl ? `https://swiftrut-task-7.onrender.com${book.imageUrl}` : "/no-image.png"}
                    alt={book.title}
                    className="object-cover w-full h-72"
                  />
                  <div className="absolute bottom-0 left-0 px-3 py-1 font-semibold text-white bg-gray-800">
                    Borrowed
                  </div>
                </div>
                <div className="p-6">
                  <h2 className="mb-2 text-2xl font-semibold text-gray-900">{book.title}</h2>
                  <p className="mb-2 text-lg text-gray-600">By {book.author}</p>
                  <p className="mb-2 text-gray-500 text-md">Genre: {book.genre}</p>
                  <p className="mb-2 text-gray-500 text-md">
                    Published: {new Date(book.publicationDate).toLocaleDateString()}
                  </p>
                  <p className="mb-4 text-gray-500 text-md">Available Copies: {book.availableCopies}</p>

                  <button
                    onClick={() => handleReturn(book._id)}
                    className="w-full px-4 py-2 text-white transition-colors duration-300 bg-red-500 rounded-lg hover:bg-red-600"
                  >
                    Return Book
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBorrowedBooks;