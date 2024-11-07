import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../../constants/index';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const CourseStatsTable = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="w-full mt-5 border border-gray-200 p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Statistiques des Cours</h2>
        <Link to="courseStatics" className="bg-primary-pink text-white px-4 py-2 rounded transition hover:bg-light-pink font-semibold">
          Voir Tout
        </Link>
      </div>
      <div className="w-full bg-white rounded-lg shadow-md p-4">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border-b p-2 text-left">Titre du Cours</th>
              <th className="border-b p-2 text-left">Public</th>
              <th className="border-b p-2 text-left">Type</th>
              <th className="border-b p-2 text-left">Places Réservées</th>
              <th className="border-b p-2 text-left">Revenu Total</th>
            </tr>
          </thead>
          <tbody>
                {courses.slice(0, 5).map((course, index) => ( // Limiter à 5 cours
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
    </div>
  );
};

export default CourseStatsTable;
