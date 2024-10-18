import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { BiHome, BiCalendar, BiShoppingBag, BiBook, BiStats } from 'react-icons/bi';
import { IoMdCloseCircle } from "react-icons/io";
import { FaSpinner } from "react-icons/fa";
import { clearUserAuthInfo } from '../../context/auth';

const SideBar = ({ toggleSidebar, isSidebarOpen }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = () => {
    setIsLoading(true);
    clearUserAuthInfo();
    setTimeout(() => {
      setIsLoading(false);
      navigate('/login');
    }, 1000);
  };

  return (
    <aside className="md:fixed  fixed top-0 h-full left-0 z-50 md:w-64 sm:w-1/2 w-3/4 bg-primary-pink text-white transition-all duration-300">
      <nav className=" relative flex flex-col p-4 md:items-start items-center h-screen">
        {/* Logo Section */}
        <div className="flex justify-center items-center w-full">
          <div className="flex items-center mb-6">
            <BiBook className="text-3xl mr-2" />
            <h2 className="text-xl font-semibold">Laib Clinic</h2>
          </div>
          {isSidebarOpen && (
            <IoMdCloseCircle
              onClick={toggleSidebar}
              className="md:hidden absolute right-4 top-4 w-6 h-6"
              color="white"
            />
          )}
        </div>

        {/* Menu List */}
        <ul className="flex-1 space-y-4">
          {/* Dashboard */}
          <li>
            <Link
              to="/"
              onClick={() => {
                if (window.innerWidth < 768) {
                  toggleSidebar();
                }
              }}
              className="flex items-center p-2 hover:bg-white hover:text-primary-pink rounded transition"
            >
              <BiHome className="mr-2" />
              <span className="font-semibold">Dashboard</span>
            </Link>
          </li>
          {/* Appointments */}
          <li>
            <Link
              to="/appointments"
              onClick={() => {
                if (window.innerWidth < 768) {
                  toggleSidebar();
                }
              }}
              className="flex items-center p-2 hover:bg-white hover:text-primary-pink rounded transition"
            >
              <BiCalendar className="mr-2" />
              <span className="font-semibold">Appointments</span>
            </Link>
          </li>
          {/* Orders */}
          <li>
            <Link
              to="/orders"
              onClick={() => {
                if (window.innerWidth < 768) {
                  toggleSidebar();
                }
              }}
              className="flex items-center p-2 hover:bg-white hover:text-primary-pink rounded transition"
            >
              <BiShoppingBag className="mr-2" />
              <span className="font-semibold">Orders</span>
            </Link>
          </li>
          {/* Products */}
          <li>
            <Link
              to="/products"
              onClick={() => {
                if (window.innerWidth < 768) {
                  toggleSidebar();
                }
              }}
              className="flex items-center p-2 hover:bg-white hover:text-primary-pink rounded transition"
            >
              <BiShoppingBag className="mr-2" />
              <span className="font-semibold">Products</span>
            </Link>
          </li>
          {/* Courses */}
          <li>
            <Link
              to="/courses"
              onClick={() => {
                if (window.innerWidth < 768) {
                  toggleSidebar();
                }
              }}
              className="flex items-center p-2 hover:bg-white hover:text-primary-pink rounded transition"
            >
              <BiBook className="mr-2" />
              <span className="font-semibold">Courses</span>
            </Link>
          </li>
          {/* Statistics */}
          <li>
            <Link
              to="/statistics"
              onClick={() => {
                if (window.innerWidth < 768) {
                  toggleSidebar();
                }
              }}
              className="flex items-center p-2 hover:bg-white hover:text-primary-pink rounded transition"
            >
              <BiStats className="mr-2" />
              <span className="font-semibold">Statistics</span>
            </Link>
          </li>
        </ul>

        {/* Logout Button */}
        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="w-full bg-white text-primary-pink hover:bg-black p-2 rounded transition font-semibold flex items-center justify-center"
            disabled={isLoading}
          >
            Logout
            {isLoading && (
              <FaSpinner className="animate-spin ml-2" />
            )}
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default SideBar;
