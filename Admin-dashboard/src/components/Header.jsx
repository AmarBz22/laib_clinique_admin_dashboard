import { BiMenu } from 'react-icons/bi';
import { IoIosNotifications } from "react-icons/io";
import Notification from './Notification';
import { useState } from 'react';

const Header = ({ toggleSidebar, isSidebarOpen }) => {
  const [isNotificationOpen, openNotification] = useState(false)
  return (
    <>
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
      <div className="flex items-center gap-4">
        <div className='realtive hover:cursor-pointer hover:opacity-80' onClick={()=>openNotification(!isNotificationOpen)}>
          <h3 className='rounded-full  bg-red-600 text-white text-[12px] text-bold text-center w-fit px-2 py-[2px] shadow-md absolute top-3'>3</h3>
          <IoIosNotifications className='w-8 h-8' width={50} height={50}/>
        </div>


        <div className="flex items-center">
          <img
              src="https://ui-avatars.com/api/?name=Darine+Laib&background=c7d2fe&color=3730a3&bold=true"
              alt="Profile"
              className="w-8 h-8 rounded-full"
          />
          <span className="ml-2 font-semibold text-primary-pink">Darine Laib </span>
        </div>
        
      </div>


    </header>
    {isNotificationOpen && <div className='sm:w-[400px] w-full  fixed top-20 sm:right-10 shadow-lg border-2 border-gray-300 rounded-md bg-white z-50'>
      <h3 className='text-lg font-bold text-center pt-2 '>Notifications </h3>
        <Notification openNotification={openNotification} type="Order" client="sifou" id="1" /> 
        <Notification openNotification={openNotification} type="Appointment" client="sifou" id="671c1b5966bbd9a2fbe2e7ff" />
        <Notification openNotification={openNotification} type="Training Request" client="sifou" id="1" /> 
        <Notification openNotification={openNotification} type="Order" client="sifou" id="1" />
      </div> }
    </>
  );
};

export default Header;
