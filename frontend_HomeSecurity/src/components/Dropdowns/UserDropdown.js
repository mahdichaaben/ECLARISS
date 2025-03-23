import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authcontext/index';
import { doSignOut } from '../../firebase/auth';

const UserDropdown = () => {
  const [dropdownPopoverShow, setDropdownPopoverShow] = useState(false);
  const navigate = useNavigate(); // Moved useNavigate inside the component

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
    <div className="relative font-[sans-serif] w-max mx-auto">
      <button
        type="button"
        id="dropdownToggle"
        className="px-4 py-2 flex items-center rounded-full text-cyan-800 htext-sm border border-gray-300 outline-none hover:bg-gray-100"
        onClick={() => setDropdownPopoverShow(!dropdownPopoverShow)}
      >
        <img
          src={require("assets/img/admin.jpg")}
          className="w-7 h-7 mr-3 rounded-full shrink-0"
          alt="Profile"
        />

        <div className='hidden md:block'>
        chaaben
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-3 fill-gray-400 inline ml-3"
          viewBox="0 0 24 24"
        >
          <path
            fillRule="evenodd"
            d="M11.99997 18.1669a2.38 2.38 0 0 1-1.68266-.69733l-9.52-9.52a2.38 2.38 0 1 1 3.36532-3.36532l7.83734 7.83734 7.83734-7.83734a2.38 2.38 0 1 1 3.36532 3.36532l-9.52 9.52a2.38 2.38 0 0 1-1.68266.69734z"
            clipRule="evenodd"
            data-original="#000000"
          />
        </svg>

        </div>
        
      </button>

      <ul
        id="dropdownMenu"
        className={`absolute shadow-lg mt-5 bg-white py-2 z-[1000] min-w-full w-max rounded-lg max-h-96 overflow-auto ${
          dropdownPopoverShow ? "block opacity-100 translate-y-0" : "hidden opacity-0 translate-y-6"
        } transition-opacity duration-500 ease-in-out`}
      >
        <li className="py-2.5 px-5 hover:bg-gray-100 text-[#333] text-sm cursor-pointer">
          View profile
        </li>
        <li className="py-2.5 px-5 hover:bg-gray-100 text-[#333] text-sm cursor-pointer">
          Dashboard
        </li>
        <li className="py-2.5 px-5 hover:bg-gray-100 text-[#333] text-sm cursor-pointer">
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full text-left"
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default UserDropdown;
