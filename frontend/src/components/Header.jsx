// src/components/Header.js
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
  FaPlus,
  FaBook,
  FaBookReader,
} from "react-icons/fa";

const Header = () => {
  const { user, logout } = useContext(AuthContext);

  const navLinkClass =
    "hover:text-gray-700 flex items-center text-gray-500 transition duration-200";

  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-md">
      {/* Logo */}
      <div>
        <Link to="/" className="text-2xl font-bold text-gray-800">
          E-Library App
        </Link>
      </div>

      {/* Navigation items */}
      <nav>
        {user && (
          <ul className="flex space-x-6">
            <li>
              <Link to="/" className={navLinkClass}>
                <FaBook className="inline mr-1" aria-hidden="true" /> All Books
              </Link>
            </li>
            <li>
              <Link to="/add-book" className={navLinkClass}>
                <FaPlus className="inline mr-1" aria-hidden="true" /> Add E-book
              </Link>
            </li>
            <li>
              <Link to="/my-books" className={navLinkClass}>
                <FaBook className="inline mr-1" aria-hidden="true" /> View My
                E-books
              </Link>
            </li>
            <li>
              <Link to="/my-borrowed-books" className={navLinkClass}>
                <FaBookReader className="inline mr-1" aria-hidden="true" /> My
                Borrowed Books
              </Link>
            </li>
          </ul>
        )}
      </nav>

      {/* User and Authentication */}
      <div className="flex items-center space-x-4">
        {!user ? (
          <div className="flex space-x-4">
            <Link to="/login" className={navLinkClass}>
              <FaSignInAlt
                className="inline mr-1"
                aria-hidden="true"
                aria-label="Login"
              />{" "}
              Login
            </Link>
            <Link to="/register" className={navLinkClass}>
              <FaUserPlus
                className="inline mr-1"
                aria-hidden="true"
                aria-label="Register"
              />{" "}
              Register
            </Link>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <span className="font-medium text-gray-800">
              Hello, {user.username}
            </span>
            <button
              onClick={logout}
              className="flex items-center text-gray-500 transition duration-200 hover:text-gray-700"
            >
              <FaSignOutAlt
                className="inline mr-1"
                aria-hidden="true"
                aria-label="Logout"
              />{" "}
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;