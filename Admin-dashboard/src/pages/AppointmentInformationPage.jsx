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
    const updatedDate = e.target.value;
    setAppointment((prev) => ({ ...prev, date: updatedDate }));
  };
  

  const handleConfirm = async () => {
    try {
      await axios.put(`${BACKEND_URL}/api/appointments/confirm/${appointmentId}`, {
        status: 'Confirmed',
        time: appointment.time,
        date: appointment.date,
      });
      toast.success('Appointment confirmed successfully!');
      closeModal();
      navigate('/appointments');
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(errorMessage);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${BACKEND_URL}/api/appointments/update_datetime/${appointmentId}`, {
        time: appointment.time,
        date: appointment.date,
      });
      toast.success('Appointment updated successfully!');
      closeModal();
      navigate('/appointments');
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(errorMessage);
    }
  };

  const handleComplete = async () => {
    try {
      await axios.put(`${BACKEND_URL}/api/appointments/${appointmentId}/complete`, {
        status: 'Completed',
      });
      toast.success('Appointment marked as completed!');
      navigate('/appointments');
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(errorMessage);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${BACKEND_URL}/api/appointments/${appointmentId}`);
      toast.success('Appointment deleted successfully!');
      navigate('/appointments');
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(errorMessage);
    }
  };


  if (loading) {
    return <h3 className="flex justify-center items-center h-screen text-lg font-bold">Chargement ...</h3>;
  }

  if (error) {
    return <h3 className="flex justify-center items-center h-screen text-lg font-bold text-red-600">{error}</h3>;
  }

  if (!appointment) {
    return <p>Pas de rendez-vous.</p>;
  }

  return (
    <div className="p-6 mt-20">
      <h1 className="text-2xl font-semibold mb-4 text-center">Information de Rendez-vous</h1>

      <div className="border border-gray-300 shadow-lg p-4 rounded-lg mb-6 bg-white">
        <div className="mb-4">
          <label className="block mb-2">Nom de Patient:</label>
          <input
            type="text"
            value={appointment.fullName}
            disabled
            className="p-2 border rounded w-full bg-gray-100"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Adress de Patient:</label>
          <input
            type="text"
            value={appointment.location}
            disabled
            className="p-2 border rounded w-full bg-gray-100"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Numéro:</label>
          <input
            type="text"
            value={appointment.phoneNumber}
            disabled
            className="p-2 border rounded w-full bg-gray-100"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Date selectionné:</label>
          <input
            type="date"
            disabled={appointment.status !== 'Pending' && appointment.status !== 'Confirmed'}
            value={appointment.date?.substring(0, 10)}
            onChange={handleDateChange}
            className="p-2 border rounded w-full"
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
          <label className="block mb-2">Categorie:</label>
          <input
            type="text"
            value={appointment.category}
            readOnly
            className="p-2 border rounded w-full bg-gray-100"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Temps:</label>
          <input
            type="time"
            disabled={appointment.status !== 'Pending' && appointment.status !== 'Confirmed'}
            value={appointment.time}
            onChange={handleTimeChange}
            className="p-2 border rounded w-full"
          />
        </div>

        <div className="flex justify-end space-x-2">
  {appointment.status === 'Pending' && (
    <>
      <button
        className="bg-blue-500 text-white p-2 rounded"
        onClick={() => openModal('confirm')}
      >
        Confirmer
      </button>
      <button
        className="bg-red-500 text-white p-2 rounded"
        onClick={() => openModal('delete')}
      >
        Supprimer
      </button>
    </>
  )}
  
  {appointment.status === 'Confirmed' && (
    <>      
      <button
        className="bg-slate-500 text-white p-2 rounded"
        onClick={() => openModal('delete')}
      >
        Supprimer
      </button>

      <button
        className="bg-primary-pink text-white p-2 rounded"
        onClick={() => openModal('update')}
      >
        mise à jour
      </button>

      <button
        className="bg-green-500 text-white p-2 rounded"
        onClick={() => openModal('complete')}
      >
        Completer
      </button>

      
    </>
  )}
  
  {appointment.status === 'Completed' && (
    <button
      className="bg-primary-pink text-white p-2 rounded"
      onClick={() => navigate('/appointments')}
    >
      Consulter les rendez-vous
    </button>
  )}
</div>

      </div>

      {isModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white rounded-lg p-6 w-94">
      <h3 className="text-lg font-semibold mb-4">
        {actionType === 'delete'
          ? 'Supprimer Rendez-vous'
          : actionType === 'update'
          ? 'Mise à jour Rendez-vous'
          : actionType === 'complete'
          ? 'Completer Rendez-vous'
          : actionType === 'confirm'
          ? 'Confirmer Rendez-vous'
          : ''}
      </h3>
      <p className="mb-4">
        vous-etes sur que vous voulez{' '}
        {actionType === 'delete'
          ? 'supprimer'
          : actionType === 'update'
          ? 'mise a jour'
          : actionType === 'complete'
          ? 'completer'
          : actionType === 'confirm'
          ? 'confirmer'
          : ''}{' '}
        ce rendez-vous?
      </p>
      <div className="flex justify-end">
        <button className="order-2 bg-gray-300 text-black px-4 py-2 rounded ml-2" onClick={closeModal}>
          NON
        </button>
        <button
          className={`order-1 px-4 py-2 rounded ${
            actionType === 'complete' ? 'bg-primary-pink' : actionType === 'confirm' ? 'bg-primary-pink' : 'bg-primary-pink'
          } text-white`}
          onClick={
            actionType === 'update'
              ? handleUpdate
              : actionType === 'complete'
              ? handleComplete
              : actionType === 'confirm'
              ? handleConfirm
              : handleDelete
          }
        >
          OUI
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default AppointmentInformationPage;
