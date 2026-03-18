import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    // Close user menu when clicking outside
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
    setIsUserMenuOpen(false);
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.name) return "U";
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Don't show navbar on these paths
  if (
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname.startsWith("/designer")
  ) {
    return null;
  }

  return (
    <nav className="bg-warm-50/90 backdrop-blur-md border-b border-stone-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <img
              src="/logo.png"
              alt="RoomCraft"
              className="w-8 h-8 object-contain"
            />
            <span className="text-xl font-light text-stone-900 tracking-tight">
              Room<span className="font-normal text-amber-800">Craft</span>
            </span>
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors relative ${
                location.pathname === "/"
                  ? "text-amber-800 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-amber-800 after:rounded-full"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              Home
            </Link>

            <Link
              to="/about"
              className={`text-sm font-medium transition-colors relative ${
                location.pathname === "/about"
                  ? "text-amber-800 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-amber-800 after:rounded-full"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              About Us
            </Link>

            <Link
              to="/contact"
              className={`text-sm font-medium transition-colors relative ${
                location.pathname === "/contact"
                  ? "text-amber-800 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-amber-800 after:rounded-full"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              Contact
            </Link>

            {user ? (
              <Link
                to="/designs"
                className={`text-sm font-medium transition-colors relative ${
                  location.pathname === "/designs"
                    ? "text-amber-800 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-amber-800 after:rounded-full"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                My Designs
              </Link>
            ) : null}
          </div>

          {/* User Menu / Auth Buttons */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative" ref={userMenuRef}>
                {/* User Avatar - Clickable */}
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 focus:outline-none group"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-amber-700 to-stone-700 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md group-hover:shadow-lg transition-shadow">
                    {getUserInitials()}
                  </div>
                  <span className="text-sm font-medium text-stone-700 hidden lg:block">
                    {user.name?.split(" ")[0] || "User"}
                  </span>
                  <svg
                    className={`w-4 h-4 text-stone-500 transition-transform duration-200 ${isUserMenuOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-stone-100 py-2 z-50">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-stone-100">
                      <p className="text-sm font-medium text-stone-900">
                        {user.name}
                      </p>
                      <p className="text-xs text-stone-500 mt-0.5">
                        {user.email}
                      </p>
                    </div>

                    {/* Menu Items */}
                    <Link
                      to="/designs"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-700 hover:bg-amber-50 transition-colors"
                    >
                      <svg
                        className="w-4 h-4 text-stone-500"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                      My Designs
                    </Link>

                    <Link
                      to="/designer"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-700 hover:bg-amber-50 transition-colors"
                    >
                      <svg
                        className="w-4 h-4 text-stone-500"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      New Design
                    </Link>

                    <div className="border-t border-stone-100 my-1"></div>

                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-amber-700 hover:bg-amber-50 transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors px-3 py-2"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-amber-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-900 transition-colors shadow-sm"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() =>
                document
                  .getElementById("mobile-menu")
                  .classList.toggle("hidden")
              }
              className="text-stone-600 hover:text-stone-900 focus:outline-none p-2"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          id="mobile-menu"
          className="hidden md:hidden py-4 border-t border-stone-200 bg-warm-50"
        >
          <div className="flex flex-col space-y-3">
            <Link
              to="/"
              className="text-sm font-medium text-stone-600 hover:text-amber-800 px-2 py-1.5 transition-colors"
              onClick={() =>
                document.getElementById("mobile-menu").classList.add("hidden")
              }
            >
              Home
            </Link>

            <Link
              to="/about"
              className="text-sm font-medium text-stone-600 hover:text-amber-800 px-2 py-1.5 transition-colors"
              onClick={() =>
                document.getElementById("mobile-menu").classList.add("hidden")
              }
            >
              About Us
            </Link>

            <Link
              to="/contact"
              className="text-sm font-medium text-stone-600 hover:text-amber-800 px-2 py-1.5 transition-colors"
              onClick={() =>
                document.getElementById("mobile-menu").classList.add("hidden")
              }
            >
              Contact
            </Link>

            {user ? (
              <>
                <Link
                  to="/designs"
                  className="text-sm font-medium text-stone-600 hover:text-amber-800 px-2 py-1.5 transition-colors"
                  onClick={() =>
                    document
                      .getElementById("mobile-menu")
                      .classList.add("hidden")
                  }
                >
                  My Designs
                </Link>
                <Link
                  to="/designer"
                  className="bg-amber-800 text-white px-4 py-2 rounded-lg text-sm font-medium inline-block text-center hover:bg-amber-900 transition-colors"
                  onClick={() =>
                    document
                      .getElementById("mobile-menu")
                      .classList.add("hidden")
                  }
                >
                  New Design
                </Link>
                <div className="pt-3 border-t border-stone-200 mt-2">
                  <div className="flex items-center gap-3 px-2 py-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-amber-700 to-stone-700 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                      {getUserInitials()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-stone-900">
                        {user.name}
                      </p>
                      <p className="text-xs text-stone-500">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      handleSignOut();
                      document
                        .getElementById("mobile-menu")
                        .classList.add("hidden");
                    }}
                    className="w-full text-left px-2 py-2 text-sm text-amber-700 hover:bg-amber-50 rounded-lg mt-1 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-stone-600 hover:text-amber-800 px-2 py-1.5 transition-colors"
                  onClick={() =>
                    document
                      .getElementById("mobile-menu")
                      .classList.add("hidden")
                  }
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-amber-800 text-white px-4 py-2 rounded-lg text-sm font-medium inline-block text-center hover:bg-amber-900 transition-colors"
                  onClick={() =>
                    document
                      .getElementById("mobile-menu")
                      .classList.add("hidden")
                  }
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
