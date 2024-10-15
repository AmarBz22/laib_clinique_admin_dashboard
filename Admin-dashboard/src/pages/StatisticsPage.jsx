import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement, // Required for pie chart
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
  ArcElement, // Register ArcElement for pie charts
  LineElement,
  PointElement,
  Filler
);

const StatisticsPage = () => {
  // Sample data for appointments by month
  const appointmentsData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Number of Appointments',
        data: [30, 50, 40, 70, 60, 90, 100],
        backgroundColor: '#FF5E7E',
      },
    ],
  };

  // Sample data for sales over time
  const salesData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Number of Sales',
        data: [20, 40, 35, 60, 55, 70, 80],
        fill: true,
        backgroundColor: '#F9A8D4',
        borderColor: '#FF5E7E',
        borderWidth: 2,
      },
    ],
  };

 

  return (
    <div className=" mt-20 flex flex-col items-center gap-8 ">
      <h1 className="text-2xl font-semibold  text-center mt-10">Statistics </h1>
      <div className="grid xl:grid-cols-4 grid-cols-2 w-full gap-4 mt-5 items-center px-4">
        {/* Updated Cards */}
        <Card title="Total Appointments" number="250" icon={BiCalendar} />
        <Card title="Pending Orders" number="45" icon={BiShoppingBag} />
        <Card title="Active Courses" number="5" icon={BiBook} />
        <Card title="Overall Statistics" number="92%" icon={BiStats} />
      </div>
      <div  className="w-full grid grid-cols-2 gap-4 px-4">
          <div className="chart-container shadow-md p-4 rounded-lg">
            <Bar data={appointmentsData} />
            <h2 className="text-center font-bold ">Number of Appointments by Month</h2>
          </div>
          <div className="chart-container shadow-md p-4 rounded-lg">
            <Line data={salesData} />
            <h2 className="text-center font-bold ">Number of Oders Over Time</h2>
          </div>          
      </div>
     
     
      
    </div>
  );
};

export default StatisticsPage;
