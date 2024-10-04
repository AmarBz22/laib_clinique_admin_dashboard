import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams

const AppointmentInformationPage = () => {
  const { appointmentId } = useParams(); // Extract appointment ID from URL

  // Static appointment data for testing (In real app, fetch this data using appointmentId)
  const appointments = [
    { id: 1, date: '2024-10-01', time: '10:00 AM', patient: { name: 'John Doe', address: '123 Main St, Springfield, IL', phone: '555-123-4567' }, status: 'In Progress' },
    { id: 2, date: '2024-10-02', time: '11:00 AM', patient: { name: 'Jane Smith', address: '456 Elm St, Springfield, IL', phone: '555-987-6543' }, status: 'Pending' },
    { id: 3, date: '2024-10-03', time: '01:00 PM', patient: { name: 'Michael Brown', address: '789 Oak St, Springfield, IL', phone: '555-123-7890' }, status: 'Review' },
    { id: 4, date: '2024-10-04', time: '02:00 PM', patient: { name: 'Emma Johnson', address: '321 Pine St, Springfield, IL', phone: '555-654-3210' }, status: 'Completed' },
  ];

  const [appointment, setAppointment] = useState(null);
  const [message, setMessage] = useState('');

  // Fetch the specific appointment based on the appointmentId
  useEffect(() => {
    const fetchedAppointment = appointments.find(appt => appt.id === parseInt(appointmentId));
    if (fetchedAppointment) {
      setAppointment(fetchedAppointment);
    }
  }, [appointmentId]);

  const handleDateChange = (e) => {
    setAppointment((prev) => ({ ...prev, date: e.target.value }));
  };

  const handleTimeChange = (e) => {
    setAppointment((prev) => ({ ...prev, time: e.target.value }));
  };

  const handleConfirm = () => {
    console.log(`Updated Appointment: ${appointment.date} at ${appointment.time}`);
    setMessage('Appointment updated successfully!');
  };

  const handleCancel = () => {
    console.log(`Appointment ${appointment.id} canceled`);
    setMessage('Appointment canceled successfully!');
  };

  if (!appointment) {
    return <p>Loading appointment details...</p>;
  }

  return (
    <div className="p-6 mt-20">
      <h1 className="text-2xl font-semibold mb-4 text-center">Appointment Information</h1>

      <div className="border border-gray-300 shadow-lg p-4 rounded-lg mb-6 bg-white">
        <div className="mb-4">
          <label className="block mb-2">Patient Name:</label>
          <input
            type="text"
            value={appointment.patient.name}
            disabled
            className="p-2 border rounded w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Patient Address:</label>
          <input
            type="text"
            value={appointment.patient.address}
            disabled
            className="p-2 border rounded w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Phone Number:</label>
          <input
            type="text"
            value={appointment.patient.phone}
            disabled
            className="p-2 border rounded w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Date:</label>
          <input
            type="date"
            value={appointment.date}
            onChange={handleDateChange}
            className="p-2 border rounded w-full"
          />
        </div>

        <div className="mb-4">
            <label className="block mb-2">Time:</label>
            <input
                type="time"
                value={appointment.time}
                onChange={handleTimeChange}
                className="p-2 border rounded w-full"
            />
        </div>


        <div className="flex justify-end space-x-2">
          <button className="bg-primary-pink text-white p-2 rounded" onClick={handleConfirm}>Confirm Changes</button>
          <button className="bg-gray-400 text-white p-2 rounded" onClick={handleCancel}>Cancel</button>
        </div>

        {message && <p className="mt-4 text-green-500">{message}</p>}
      </div>
    </div>
  );
};

export default AppointmentInformationPage;
