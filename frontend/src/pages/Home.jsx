import React, { useEffect, useState } from "react";
import api from "../api/api"; // Ensure API instance is imported
import BookCard from "../components/BookCard"; // Import BookCard component

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // States for filters
  const [filterGenre, setFilterGenre] = useState("");
  const [filterAuthor, setFilterAuthor] = useState("");
  const [filterDate, setFilterDate] = useState("");

  // Fetch all books from backend API
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await api.get("/books");
        setBooks(response.data); // Store fetched books in state
      } catch (err) {
        setError("Error fetching books");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Filter books based on genre, author, and publication date
  const filteredBooks = books.filter((book) => {
    const matchGenre = filterGenre
      ? book.genre.toLowerCase().includes(filterGenre.toLowerCase())
      : true;
    const matchAuthor = filterAuthor
      ? book.author.toLowerCase().includes(filterAuthor.toLowerCase())
      : true;
    const matchDate = filterDate
      ? new Date(book.publicationDate).getFullYear() === parseInt(filterDate, 10)
      : true;

    return matchGenre && matchAuthor && matchDate;
  });

  if (loading) return <div>Loading books...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto">
        <h2 className="mb-12 text-4xl font-bold text-center text-gray-900">
          Explore Our Popular Books
        </h2>

        {/* Filter Section */}
        <div className="p-6 mb-6 bg-gray-100 rounded-lg shadow">
          <h3 className="mb-6 text-2xl font-semibold text-center text-gray-800">
            Filter Books
          </h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Filter by Genre */}
            <div>
              <label className="block mb-2 text-gray-700">
                Filter by Genre
              </label>
              <input
                type="text"
                value={filterGenre}
                onChange={(e) => setFilterGenre(e.target.value)}
                placeholder="Enter genre"
                className="w-full p-2 text-gray-800 bg-white border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Filter by Author */}
            <div>
              <label className="block mb-2 text-gray-700">
                Filter by Author
              </label>
              <input
                type="text"
                value={filterAuthor}
                onChange={(e) => setFilterAuthor(e.target.value)}
                placeholder="Enter author"
                className="w-full p-2 text-gray-800 bg-white border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Filter by Publication Date */}
            <div>
              <label className="block mb-2 text-gray-700">
                Filter by Year of Publication
              </label>
              <input
                type="number"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                placeholder="Enter year"
                className="w-full p-2 text-gray-800 bg-white border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Books Listing */}
        <div className="grid grid-cols-1 gap-8 p-4 md:grid-cols-4">
          {filteredBooks.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>

        {/* No books found */}
        {filteredBooks.length === 0 && (
          <div className="text-center text-gray-500">No books found</div>
        )}
      </div>
    </div>
  );
};

export default Home;