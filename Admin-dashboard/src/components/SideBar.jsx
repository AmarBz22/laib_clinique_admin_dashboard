import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate for navigation
import { useState } from 'react'; // Import useState for managing loading state
import { BiHome, BiCalendar, BiShoppingBag, BiBook, BiStats } from 'react-icons/bi'; // Import necessary icons
import { IoMdCloseCircle } from "react-icons/io";
import { FaSpinner } from "react-icons/fa"; // Import spinner icon
import { clearUserAuthInfo } from '../../context/auth';

const SideBar = ({ toggleSidebar, isSidebarOpen }) => {
  const [isLoading, setIsLoading] = useState(false); // State to handle loading state
  const navigate = useNavigate(); // Initialize useNavigate for redirection

  const handleLogout = () => {
    setIsLoading(true); // Show loading spinner
    clearUserAuthInfo(); // Clear the auth information

    // Simulate a delay for the loading spinner (optional, for effect)
    setTimeout(() => {
      setIsLoading(false); // Hide loading spinner
      navigate('/login'); // Redirect to the login page
    }, 1000); // 1 second delay, adjust as needed
  };

  return (
    <aside className="md:static fixed top-0 bottom-0 left-0 z-50 md:w-64 sm:w-1/2 w-3/4 bg-primary-pink h-full text-white transition-all duration-300">
      <nav className="relative flex flex-col p-4 md:items-start items-center h-screen">
        {/* Logo Section */}
        <div className="flex justify-center items-center w-full">
          <div className="flex items-center mb-6">
            <BiBook className="text-3xl mr-2" /> {/* Updated to a book icon for clinic logo */}
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
            className="w-full bg-white text-primary-pink hover:bg-black p-2 rounded transition  font-semibold flex items-center justify-center"
            disabled={isLoading}
          >
            Logout
            {isLoading && (
              <FaSpinner className="animate-spin ml-2" /> // Add the spinner with animation
            )}
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default SideBar;
