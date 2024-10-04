import React, { useState } from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import { AiFillCloseCircle } from 'react-icons/ai';
import { BiShow } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const AppointmentsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [actionType, setActionType] = useState('');

  const navigate = useNavigate(); // Hook to navigate

  // Mock data for appointments
  const appointments = [
    { id: 1, date: '2024-10-01', time: '10:00 AM', patient: 'John Doe', status: 'In Progress' },
    { id: 2, date: '2024-10-02', time: '11:00 AM', patient: 'Jane Smith', status: 'Pending' },
    { id: 3, date: '2024-10-03', time: '01:00 PM', patient: 'Michael Brown', status: 'Review' },
    { id: 4, date: '2024-10-04', time: '02:00 PM', patient: 'Emma Johnson', status: 'Completed' },
    { id: 5, date: '2024-10-05', time: '03:00 PM', patient: 'Sophia Wilson', status: 'In Progress' },
  ];

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleStatusChange = (e) => setFilterStatus(e.target.value);

  const handleConfirmDeleteClick = (appointment, action) => {
    setSelectedAppointment(appointment);
    setActionType(action);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleAction = () => {
    if (actionType === 'delete') {
      console.log(`Appointment ${selectedAppointment.id} deleted`);
    }
    closeModal();
  };

  const handleRowClick = (appointmentId) => {
    navigate(`/appointments/${appointmentId}`); // Navigate to appointment details
  };

  return (
    <div className="p-6 mt-20">
      <h1 className="text-2xl font-semibold mb-8 text-center">Appointments</h1>

      <div className="flex justify-between mb-4">
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
        <button className="bg-primary-pink text-white p-2 rounded">Add Appointment</button>
      </div>

      <table className="w-full border-collapse bg-white rounded-lg shadow-md">
        <thead>
          <tr>
            <th className="text-gray-800 font-semibold p-3 text-left">Date</th>
            <th className="text-gray-800 font-semibold p-3 text-left">Time</th>
            <th className="text-gray-800 font-semibold p-3 text-left">Patient</th>
            <th className="text-gray-800 font-semibold p-3 text-left">Status</th>
            <th className="text-gray-800 font-semibold p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr
              key={appointment.id}
              className="hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => handleRowClick(appointment.id)} // Navigate when row is clicked
            >
              <td className="p-3 border-b border-gray-200">{appointment.date}</td>
              <td className="p-3 border-b border-gray-200">{appointment.time}</td>
              <td className="p-3 border-b border-gray-200">{appointment.patient}</td>
              <td className="p-3 border-b border-gray-200">{appointment.status}</td>
              <td className="p-3 border-b border-gray-200 flex space-x-2">
                <BiShow
                  className="text-blue-500 cursor-pointer"
                  title="View Appointment"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering row click
                    handleRowClick(appointment.id); // Directly navigate to appointment details
                  }}
                />
                <FaTrashAlt
                  className="text-red-500 cursor-pointer"
                  title="Delete Appointment"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering row click
                    handleConfirmDeleteClick(appointment, 'delete');
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AppointmentsPage;
