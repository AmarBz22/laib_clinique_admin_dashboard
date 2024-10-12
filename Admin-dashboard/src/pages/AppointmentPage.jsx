import React, { useState, useEffect } from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import { AiFillCloseCircle } from 'react-icons/ai';
import { BiShow } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from '../../constants/index';

const AppointmentsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [actionType, setActionType] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/appointments/get_appointment`);
        setAppointments(response.data);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError('Error fetching appointments');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleStatusChange = (e) => setFilterStatus(e.target.value);
  const handleConfirmDeleteClick = (appointment, action) => {
    setSelectedAppointment(appointment);
    setActionType(action);
    setShowModal(true);
  };
  const closeModal = () => setShowModal(false);
  const handleRowClick = (appointmentId) => {
    navigate(`/appointments/${appointmentId}`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="md:p-6 flex flex-col justify-center items-center mt-20 mb-10 px-2">
      <h1 className="text-2xl font-semibold mb-8 text-center">Appointments</h1>

      <div className="md:flex md:gap-0 md:justify-between w-full items-center grid grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by patient name"
          value={searchTerm}
          onChange={handleSearchChange}
          className="p-2 border rounded"
        />
        <select
          value={filterStatus}
          onChange={handleStatusChange}
          className="p-2 border rounded"
        >
          <option value="all">All Statuses</option>
          <option value="upcoming">Upcoming</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className='w-full mt-5 border border-gray-200 rounded-lg shadow-md'>
        <table className="w-full border-collapse bg-white">
          <thead>
            <tr>
              <th className="text-gray-800 font-semibold p-3 text-left">Date</th>
              <th className="text-gray-800 font-semibold p-3 text-left">Phone Number</th>
              <th className="text-gray-800 font-semibold p-3 text-left">Patient</th>
              <th className="text-gray-800 font-semibold p-3 text-left">Status</th>
              <th className="text-gray-800 font-semibold p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length > 0 ? (
              appointments.map((appointment) => (
                <tr
                  key={appointment._id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handleRowClick(appointment._id)}
                >
                  <td className="p-3 border-b border-gray-200">{formatDate(appointment.date)}</td>
                  <td className="p-3 border-b border-gray-200">{appointment.phoneNumber}</td>
                  <td className="p-3 border-b border-gray-200">{appointment.fullName}</td>
                  <td className="p-3 border-b border-gray-200">{appointment.status}</td>
                  <td className="p-3 border-b border-gray-200">
                    <div className='flex items-center gap-2'>
                      <BiShow
                        className="text-blue-500 cursor-pointer"
                        title="View Appointment"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRowClick(appointment._id);
                        }}
                      />
                      <FaTrashAlt
                        className="text-red-500 cursor-pointer"
                        title="Delete Appointment"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleConfirmDeleteClick(appointment, 'delete');
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-3">No appointments found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppointmentsPage;
