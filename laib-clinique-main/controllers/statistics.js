import React, { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
  Filler
} from 'chart.js';
import Card from '../components/Card';
import { BiBook, BiCalendar, BiShoppingBag, BiStats } from 'react-icons/bi';

// Register necessary components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
  Filler
);

const StatisticsPage = () => {
  const [appointmentsData, setAppointmentsData] = useState({ labels: [], datasets: [] });
  const [salesData, setSalesData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        // Fetch completed appointments
        const appointmentsResponse = await fetch('http://localhost:4000/api/statistics/completed-appointments');
        if (!appointmentsResponse.ok) {
          throw new Error('Network response was not ok for appointments');
        }
        const appointments = await appointmentsResponse.json();
    
        // Fetch completed sales
        const salesResponse = await fetch('http://localhost:4000/api/statistics/completed-sales');
        if (!salesResponse.ok) {
          throw new Error('Network response was not ok for sales');
        }
        const sales = await salesResponse.json();
    
        // Prepare data for the charts
        const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    
        setAppointmentsData({
          labels: appointments.labels,
          datasets: [{
            label: 'Number of Appointments',
            data: appointments.data, // Use data from the response
            backgroundColor: '#FF5E7E',
          }],
        });
    
        setSalesData({
          labels: sales.labels,
          datasets: [{
            label: 'Number of Sales',
            data: sales.data, // Use data from the response
            fill: true,
            backgroundColor: '#F9A8D4',
            borderColor: '#FF5E7E',
            borderWidth: 2,
          }],
        });
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

    fetchStatistics();
  }, []);

  return (
    <div className="mt-20 flex flex-col items-center gap-8">
      <h1 className="text-2xl font-semibold text-center mt-10">Statistics</h1>
      <div className="grid xl:grid-cols-4 grid-cols-2 w-full gap-4 mt-5 items-center px-4">
        <Card title="Total Appointments" number="250" icon={BiCalendar} />
        <Card title="Pending Orders" number="45" icon={BiShoppingBag} />
        <Card title="Active Courses" number="5" icon={BiBook} />
        <Card title="Overall Statistics" number="92%" icon={BiStats} />
      </div>
      <div className="w-full grid grid-cols-2 gap-4 px-4">
        <div className="chart-container shadow-md p-4 rounded-lg">
          <Bar data={appointmentsData} />
          <h2 className="text-center font-bold">Number of Appointments by Month</h2>
        </div>
        <div className="chart-container shadow-md p-4 rounded-lg">
          <Line data={salesData} />
          <h2 className="text-center font-bold">Number of Orders Over Time</h2>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;
