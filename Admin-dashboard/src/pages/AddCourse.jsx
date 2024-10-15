import  { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { toast } from 'react-toastify';
import { BACKEND_URL } from '../../constants';

const AddTraining = () => {
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
  const navigate = useNavigate(); // Initialize navigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    if(name==="type" && value==="free")
    {
      setTraining((prevTraining) => ({
        ...prevTraining,
        [name]: value,
        ["price"] : 0
      }));
    }
    else{
      setTraining((prevTraining) => ({
        ...prevTraining,
        [name]: value,
      }));
    }
    
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
      toast.error('Please upload a training image.');
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
      const response = await axios.post(`${BACKEND_URL}/api/trainings/create_training`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });      
      if(response.statusText==="Created")
      {
        toast.success('Training added successfully!'); 
        navigate('/courses'); 
      }
    } catch (error) {
      if(error.response?.data?.message)
      {
          toast.error(error.response.data.message)
      }
      else{
          toast.error(error.message)
      }   
    }
  };

  return (
    <div className="p-6 mt-20">
      <h1 className="text-2xl font-semibold mb-4 text-center">Add Training</h1>
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
              disabled={training.type === "free"} 
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
                navigate('/courses')
              }
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTraining;
