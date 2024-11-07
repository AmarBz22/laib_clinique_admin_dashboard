import { useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../../constants/index';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaSpinner } from "react-icons/fa"; // Import spinner icon

const AddAppointmentPage = () => {
  const [fullName, setFullName] = useState('');
  const [location, setLocation] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [category, setCategory] = useState(''); // New state for category
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Loading state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true at the start
    try {
      await axios.post(`${BACKEND_URL}/api/appointments/create_appointment_admin`, {
        fullName,
        location,
        phoneNumber,
        date,
        time,
        category, // Include category in the submission
        status: "Confirmed", // Set status to Confirmed
      });
      toast.success('Appointment added successfully!');
      navigate('/appointments');
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(errorMessage);
    } finally {
      setLoading(false); // Set loading back to false after the request completes
    }
  };

  return (
    <div className="p-6 mt-20">
      <h1 className="text-2xl font-semibold mb-4 text-center">Ajouter un rendez-vous</h1>
      <form onSubmit={handleSubmit} className="border border-gray-300 shadow-lg p-4 rounded-lg bg-white">
        <div className="mb-4">
          <label className="block mb-2">Nom de Patient:</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="p-2 border rounded w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Address de Patient:</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="p-2 border rounded w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Numéro:</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="p-2 border rounded w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="p-2 border rounded w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Temps:</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="p-2 border rounded w-full"
            required
          />
        </div>
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                Catégorie :
            </label>
            <select
                id="category"
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="p-2 border rounded w-full"
                required
            >
            <option value="" disabled>Sélectionnez une catégorie</option>
            <option value="consultation Psychologique">Consultation psychologique</option>
            <option value="consultation Orthophonique">Consultation orthophonique</option>
            <option value="Suivi">Suivi</option>
            <option value="Première réunion">Première réunion</option>
            </select>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-primary-pink text-white p-2 rounded flex items-center"
            disabled={loading} // Disable button while loading
          >
            {loading ? <FaSpinner className="animate-spin mr-2" /> : "Ajouter Rendez-vous"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAppointmentPage;
