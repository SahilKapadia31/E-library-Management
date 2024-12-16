const Book = require("../models/bookModel");
const multer = require("multer");

// Multer setup for image upload
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
  }),
});

// Utility to send error response
const handleError = (res, message, error, status = 500) =>
  res.status(status).json({ message, error });

/// Create Book with Image Upload
const addBook = async (req, res) => {
  try {
    const { title, author, genre, publicationDate, availableCopies } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const book = await Book.create({
      title,
      author,
      genre,
      publicationDate,
      availableCopies,
      imageUrl,
      createdBy: req.user.id,
    });

    res.status(201).json(book);
  } catch (error) {
    handleError(res, "Error creating book", error, 400);
  }
};

// Update Book with Image Upload
const updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) return res.status(404).json({ message: "Book not found" });

    if (book.createdBy.toString() !== req.user.id)
      return res.status(401).json({ message: "Unauthorized action" });

    Object.assign(book, {
      ...req.body,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : book.imageUrl,
    });

    await book.save();
    res.status(200).json(book);
  } catch (error) {
    handleError(res, "Error updating book", error);
  }
};

// Get all books (Public)
const getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    handleError(res, "Error retrieving books", error);
  }
};

// Get book by ID (Public)
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) return res.status(404).json({ message: "Book not found" });

    res.status(200).json(book);
  } catch (error) {
    handleError(res, "Error retrieving book", error);
  }
};

// Delete book (Only creator can delete)
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) return res.status(404).json({ message: "Book not found" });

    if (book.createdBy.toString() !== req.user.id)
      return res.status(401).json({ message: "Unauthorized action" });

    await book.deleteOne();
    res.status(200).json({ message: "Book deleted" });
  } catch (error) {
    handleError(res, "Error deleting book", error);
  }
};

// Borrow book
const borrowBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) return res.status(404).json({ message: "Book not found" });
    if (book.availableCopies <= 0)
      return res.status(400).json({ message: "No available copies" });

    book.borrowedBy.push(req.user.id);
    book.availableCopies -= 1;

    await book.save();
    res.status(200).json({ message: "Book borrowed successfully" });
  } catch (error) {
    handleError(res, "Error borrowing book", error);
  }
};

// Return book
const returnBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) return res.status(404).json({ message: "Book not found" });

    const index = book.borrowedBy.indexOf(req.user.id);
    if (index === -1)
      return res.status(400).json({ message: "Book not borrowed by this user" });

    book.borrowedBy.splice(index, 1);
    book.availableCopies += 1;

    await book.save();
    res.status(200).json({ message: "Book returned successfully" });
  } catch (error) {
    handleError(res, "Error returning book", error);
  }
};

// Get all books added by the logged-in user
const getBooksByCreator = async (req, res) => {
  try {
    const books = await Book.find({ createdBy: req.user.id })
      .populate("createdBy", "name email")
      .populate("borrowedBy", "name email");

    res.status(200).json(books);
  } catch (error) {
    handleError(res, "Error retrieving user-created books", error);
  }
};

// Get all books borrowed by the logged-in user
const getBooksByBorrowedUser = async (req, res) => {
  try {
    const books = await Book.find({ borrowedBy: req.user.id });
    res.status(200).json(books);
  } catch (error) {
    handleError(res, "Error retrieving borrowed books", error);
  }
};

module.exports = {
  addBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
  borrowBook,
  returnBook,
  getBooksByCreator,
  getBooksByBorrowedUser,
};
