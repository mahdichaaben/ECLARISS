import React, { useState } from 'react';
import { useAuth } from '../context/authcontext/index';
import AuthSidebar from 'components/Sidebar/AuthSidebar';
import { HiMenu, HiX } from 'react-icons/hi';
import { Link, Outlet } from 'react-router-dom';
import UserDropdown from "components/Dropdowns/UserDropdown";
import Breadcrumbs from 'components/breadcrumbs/Breadcrumbs'; // Import Breadcrumbs component
import Iconapp from "assets/img/home-security.png"
const HomeSpaceLayout = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { userLoggedIn } = useAuth();

  const toggleNavbar = () => setNavbarOpen(!navbarOpen);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Define breadcrumb items here

  return (
    <>
      <nav className="flex fixed w-full text-moon-dark z-50 bg-moon-light justify-between items-center px-4 py-3 shadow-lg">
        <div className="flex items-center space-x-4">
          <img src={Iconapp} className="w-10" alt='icon'/>

          <span className="text-xl font-bold text-moon-dark">SmartSecure Home</span>
        </div>

        <div className="flex space-x-4">
          {userLoggedIn ? (
                      <button
                      onClick={toggleSidebar}
                      className="text-moon-dark focus:outline-none z-50 hover:text-moon-light-blue"
                    >
                      {sidebarOpen ? <HiX size={40} /> : <HiMenu size={40} />}
                    </button>
          ) : (
            <>
              <Link
                to="/auth/login"
                className="text-moon-dark hover:text-moon-light-blue text-lg font-bold px-4 py-2 rounded"
              >
                Sign In
              </Link>
              <Link
                to="/auth/register"
                className="text-moon-dark font-bold text-lg px-4 py-2 rounded bg-moon-blue hover:bg-moon-light-blue"
              >
                Sign Up
              </Link>
            </>
          )}





 
        </div>
      </nav>

      <div className='flex pt-20 gap-3'>
        
      {sidebarOpen && (
          <div className="absolute md:relative md:w-[26vw] z-40">
            <AuthSidebar />
          </div>
        )}

        
        <div className='container'>
          <Breadcrumbs /> {/* Add Breadcrumbs here */}
          <Outlet />
        </div>

      </div>
    </>
  );
};

export default HomeSpaceLayout;
