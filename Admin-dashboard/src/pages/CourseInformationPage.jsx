import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { BACKEND_URL } from "../../constants";
import TrainingRequestList from "../components/TrainingRequestList";

const CourseInformationPage = () => {
    const [course, setCourse] = useState(null);
    const [requests, setRequests] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false); // Modal state
    const { courseId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                setError(null);
                const response = await axios.get(`${BACKEND_URL}/api/trainings/${courseId}`);
                const requestsResponse = await axios.get(`${BACKEND_URL}/api/trainingrequest/training_request_by_course/${response.data.title}`);

                const updatedData = {
                    ...response.data,
                    photo: response.data.photo.replace(/\\/g, '/')
                };            
                setCourse(updatedData);
                setRequests(requestsResponse.data.result || []);
            } catch (err) {
                const errorMessage = err.response?.data?.message || err.message;
                toast.error(errorMessage);
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [courseId]);

    const handleDelete = async () => {
        try {
            await axios.delete(`${BACKEND_URL}/api/trainings/delete_training/${courseId}`);
            toast.success("Course deleted successfully");
            navigate("/courses");
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message;
            toast.error(errorMessage);
        } finally {
            setShowModal(false); // Close the modal after deletion
        }
    };

    if (isLoading) return <h3 className="flex justify-center items-center h-screen text-lg font-bold">Chargement ...</h3>;
    if (error) return <h3 className="flex justify-center items-center h-screen text-lg font-bold text-red-600">{error}</h3>;

    return (
        <div className="px-6 pb-6">
            <div className="p-4 mt-28 rounded-lg shadow-lg pb-8">
                <div className="flex md:flex-row flex-col justify-between items-center">
                    <div className="flex items-center justify-start gap-2 w-full md:order-1 order-2">
                        <h3 className="text-start font-bold text-xl md:w-3/4 w-full break-all">{course.title}
                        <span className={`inline-block px-2 py-1 rounded text-white ml-1 ${
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
                        </h3>
                    </div>
                    <div className="flex md:order-2 order-1 justify-end gap-2 items-center md:mb-0 mb-2 self-end md:self-auto">
                        <Link to={`/courses/edit/${course._id}`} className="bg-blue-600 px-4 py-1 rounded-sm text-white"> Modifier </Link>
                        <button onClick={() => setShowModal(true)} className="bg-red-600 px-4 py-1 rounded-sm text-white">Supprimer</button>
                    </div>
                </div>

                <div className="mt-6 flex md:flex-row flex-col justify-start gap-4">
                    <img src={`http://localhost:4000/${course.photo}`} // Ensure 'photo' is the correct field for image URLs
                        alt={course.title}
                        className="md:w-1/2 w-full object-cover rounded-sm"
                    />
                    <div className="w-full">
                        <p className="text-md xl:h-3/4 md:h-1/2 h-fit md:pb-0 pb-2 border-b-2 border-b-gray-400">
                            {course.description}
                        </p>
                        <div className="xl:flex justify-between items-center xl:mt-4">
                            <div className="">
                                <p className="xl:text-md text-sm xl:mb-2 mb-1 font-semibold break-all">Nombre de place reservés : <span className="font-normal">{course.reservedPlaces}/{course.places}</span></p>
                                <p className="xl:text-md text-sm xl:mb-0 mb-1 font-semibold break-all">Prix : <span className="font-normal">{course.price},00 DZD</span></p>
                            </div>
                            <div>
                                <p className="xl:text-md text-sm xl:mb-2 mb-1 font-semibold break-all">Date : <span className="font-normal">{course.date.slice(0, 10)}</span></p>
                                <p className="xl:text-md text-sm xl:mb-0 mb-1 font-semibold break-all">Audience : <span className="font-normal">{course.audience}</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <TrainingRequestList title={course?.title} />


            {/* Modal for Confirmation */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 shadow-lg">
                        <h3 className="text-lg font-semibold mb-4">Confirm suppression</h3>
                        <p>vous etes que vous voulez supprimer cette formation?</p>
                        <div className="flex justify-end mt-4">
                            <button onClick={() => setShowModal(false)} className="bg-gray-300 px-4 py-2 rounded mr-2">Annuler</button>
                            <button onClick={handleDelete} className="bg-red-600 px-4 py-2 rounded text-white">Confirmer</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseInformationPage;
