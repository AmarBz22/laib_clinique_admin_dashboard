import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BACKEND_URL } from '../../constants';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterAudience, setFilterAudience] = useState('all');
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Récupérer les cours depuis le backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setError(null);
        const response = await axios.get(`${BACKEND_URL}/api/trainings/get_training`); // Mettre à jour l'URL vers votre point de terminaison backend
        setCourses(response.data);
      } catch (error) {
        if (error.response?.data?.message) {
          toast.error(error.response.data.message);
          setError(error.response.data.message);
        } else {
          toast.error(error.message);
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Filtrer les cours en fonction de la recherche, du type et du public
  const filteredCourses = courses.filter(course => {    
    return (
      (filterType === 'all' || course.type.toLowerCase() === filterType.toLowerCase()) &&
      (filterAudience === 'all' || course.audience.toLowerCase() === filterAudience.toLowerCase()) &&
      (course.title.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });
  
  if (isLoading) return ( <h3 className="flex justify-center items-center h-screen text-lg font-bold"> Chargement ... </h3>);
  if (error) return ( <h3 className="flex justify-center items-center h-screen text-lg font-bold text-red-600"> {error} </h3>);

  return (
    <div className="p-6 mt-20">
      <h1 className="text-2xl font-semibold mb-8 text-center">Cours</h1>

      {/* Filtres et bouton Ajouter un cours */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between mb-4">
        <div className="grid sm:grid-cols-3 grid-cols-1 sm:space-x-4 sm:gap-0 gap-4 ">
          <input
            type="text"
            placeholder="Rechercher des cours"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border rounded"
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="all">Tous les types</option>
            <option value="free">Gratuit</option>
            <option value="reduced">Réduit</option>
            <option value="paid">Payant</option>
          </select>
          <select
            value={filterAudience}
            onChange={(e) => setFilterAudience(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="all">Tous les publics</option>
            <option value="family and children">Familles et enfants</option>
            <option value="specialist">Spécialistes</option>
          </select>
        </div>
        <Link to='addCourse' >
          <button className="bg-primary-pink text-white px-4 py-2 rounded mt-4 xl:mt-0 self-end">
            Ajouter un cours
          </button>
        </Link>
      </div>

      {/* Liste des cours */}
      <div className="w-full flex flex-col items-center">
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, index) => {
            const photoUrl = course.photo.replace(/\\/g, '/'); // Remplacer les barres obliques inverses par des barres obliques
            return (
              <div key={index} className="bg-light-gray-bg rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:transform hover:translate-y-[-5px]">
                <img
                  src={`http://localhost:4000/${photoUrl}`} // S'assurer que 'photo' est le bon champ pour les URL des images
                  alt={course.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4 bg-light-gray-bg">
                  <h3 className="text-lg font-semibold text-dark-gray-text mb-2">{course.title}</h3>
                  <p className="text-sm text-muted-gray-text mb-2">
                  <span className={`inline-block px-2 py-1 rounded text-white ${
                  course.type.toLowerCase() === 'free'
                  ? 'bg-green-500'
                  : course.type.toLowerCase() === 'reduced'
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
                }`}>
                {course.type.toLowerCase() === 'free' 
                ? 'Gratuit' 
                : course.type.toLowerCase() === 'reduced' 
                ? 'Réduction' 
                : 'Payé'}
                </span>

                  </p>
                  <p className="text-sm text-muted-gray-text mb-2">Public : {course.audience}</p>
                  <p className="text-sm text-muted-gray-text mb-2">Prix : {course.price === 0 ? 'Gratuit' : `$${course.price}`}</p>
                  <Link to={"/courses/"+course._id} className="bg-primary-pink text-white px-4 py-2 rounded mt-2">
                    Voir plus
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
