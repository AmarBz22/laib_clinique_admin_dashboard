import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from '../../constants/index';
import { toast } from 'react-toastify';

const AppointmentInformationPage = () => {
  const { appointmentId } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionType, setActionType] = useState(null);
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointment = async () => {
      if (!appointmentId) {
        toast.error('Appointment ID is missing.');
        setLoading(false);
        return;
      }
      setError(null);
      try {
        const response = await axios.get(`${BACKEND_URL}/api/appointments/${appointmentId}`);
        setAppointment(response.data);
        setLoading(false);
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        toast.error(errorMessage);
        setError(errorMessage);
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

  const handleDateChange = (e) => {
    const updateDate = e.target.value;
    console.log("Updated Date: ", updateDate); // Log the updated date
    setAppointment((prev) => ({ ...prev, date: updateDate }));
  };
  

  const handleConfirm = async () => {
    if (!appointment.time) {
      toast.error('Please select the time to confirm the order');
      closeModal();
      return;
    }
  
    try {
      // Send the PUT request and store the response
      const response = await axios.put(`${BACKEND_URL}/api/appointments/confirm/${appointmentId}`, {
        time: appointment.time,
        date: appointment.date, // Include the date if needed
        status: 'Confirmed',
      });
  
      // Log the response data to the console
      console.log('Response from server: ', response.data);
  
      // Show success message
      toast.success('Appointment confirmed successfully!');
      closeModal();
      navigate('/appointments');
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(errorMessage);
    }
  };
  

  const handleCancel = async () => {
    try {
      await axios.put(`${BACKEND_URL}/api/appointments/cancel/${appointmentId}`);
      toast.success('Appointment canceled successfully!');
      setAppointment(null);
      closeModal();
      navigate('/appointments');
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(errorMessage);
    }
  };

  if (loading) {
    return <h3 className="flex justify-center items-center h-screen text-lg font-bold">Loading ...</h3>;
  }

  if (error) {
    return <h3 className="flex justify-center items-center h-screen text-lg font-bold text-red-600">{error}</h3>;
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
            disabled={appointment.status !== 'Pending'}
            value={appointment.date?.substring(0, 10)}
            onChange={handleDateChange}
            className={appointment.status !== 'Pending' ? "p-2 border rounded w-full bg-gray-100" : "p-2 border rounded w-full"}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Status:</label>
          <input
            type="text"
            value={appointment.status}
            readOnly
            className="p-2 border rounded w-full bg-gray-100"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Time:</label>
          <input
            type="time"
            disabled={appointment.status !== 'Pending'}
            value={appointment.time} // Ensure the time is formatted correctly
            onChange={handleTimeChange}
            className={appointment.status !== 'Pending' ? "p-2 border rounded w-full bg-gray-100" : "p-2 border rounded w-full"}
          />
        </div>

        <div className="flex justify-end space-x-2">
          {appointment.status === 'Confirmed' || appointment.status === 'Cancelled' ? (
            <button className="bg-primary-pink text-white p-2 rounded" onClick={() => navigate('/appointments')}>
              Back to Appointments
            </button>
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
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-94">
            <h3 className="text-lg font-semibold mb-4">{actionType === 'confirm' ? 'Confirm Appointment' : 'Cancel Appointment'}</h3>
            <p className="mb-4">
              Are you sure you want to {actionType === 'confirm' ? 'confirm' : 'cancel'} this appointment?
            </p>
            <div className="flex justify-end">
              <button className="order-2 bg-gray-300 text-black px-4 py-2 rounded ml-2" onClick={closeModal}>
                NO
              </button>
              <button
                className={`order-1 px-4 py-2 rounded ${actionType === 'confirm' ? 'bg-primary-pink text-white' : 'bg-red-500 text-white'}`}
                onClick={actionType === 'confirm' ? handleConfirm : handleCancel}
              >
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
