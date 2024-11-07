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
import CourseStatsTable from '../components/CourseStatics';
import { BiBook, BiCalendar, BiShoppingBag, BiStats } from 'react-icons/bi';

// Enregistrer les composants nécessaires
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
  const [courseStats, setCourseStats] = useState([]);
  const [pendingOrders, setPendingOrders] = useState(0);  // For pending orders
  const [activeCourses, setActiveCourses] = useState(0);  // For active courses
  const [totalAppointments, setTotalAppointments] = useState(0); // For total appointments
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      setLoading(true);
      try {
        const appointmentsResponse = await fetch('http://localhost:4000/api/statistics/completed-appointments');
        if (!appointmentsResponse.ok) throw new Error('Échec de la récupération des rendez-vous');

        const salesResponse = await fetch('http://localhost:4000/api/statistics/completed-sales');
        if (!salesResponse.ok) throw new Error('Échec de la récupération des ventes');

        const courseStatsResponse = await fetch('http://localhost:4000/api/statistics/courseStatics');
        if (!courseStatsResponse.ok) throw new Error('Échec de la récupération des statistiques de cours');

        const pendingOrdersResponse = await fetch('http://localhost:4000/api/statistics/pending-orders');
        if (!pendingOrdersResponse.ok) throw new Error('Échec de la récupération des commandes en attente');

        const activeCoursesResponse = await fetch('http://localhost:4000/api/statistics/active-courses');
        if (!activeCoursesResponse.ok) throw new Error('Échec de la récupération des cours actifs');

        const totalAppointmentsResponse = await fetch('http://localhost:4000/api/statistics/total-appointments');
        if (!totalAppointmentsResponse.ok) throw new Error('Échec de la récupération du total des rendez-vous');

        // Parsing responses
        const appointments = await appointmentsResponse.json();
        const sales = await salesResponse.json();
        const courses = await courseStatsResponse.json();
        const pendingOrdersCount = await pendingOrdersResponse.json();
        const activeCoursesCount = await activeCoursesResponse.json();
        const totalAppointmentsCount = await totalAppointmentsResponse.json();

        setAppointmentsData({
          labels: appointments.labels,
          datasets: [{
            label: 'Nombre de Rendez-vous',
            data: appointments.data,
            backgroundColor: '#FF5E7E',
          }],
        });

        setSalesData({
          labels: sales.labels,
          datasets: [{
            label: 'Nombre de Ventes',
            data: sales.data,
            fill: true,
            backgroundColor: '#F9A8D4',
            borderColor: '#FF5E7E',
            borderWidth: 2,
          }],
        });

        setCourseStats(courses);
        setPendingOrders(pendingOrdersCount);
        setActiveCourses(activeCoursesCount);
        setTotalAppointments(totalAppointmentsCount);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error}</div>;

  return (
    <div className="mt-20 flex flex-col items-center gap-8">
      <h1 className="text-2xl font-semibold text-center mt-10">Statistiques</h1>
      <div className="grid xl:grid-cols-4 grid-cols-2 w-full gap-4 mt-5 items-center px-4">
        <Card title="Total des Rendez-vous" number={totalAppointments || 0} icon={BiCalendar} />
        <Card title="Commandes en Attente" number={pendingOrders || 0} icon={BiShoppingBag} />
        <Card title="Cours Actifs" number={activeCourses || 0} icon={BiBook} />
        <Card title="Statistiques Globales" number="92%" icon={BiStats} />
      </div>
      <div className="w-full grid grid-cols-2 gap-4 px-4">
        <div className="chart-container shadow-md p-4 rounded-lg">
          <Bar data={appointmentsData} />
          <h2 className="text-center font-bold">Nombre de Rendez-vous par Mois</h2>
        </div>
        <div className="chart-container shadow-md p-4 rounded-lg">
          <Line data={salesData} />
          <h2 className="text-center font-bold">Nombre de Commandes au Fil du Temps</h2>
        </div>
      </div>
      <CourseStatsTable courseStats={courseStats} />
    </div>
  );
};

export default StatisticsPage;
