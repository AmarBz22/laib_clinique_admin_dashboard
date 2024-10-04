import React from 'react';
import Card from '../components/Card';
import AppointmentsTable from '../components/AppointmentTable';
import OrdersTable from '../components/orderTable';
import { BiCalendar, BiShoppingBag, BiBook, BiStats } from 'react-icons/bi'; // Icons for the new cards

const Home = () => {
  return (
    <div className="flex flex-col mt-20 space-y-4">
      {/* Card section */}
      <div className="flex justify-between mt-5 space-x-4">
        {/* Updated Cards */}
        <Card title="Total Appointments" number="250" icon={BiCalendar} />
        <Card title="Pending Orders" number="45" icon={BiShoppingBag} />
        <Card title="Active Courses" number="5" icon={BiBook} />
        <Card title="Overall Statistics" number="92%" icon={BiStats} />
      </div>

      {/* Grid layout for tables */}
      <div className="grid grid-cols-3 gap-4">
        {/* AppointmentsTable spans 2 columns */}
        <div className="col-span-2"> 
          <AppointmentsTable />
        </div>
        {/* OrdersTable spans 1 column */}
        <div className="col-span-1"> 
          <OrdersTable />
        </div>
      </div>
    </div>
  );
};

export default Home;
