// src/components/BookCard.js
import React from "react";
import { useNavigate } from "react-router-dom";

const BookCard = ({ book }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/books/${book._id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="overflow-hidden transition-shadow duration-300 border border-gray-200 rounded-lg shadow-sm cursor-pointer bg-gray-50 hover:shadow-md"
    >
      {/* Book Image */}
      <img
        src={
          book.imageUrl
            ? `https://swiftrut-task-7.onrender.com${book.imageUrl}`
            : "/no-image.png"
        }
        alt={book.title}
        className="object-cover w-full h-64"
      />

      {/* Book Details */}
      <div className="p-4 text-left">
        <h3 className="mb-1 text-lg font-semibold text-gray-800 truncate">
          {book.title}
        </h3>
        <p className="mb-1 text-sm font-medium text-gray-600 truncate">
          By: {book.author}
        </p>
        <p className="mb-1 text-sm text-gray-600 truncate">
          Genre: {book.genre}
        </p>
        <p className="mb-1 text-sm text-gray-600 truncate">
          Published: {new Date(book.publicationDate).toLocaleDateString()}
        </p>
        <p className="mb-4 text-sm text-gray-700">
          Available Copies: {book.availableCopies}
        </p>

        {/* Button */}
        <button
          className="px-4 py-2 font-medium text-gray-700 transition duration-300 border border-gray-300 rounded-full hover:bg-gray-200"
          onClick={(e) => {
            e.stopPropagation(); // Prevent parent onClick
            navigate(`/books/${book._id}`);
          }}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default BookCard;
