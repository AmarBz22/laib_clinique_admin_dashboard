import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from '../../constants/index';
import { toast } from 'react-toastify';

const AppointmentInformationPage = () => {
  const { appointmentId } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionType, setActionType] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointment = async () => {
      if (!appointmentId) {
        setMessage('Appointment ID is missing.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${BACKEND_URL}/api/appointments/${appointmentId}`);
        setAppointment(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching appointment:', error);
        setMessage('Error fetching appointment details.');
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [appointmentId]);

  const openModal = (type) => {
    setActionType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setActionType(null);
  };

  const handleTimeChange = (e) => {
    const updatedTime = e.target.value;
    setAppointment((prev) => ({ ...prev, time: updatedTime }));
  };

  const handleConfirm = async () => {
    try {
      if(!appointment.time)
      {
        toast.error('Please Select the time to confirm the order'); 
        closeModal()
      }
      else{
        await axios.put(`${BACKEND_URL}/api/appointments/confirm/${appointmentId}`, {
          time: appointment.time,
          status: 'Confirmed', // You might need to include this depending on your backend logic
        });
        setMessage('Appointment confirmed successfully!');
        closeModal();
        setTimeout(() => {
          navigate('/appointments');
        }, 2000);
      }      
    } catch (error) {
      console.error('Error updating appointment:', error.response?.data || error);
      setMessage('Error updating appointment. ' + (error.response?.data?.message || ''));
    }
  };
  

  const handleCancel = async () => {
    try {
      await axios.put(`${BACKEND_URL}/api/appointments/cancel/${appointmentId}`);
      setMessage('Appointment canceled successfully!');
      setAppointment(null);
      closeModal();
      setTimeout(() => {
        navigate('/appointments');
      }, 2000);
    } catch (error) {
      console.error('Error canceling appointment:', error);
      setMessage('Error canceling appointment. Please try again.');
    }
  };

  if (loading) {
    return <p>Loading appointment details...</p>;
  }

  if (!appointment) {
    return <p>No appointment found.</p>;
  }

  return (
    <div className="p-6 mt-20">
      <h1 className="text-2xl font-semibold mb-4 text-center">Appointment Information</h1>

      <div className="border border-gray-300 shadow-lg p-4 rounded-lg mb-6 bg-white">
        <div className="mb-4">
          <label className="block mb-2">Patient Name:</label>
          <input
            type="text"
            value={appointment.fullName}
            disabled
            className="p-2 border rounded w-full bg-gray-100"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Patient Address:</label>
          <input
            type="text"
            value={appointment.location}
            disabled
            className="p-2 border rounded w-full bg-gray-100"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Phone Number:</label>
          <input
            type="text"
            value={appointment.phoneNumber}
            disabled
            className="p-2 border rounded w-full bg-gray-100"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Chosen Date:</label>
          <input
            type="date"
            value={appointment.date?.substring(0, 10)} // Ensures the correct date format for input
            readOnly
            className="p-2 border rounded w-full bg-gray-100"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Status:</label>
          <input
            type="text"
            value={appointment.status} // Ensures the correct date format for input
            readOnly
            className="p-2 border rounded w-full bg-gray-100"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Time:</label>
          <input
            type="time"
            disabled={appointment.status !== 'Pending'}
            value={appointment.time}
            onChange={handleTimeChange}
            className={appointment.status !== 'Pending' ? "p-2 border rounded w-full bg-gray-100" :'p-2 border rounded w-full' }
          />
        </div>

        <div className="flex justify-end space-x-2">
  {appointment.status === 'Confirmed' || appointment.status === 'Cancelled' ? (
    <>
      <button className="bg-primary-pink text-white p-2 rounded" onClick={() => navigate('/appointments')}>
        Back to Appointments
      </button>
    </>
  ) : (
    <>
      <button className="bg-primary-pink text-white p-2 rounded" onClick={() => openModal('confirm')}>
        Confirm 
      </button>
      <button className="bg-gray-400 text-white p-2 rounded" onClick={() => openModal('cancel')}>
        Cancel
      </button>
    </>
  )}
</div>



        {message && <p className="mt-4 text-green-500">{message}</p>}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-1/3">
            <h3 className="text-lg font-semibold mb-4">{actionType === 'confirm' ? 'Confirm Appointment' : 'Cancel Appointment'}</h3>
            <p className="mb-4">
              Are you sure you want to {actionType === 'confirm' ? 'confirm' : 'cancel'} this appointment?
            </p>
            <div className="flex justify-end">
              <button className=" order-2 bg-gray-300 text-black px-4 py-2 rounded ml-2" onClick={closeModal}>
                {/* Cancel */}
                NO
              </button>
              <button
                className={` order-1 px-4 py-2 rounded ${actionType === 'confirm' ? 'bg-primary-pink text-white' : 'bg-red-500 text-white'}`}
                onClick={actionType === 'confirm' ? handleConfirm : handleCancel}
              >
                {/* {actionType === 'confirm' ? 'Confirm' : 'Cancel'} */}
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentInformationPage;
