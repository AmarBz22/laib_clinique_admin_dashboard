import React from 'react';
import Card from '../components/Card';
import AppointmentsTable from '../components/AppointmentTable';
import OrdersTable from '../components/orderTable';
import { BiCalendar, BiShoppingBag, BiBook, BiStats, BiSearch } from 'react-icons/bi'; // Icons for the new cards

const Home = () => {
  return (
    <div className="flex flex-col xl:items-start items-center justify-center w-full mt-20 space-y-4 mb-8 px-2">
      {/* Search Box */}
      <div className="block lg:w-[25%] w-[350px] flex-grow mx-4 self-center mt-5">
        <div className="relative  mx-auto">
          <BiSearch className="absolute left-2 top-2 text-black text-3xl" />
          <input
            type="text"
            placeholder="Search here..."
            className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-primary-pink"
            style={{ borderRadius: '12px' }}
          />
        </div>
      </div>
      {/* Card section */}
      <div className="grid xl:grid-cols-4 grid-cols-2 w-full gap-4 mt-5 items-center px-4">
        {/* Updated Cards */}
        <Card title="Total Appointments" number="250" icon={BiCalendar} />
        <Card title="Pending Orders" number="45" icon={BiShoppingBag} />
        <Card title="Active Courses" number="5" icon={BiBook} />
        <Card title="Overall Statistics" number="92%" icon={BiStats} />
      </div>

      
      
      {/* Grid layout for tables */}
      <div className="grid xl:grid-cols-3 grid-cols-1  w-full">
        {/* AppointmentsTable spans 2 columns */}
        <div className="lg:col-span-2"> 
          <AppointmentsTable />
        </div>
        {/* OrdersTable spans 1 column */}
        <div className="lg:col-span-1"> 
          <OrdersTable />
        </div>
       
      </div>
    </div>
  );
};

export default Home;
