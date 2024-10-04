import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import { BiHome, BiCalendar, BiShoppingBag, BiBook, BiStats } from 'react-icons/bi'; // Import necessary icons

const SideBar = () => {
  return (
    <aside className="h-screen w-64 bg-primary-pink text-white fixed top-0 left-0 transition-all duration-300">
      <nav className="flex flex-col h-full p-4">
        {/* Logo Section */}
        <div className="flex items-center mb-6">
          <BiBook className="text-3xl mr-2" /> {/* Updated to a book icon for clinic logo */}
          <h2 className="text-xl font-semibold">Laib Clinic</h2>
        </div>

        {/* Menu List */}
        <ul className="flex-1 space-y-4">
          {/* Dashboard */}
          <li>
            <Link to="/" className="flex items-center p-2 hover:bg-white hover:text-primary-pink rounded transition">
              <BiHome className="mr-2" />
              <span className="font-semibold">Dashboard</span>
            </Link>
          </li>
          {/* Appointments */}
          <li>
            <Link to="/appointments" className="flex items-center p-2 hover:bg-white hover:text-primary-pink rounded transition">
              <BiCalendar className="mr-2" />
              <span className="font-semibold">Appointments</span>
            </Link>
          </li>
          {/* Orders */}
          <li>
            <Link to="/orders" className="flex items-center p-2 hover:bg-white hover:text-primary-pink rounded transition">
              <BiShoppingBag className="mr-2" />
              <span className="font-semibold">Orders</span>
            </Link>
          </li>
          {/* Courses */}
          <li>
            <Link to="/courses" className="flex items-center p-2 hover:bg-white hover:text-primary-pink rounded transition">
              <BiBook className="mr-2" />
              <span className="font-semibold">Courses</span>
            </Link>
          </li>
          {/* Statistics */}
          <li>
            <Link to="/statistics" className="flex items-center p-2 hover:bg-white hover:text-primary-pink rounded transition">
              <BiStats className="mr-2" />
              <span className="font-semibold">Statistics</span>
            </Link>
          </li>
        </ul>

        {/* Optional: Logout Section */}
        <div className="mt-auto">
          <button className="w-full bg-white text-primary-pink p-2 rounded transition hover:bg-primary-pink hover:text-white font-semibold">
            Logout
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default SideBar;
