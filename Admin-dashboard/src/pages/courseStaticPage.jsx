import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../../constants/index';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const CourseStaticPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/statistics/courseStatics`);
        setCourses(response.data);
      } catch (error) {
        toast.error(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;

  return (
    <div className="w-full mt-24 border border-gray-200 rounded-lg shadow-md mx-4 lg:mx-8"> {/* Added margin for spacing */}
      <h1 className="text-2xl font-bold text-center">Statisque de Formations</h1>
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Statisque de Formations</h2>
        <input
          type="text"
          placeholder="Search by course name"
          value={searchTerm}
          onChange={handleSearchChange}
          className="p-2 border rounded"
        />
      </div>
      <table className="w-full border-collapse bg-white">
        <thead>
          <tr>
            <th className="text-gray-800 font-semibold p-3 text-left">Course Title</th>
            <th className="text-gray-800 font-semibold p-3 text-left">Audience</th>
            <th className="text-gray-800 font-semibold p-3 text-left">Type</th>
            <th className="text-gray-800 font-semibold p-3 text-left">Total Revenue</th>
          </tr>
        </thead>
        <tbody>
          {filteredCourses.map((course, index) => (
            <tr key={course._id} className={`border-b ${index % 2 === 0 ? 'bg-gray-50' : ''}`}>
                <td className="p-2">{course.name}</td> {/* Change 'name' to 'title' for French translation */}
                <td className="p-2">{course.audience === 'family and children' ? 'Famille et Enfants' : 'Spécialiste'}</td> {/* Mapping audience */}
                <td className="p-2 capitalize">{course.type === 'paid' ? 'Payé' : course.type === 'free' ? 'Gratuit' : 'Réduit'}</td> {/* Mapping type */}
                <td className="p-2">{course.reservedPlaces}</td>
                <td className="p-2">{course.totalPrice} DZ</td> {/* Change 'totalPrice' to 'price' for French translation */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CourseStaticPage;
