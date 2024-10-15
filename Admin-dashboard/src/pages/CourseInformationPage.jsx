import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { BACKEND_URL } from "../../constants";

const CourseInformationPage = () => {
    const [course ,setCourse] = useState()
    const { courseId } = useParams(); 
    const [requests ,setRequests] = useState([])
    const [isModalOpen,setModel] = useState(false)
    const [isLoading,setLoading]=useState(true)
    const [error,setError] = useState(null)
    useEffect(() => {
        const fetchCourse = async () => {
          try {
            setError(null)
            const response = await axios.get(`${BACKEND_URL}/api/trainings/${courseId}`); // Update the URL to your backend endpoint
            const response2 = await axios.get(`${BACKEND_URL}/api/trainingrequest/training_request_by_course/${response.data.title}`);
            setRequests(response2.data.result)
            
            const updatedData = {
                ...response.data, // Spread the rest of the response data
                photo: response.data.photo.replace(/\\/g, '/') // Modify only the photo field
              };            
            setCourse(updatedData);  
                      
          } catch (error) {
            if(error.response?.data?.message)
            {
                toast.error(error.response.data.message)
                setError(error.response.data.message)
            }
            else{
                toast.error(error.message)
                setError(error.message)
            }          
          }
          finally{
            setLoading(false)
          }
        };

        
    
        fetchCourse();
      }, []);
      const navigate = useNavigate(); // Initialize navigate

    const handleConfirm = async()=>{
      try {
        const response = await axios.delete(`${BACKEND_URL}/api/trainings/delete_training/${courseId}`);
        if(response.statusText==="OK")
        {
          toast.success("course deleted successfully")
          navigate("/courses")
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
    }

  if(isLoading) return ( <h3 className="flex justify-center items-center h-screen  text-lg font-bold"> Loading ... </h3>)
  if(error) return ( <h3 className="flex justify-center items-center h-screen  text-lg font-bold text-red-600"> {error} </h3>)

  return ( <>
      {(course && requests) &&
  <div className="px-6 pb-6">
      <div className="p-4 mt-28 rounded-lg shadow-lg pb-8">
          <div className="flex md:flex-row flex-col  justify-between items-center">
              <div className="flex items-center justify-start gap-2 w-full md:order-1 order-2">
                  <h3 className="text-start font-bold text-xl md:w-3/4 w-full break-all">{course.title}
                  <span className={`inline-block px-2 py-1 rounded text-white ml-1 ${
                          course.type.toLowerCase() === 'free'
                              ? 'bg-green-500'
                              : course.type.toLowerCase() === 'reduced'
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`}>
                      {course.type}
                  </span>
                  </h3>
                  
              </div>
              <div className="flex md:order-2 order-1 justify-end gap-2 items-center md:mb-0 mb-2 self-end md:self-auto">
                  <Link to={"/courses/edit/"+course._id} className="bg-blue-600 px-4 py-1 rounded-sm text-white"> Edit </Link>
                  <button onClick={()=>{setModel(true)}} className="bg-red-600 px-4 py-1 rounded-sm text-white">Delete</button>
              </div>
          </div>

          <div className="mt-6 flex md:flex-row flex-col justify-start gap-4">
              <img src={`http://localhost:4000/${course.photo}`} // Ensure 'photo' is the correct field for image URLs
                    alt={course.title}
                    className=" md:w-1/2 w-full object-cover rounded-sm"
              />
              <div className="w-full">
                  <p className="text-md xl:h-3/4 md:h-1/2 h-fit md:pb-0 pb-2 border-b-2 border-b-gray-400">
                      {course.description}
                  </p>
                  <div className="xl:flex justify-between items-center xl:mt-4 ">
                      <div className="">
                          <p className="xl:text-md text-sm xl:mb-2 mb-1 font-semibold break-all">Number of reserved places : <span className="font-normal">{requests.length ? requests.length : 0}/{course.places}</span></p>
                          <p className="xl:text-md text-sm xl:mb-0 mb-1 font-semibold break-all">Price : <span className="font-normal">{course.price},00 DZD</span></p>
                      </div>
                      <div>
                          <p className="xl:text-md text-sm xl:mb-2 mb-1 font-semibold break-all">Date : <span className="font-normal">{course.date.slice(0,10)}</span></p>
                          <p className="xl:text-md text-sm xl:mb-0 mb-1 font-semibold break-all">Audience :  <span className="font-normal">{course.audience}</span></p>
                      </div>
                      
                  </div>
              </div>
          </div>
      </div> 
      <h3 className="text-xl text-center my-8 font-bold">List of Requests</h3>
      <div className='mt-5 border border-gray-200   md:w-full bg-white text-center rounded-lg shadow-lg'>
          <table className="w-full border-collapse bg-white">
            <thead>
              <tr>
                <th className="text-gray-800 font-semibold p-3 ">Name</th>
                <th className="text-gray-800 font-semibold p-3 ">Email</th>
                <th className="text-gray-800 font-semibold p-3 ">Phone Number</th>
              </tr>
            </thead>
            <tbody>
              {requests.length > 0 ? (
                requests.map((appointment) => (
                  <tr
                    key={appointment._id}
                    className="hover:bg-gray-50 transition-colors "
                  >
                    <td className="p-3 border-b border-gray-200">{appointment.name}</td>
                    <td className="p-3 border-b border-gray-200">{appointment.email}</td>
                    <td className="p-3 border-b border-gray-200">{appointment.phone}</td>                  
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center p-3">No Request found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6  w-94">
              <h3 className="text-lg font-semibold mb-4">Delete Course</h3>
              <p className="mb-4">
                Are you sure you want to delete this course?
              </p>
              <div className="flex justify-end">
                <button className=" order-2 bg-gray-300 text-black px-4 py-2 rounded ml-2" onClick={()=>setModel(false)}>
                  {/* Cancel */}
                  NO
                </button>
                <button
                  className="order-1 px-4 py-2 rounded bg-red-500 text-white"
                  onClick= {handleConfirm}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        )}
  </div>} 
    </>);
}
 
export default CourseInformationPage;