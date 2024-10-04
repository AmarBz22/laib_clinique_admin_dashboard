import React from 'react';
import { BiMenu, BiSearch } from 'react-icons/bi';

const Header = ({ toggleSidebar, isSidebarOpen }) => {
  return (
    <header
      className={`flex items-center justify-between p-4 bg-white shadow-md h-20 fixed top-0 transition-all duration-300`}
      style={{ marginLeft: isSidebarOpen ? '256px' : '0', width: isSidebarOpen ? 'calc(100% - 256px)' : '100%' }} // Adjust based on your sidebar width
    >
      {/* Burger Menu */}
      <button onClick={toggleSidebar}>
        <BiMenu className="text-2xl" />
      </button>

      {/* Dashboard Text */}
      <span className="ml-2 font-semibold text-2xl">Dashboard</span>

      {/* Search Box */}
      <div className="flex-grow mx-4">
        <div className="relative w-[20%] mx-auto">
          <BiSearch className="absolute left-2 top-2 text-black text-3xl" />
          <input
            type="text"
            placeholder="Search here..."
            className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-primary-pink"
            style={{ borderRadius: '12px' }}
          />
        </div>
      </div>

      {/* Profile Section */}
      <div className="flex items-center">
        <img
            src="https://ui-avatars.com/api/?name=Darine+Laib&background=c7d2fe&color=3730a3&bold=true"
            alt="Profile"
            className="w-8 h-8 rounded-full"
        />
        <span className="ml-2 font-semibold text-primary-pink">Darine Laib </span>
      </div>
    </header>
  );
};

export default Header;
