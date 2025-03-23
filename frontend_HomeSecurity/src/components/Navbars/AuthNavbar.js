import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Iconapp from "assets/img/home-security.png";
import { useAuth } from 'context/authcontext/index'; // Ensure correct import path
import { doSignOut } from '../../firebase/auth'

export default function Navbar() {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { userLoggedIn } = useAuth(); // Make sure `userLoggedIn` is available
  const navigate = useNavigate(); // Use navigate for redirecting after logout

  const handleScroll = () => {
    setScrolled(window.scrollY > 100);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await doSignOut();
      console.log("ok");
      navigate('/auth/login'); // Redirect to login page after sign out
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };


  return (
    <nav
      className={`fixed top-0 w-full z-50 flex flex-wrap items-center justify-between px-2 py-3 transition-colors duration-300 bg-moon-light  mb-3`}
    >
      <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
        <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
          <div className="flex items-center space-x-4">
            <img src={Iconapp} className="w-10" alt="icon" />
            <span className="text-xl font-bold text-moon-dark">
              SmartSecure Home
            </span>
          </div>
          <button
            className="cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
            type="button"
            onClick={() => setNavbarOpen(!navbarOpen)}
          >
            <i className="text-moon-light-blue fas fa-bars"></i>
          </button>
        </div>
        <div
          className={`lg:flex flex-grow items-center${navbarOpen ? " flex" : " hidden"}`}
          id="navbar-content"
        >
          <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
            <li className="nav-item">
              <Link
                to="/features"
                className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-moon-dark hover:opacity-75"
              >
                <i className="fas fa-list-alt text-lg leading-lg text-moon-blue opacity-75"></i>
                <span className="ml-2">Features</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/pricing"
                className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-moon-dark hover:opacity-75"
              >
                <i className="fas fa-tags text-lg leading-lg text-moon-blue opacity-75"></i>
                <span className="ml-2">Pricing</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/about"
                className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-moon-dark hover:opacity-75"
              >
                <i className="fas fa-info-circle text-lg leading-lg text-moon-blue opacity-75"></i>
                <span className="ml-2">About</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/contact"
                className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-moon-dark hover:opacity-75"
              >
                <i className="fas fa-envelope text-lg leading-lg text-moon-blue opacity-75"></i>
                <span className="ml-2">Contact</span>
              </Link>
            </li>
            {!userLoggedIn ? (
              <li className="nav-item">
                <Link
                  to="/auth/login"
                  className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-moon-dark hover:text-moon-blue"
                >
                  <i className="fas fa-sign-in-alt text-lg leading-lg text-moon-blue opacity-75"></i>
                  <span className="ml-2">Login</span>
                </Link>
              </li>
            ) : (
              <li className="nav-item relative">
                <button
                  className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-moon-dark hover:text-moon-blue"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <i className="fas fa-user-circle text-lg leading-lg text-moon-blue opacity-75"></i>
                  <span className="ml-2">Account</span>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 bg-white border rounded shadow-lg">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-moon-dark hover:bg-gray-200"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/homespace"
                      className="block px-4 py-2 text-sm text-moon-dark hover:bg-gray-200"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Homespace
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-moon-dark hover:bg-gray-200"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      className="block px-4 py-2 text-sm text-moon-dark hover:bg-gray-200 w-full text-left"
                      onClick={handleSignOut}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
