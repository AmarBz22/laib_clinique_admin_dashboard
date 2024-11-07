import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from '../../constants/index'; // Ajustez le chemin d'importation si nécessaire
import { toast } from 'react-toastify';

const AppointmentsTable = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/appointments/get_appointment`);
        setAppointments(response.data);
      } catch (error) {
        if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  if (loading) return <div>Chargement...</div>;

  // Limiter aux 6 premiers rendez-vous et formater la date
  const limitedAppointments = appointments.slice(0, 6).map(appointment => ({
    ...appointment,
    date: appointment.date.split('T')[0], // Formater la date au format AAAA-MM-JJ
  }));

  return (
    <div className="w-full mt-5 border border-gray-200 rounded-lg shadow-md">
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Rendez-vous récents</h2>
        <Link to="/appointments" className="bg-primary-pink text-white px-4 py-2 rounded transition hover:bg-light-pink font-semibold">
          Voir tout
        </Link>
      </div>
      <table className="w-full border-collapse bg-white">
        <thead>
          <tr>
            <th className="text-gray-800 font-semibold p-3 text-left">Date</th>
            <th className="text-gray-800 font-semibold p-3 text-left">Patient</th>
            <th className="text-gray-800 font-semibold p-3 text-left">Catégorie</th>
          </tr>
        </thead>
        <tbody>
          {limitedAppointments.map((appointment) => (
            <tr key={appointment.id} className="hover:bg-gray-50 transition-colors">
              <td className="p-3 border-b border-gray-200">{appointment.date}</td>
              <td className="p-3 border-b border-gray-200">{appointment.fullName}</td>
              <td className="p-3 border-b border-gray-200">{appointment.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AppointmentsTable;
