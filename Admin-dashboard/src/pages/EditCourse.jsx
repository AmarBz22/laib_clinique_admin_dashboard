import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const EditCourse = () => {
    
  const [training, setTraining] = useState({
    title: '',
    description: '',
    type: 'free',
    audience: 'family and children',
    price: '',
    date: '',
    places: '',
    photo: null,
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Initialize navigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTraining((prevTraining) => ({
      ...prevTraining,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setTraining((prevTraining) => ({
      ...prevTraining,
      photo: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!training.photo) {
      setMessage('Please upload a training image.');
      return;
    }

    const formData = new FormData();
    formData.append('title', training.title || '');
    formData.append('description', training.description || '');
    formData.append('type', training.type || '');
    formData.append('audience', training.audience || '');
    formData.append('price', training.price.toString()); // Convert price to string
    formData.append('date', training.date || '');
    formData.append('places', training.places.toString()); // Convert places to string
    formData.append('photo', training.photo); // Add photo file

    try {
      const response = await axios.post('http://localhost:4000/api/trainings/create_training', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage('Training added successfully!');

      // Wait 2 seconds, then redirect to Courses page
      setTimeout(() => {
        navigate('/courses'); // Redirect to the Courses page
      }, 2000); // Wait for 2 seconds before redirecting
    } catch (error) {
      console.error('Error adding training:', error);
      setMessage('Failed to add training. Please try again.');
    }
  };

  return (
    <div className="p-6 mt-20">
      <h1 className="text-2xl font-semibold mb-4 text-center">Edit Training</h1>
      <div className="border border-gray-300 shadow-lg p-4 rounded-lg mb-6 bg-white">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Training Title:</label>
            <input
              type="text"
              name="title"
              value={training.title}
              onChange={handleChange}
              required
              className="p-2 border rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Description:</label>
            <textarea
              name="description"
              value={training.description}
              onChange={handleChange}
              required
              className="p-2 border rounded w-full"
              rows="4"
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block mb-2">Type:</label>
            <select
              name="type"
              value={training.type}
              onChange={handleChange}
              className="p-2 border rounded w-full"
            >
              <option value="free">Free</option>
              <option value="reduced">Reduced</option>
              <option value="paid">Paid</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2">Audience:</label>
            <select
              name="audience"
              value={training.audience}
              onChange={handleChange}
              className="p-2 border rounded w-full"
            >
              <option value="family and children">Family and Children</option>
              <option value="specialist">Specialist</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2">Price:</label>
            <input
              type="number"
              name="price"
              value={training.price}
              onChange={handleChange}
              required
              className="p-2 border rounded w-full"
              min="0"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Date:</label>
            <input
              type="date"
              name="date"
              value={training.date}
              onChange={handleChange}
              required
              className="p-2 border rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Number of Places:</label>
            <input
              type="number"
              name="places"
              value={training.places}
              onChange={handleChange}
              required
              className="p-2 border rounded w-full"
              min="1"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Training Image:</label>
            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={handleFileChange}
              className="p-2 border rounded w-full"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button type="submit" className="bg-primary-pink text-white p-2 rounded">
              Add Training
            </button>
            <button
              type="button"
              className="bg-gray-400 text-white p-2 rounded"
              onClick={() =>
                setTraining({
                  title: '',
                  description: '',
                  type: 'free',
                  audience: 'family and children',
                  price: '',
                  date: '',
                  places: '',
                  photo: null,
                })
              }
            >
              Cancel
            </button>
          </div>
          {message && <p className={`mt-4 ${message.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}>{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default EditCourse;
