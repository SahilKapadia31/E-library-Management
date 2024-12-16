const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Constants for Status Codes
const STATUS_BAD_REQUEST = 400;
const STATUS_UNAUTHORIZED = 401;
const STATUS_CREATED = 201;
const STATUS_OK = 200;

// Generate JWT (Moved to a static method in User model for better encapsulation)
User.schema.methods.generateToken = function () {
  return jwt.sign({ id: this._id, username: this.username }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Middleware to handle async errors
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Register User
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res
      .status(STATUS_BAD_REQUEST)
      .json({ message: "Please provide all required fields." });
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res
      .status(STATUS_BAD_REQUEST)
      .json({ message: "User with this email already exists." });
  }

  const user = await User.create({
    username,
    email,
    password,
  });

  if (user) {
    res.status(STATUS_CREATED).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: user.generateToken(),
    });
  } else {
    res.status(STATUS_BAD_REQUEST).json({ message: "Failed to create user." });
  }
});

// Login User
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(STATUS_BAD_REQUEST)
      .json({ message: "Please provide email and password." });
  }

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(STATUS_OK).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: user.generateToken(),
    });
  } else {
    res.status(STATUS_UNAUTHORIZED).json({ message: "Invalid email or password." });
  }
});

// Get Logged In User
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.status(STATUS_OK).json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } else {
    res
      .status(STATUS_BAD_REQUEST)
      .json({ message: "User not found." });
  }
});

module.exports = { registerUser, loginUser, getUserProfile };