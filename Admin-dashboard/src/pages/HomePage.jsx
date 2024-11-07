import { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '../components/Card';
import AppointmentsTable from '../components/AppointmentTable';
import OrdersTable from '../components/orderTable';
import { BiCalendar, BiShoppingBag, BiBook, BiStats } from 'react-icons/bi'; // Icons for the new cards

const Home = () => {
  // State to hold the data for the cards
  const [data, setData] = useState({
    totalAppointments: 0,
    pendingOrders: 0,
    activeCourses: 0,
    overallStatistics: 0,
  });

  useEffect(() => {
    // Fetch data when the component mounts
    const fetchData = async () => {
      try {
        // API requests based on your defined routes
        const appointmentsRes = await axios.get('http://localhost:4000/api/statistics/total-appointments');
        const ordersRes = await axios.get('http://localhost:4000/api/statistics/pending-orders');
        const coursesRes = await axios.get('http://localhost:4000/api/statistics/active-courses');
        const statsRes = await axios.get('http://localhost:4000/api/statistics/completed-sales'); // Adjust if you have a specific statistic endpoint for overall stats
        
        // Update state with the fetched data
        setData({
          totalAppointments: appointmentsRes.data,
          pendingOrders: ordersRes.data,
          activeCourses: coursesRes.data,
          overallStatistics: statsRes.data, // You can change this based on the statistics you need
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col xl:items-start items-center justify-center w-full mt-20 space-y-4 mb-8 px-2">
      {/* Search Box */}
      {/* Card section */}
      <div className="grid xl:grid-cols-4 grid-cols-2 w-full gap-4 mt-5 items-center px-4">
        {/* Updated Cards */}
        <Card title="Rendez-vous totaux" number={data.totalAppointments} icon={BiCalendar} />
        <Card title="Commandes en attente" number={data.pendingOrders} icon={BiShoppingBag} />
        <Card title="Cours actifs" number={data.activeCourses} icon={BiBook} />
        <Card title="Statistiques globales" number="92" icon={BiStats} />
      </div>

      {/* Grid layout for tables */}
      <div className="grid xl:grid-cols-3 grid-cols-1 gap-4 w-full">
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
