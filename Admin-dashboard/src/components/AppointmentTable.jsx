import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from '../../constants/index'; // Adjust the import path as needed

const AppointmentsTable = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/appointments/get_appointment`);
        setAppointments(response.data);
      } catch (err) {
        setError('Error fetching appointments');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  // Limit to the first 6 appointments and format the date
  const limitedAppointments = appointments.slice(0, 6).map(appointment => ({
    ...appointment,
    date: appointment.date.split('T')[0], // Format date as YYYY-MM-DD
  }));

  return (
    <div className="w-full mt-5 border border-gray-200 rounded-lg shadow-md">
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Recent Appointments</h2>
        <Link to="/appointments" className="bg-primary-pink text-white px-4 py-2 rounded transition hover:bg-light-pink font-semibold">
          See All
        </Link>
      </div>
      <table className="w-full border-collapse bg-white">
        <thead>
          <tr>
            <th className="text-gray-800 font-semibold p-3 text-left">Date</th>
            <th className="text-gray-800 font-semibold p-3 text-left">Patient</th>
            <th className="text-gray-800 font-semibold p-3 text-left">Category</th>
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
