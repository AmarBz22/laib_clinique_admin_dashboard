import React from 'react';
import { BiMenu, BiSearch } from 'react-icons/bi';

const Header = ({ toggleSidebar, isSidebarOpen }) => {
  return (
    <header
      className={`${isSidebarOpen ? 'responsive-div fixed md:left-64': 'w-full '} flex items-center  justify-between p-4 w- bg-white shadow-md h-20 fixed top-0   transition-all duration-300`}

    // Adjust based on your sidebar width
    >
      <div className='flex justify-start items-center'>
        {/* Burger Menu */}
        <button className='' onClick={toggleSidebar}>
          <BiMenu className="text-2xl" />
        </button>

        {/* Dashboard Text */}
        <span className="ml-2 font-semibold lg:text-2xl text-lg">Dashboard</span>
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
