import { BiMenu } from 'react-icons/bi';
import { IoIosNotifications } from "react-icons/io";
import Notification from './Notification';
import { useEffect, useState, useContext } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';
import { BACKEND_URL } from '../../constants';
import axios from 'axios';
import { AuthContext } from '../../context/auth'; // Import the AuthContext

const Header = ({ toggleSidebar, isSidebarOpen }) => {
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const { authState } = useContext(AuthContext); // Access authState from context

  useEffect(() => {
    const socket = io(BACKEND_URL); // Connect to the socket.io server

    // Fetch notifications from the server
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/notification/`); // Replace with your notifications API endpoint
        setNotifications(response.data); // Assuming the response data contains the notifications
      } catch (error) {
        const errorMessage = error.response?.data?.message || "Failed to Fetch Notifications";
        toast.error(errorMessage);
      }
    };

    // Fetch notifications on component mount
    fetchNotifications();

    // Listen for new notifications
    socket.on('new-notification', (notification) => {
      toast.info(`New Notification Arrived`, {
        autoClose: 1000
      });
      setNotifications((prev) => [...prev, notification]); // Update notification list
    });

    return () => {
      socket.disconnect(); // Cleanup socket connection
    };
  }, []);

  // Determine the user name based on userType
  const userName = authState.user?.usertype === 'admin' ? 'Darine Laib' : 'Receptionist';

  return (
    <>
      <header className={`${isSidebarOpen ? 'responsive-div fixed md:left-64' : 'w-full '} flex items-center justify-between p-4 bg-white shadow-md h-20 fixed top-0 transition-all duration-300`}>
        <div className='flex justify-start items-center'>
          {/* Burger Menu */}
          <button onClick={toggleSidebar}>
            <BiMenu className="text-2xl" />
          </button>
          {/* Dashboard Text */}
          <span className="ml-2 font-semibold lg:text-2xl text-lg">Dashboard</span>
        </div>

        {/* Profile Section */}
        <div className="flex items-center gap-4">
          <div className='relative hover:cursor-pointer hover:opacity-80' onClick={() => setNotificationOpen(!isNotificationOpen)}>
            {/* Notification Count */}
            {notifications.length > 0 && (
              <h3 className='rounded-full bg-red-600 text-white text-[12px] font-bold text-center w-fit px-2 py-[2px] shadow-md absolute -top-1 -right-1'>
                {notifications.length}
              </h3>
            )}
            <IoIosNotifications className='w-8 h-8' />
          </div>

          <div className="flex items-center">
            <img
              src={`https://ui-avatars.com/api/?name=${userName.replace(' ', '+')}&background=c7d2fe&color=3730a3&bold=true`}
              alt="Profile"
              className="w-8 h-8 rounded-full"
            />
            <span className="ml-2 font-semibold text-primary-pink">{userName}</span> {/* Display the user name */}
          </div>
        </div>
      </header>

      {isNotificationOpen && (
        <div className='sm:w-[400px] max-h-[400px] overflow-y-auto w-full fixed top-20 sm:right-10 shadow-lg border-2 border-gray-300 rounded-md bg-white z-50'>
          <h3 className='text-lg font-bold text-center pt-2'>Notifications</h3>
          {notifications.map((notification) => (
            <Notification 
              timestamp={notification.createdAt} 
              setNotifications={setNotifications} 
              key={notification._id} 
              noty_id={notification._id} 
              openNotification={setNotificationOpen} // Pass function to open notification
              type={notification.type} 
              client={notification.username} 
              id={notification.id} 
            />
          ))}
        </div>
      )}
    </>
  );
};

export default Header;
