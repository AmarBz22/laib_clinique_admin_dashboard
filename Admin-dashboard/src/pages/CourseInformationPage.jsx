import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const CourseInformationPage = () => {
    const [course ,setCourse] = useState()
    const { courseId } = useParams(); 
    const [requests ,setRequests] = useState([])
    useEffect(() => {
        const fetchCourse = async () => {
          try {
            const response = await axios.get('http://localhost:4000/api/trainings/'+courseId); // Update the URL to your backend endpoint
            const response2 = await axios.get(`http://localhost:4000/api/trainingrequest/training_request_by_course/${response.data.title}`);
            setRequests(response2.data.result)
            
            const updatedData = {
                ...response.data, // Spread the rest of the response data
                photo: response.data.photo.replace(/\\/g, '/') // Modify only the photo field
              };            
            setCourse(updatedData);  
                      
          } catch (error) {
            console.error('Error fetching courses:', error);
          }
        };

        
    
        fetchCourse();
      }, []);
    return ( <>
    {(course && requests) ? 
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
                <Link to="/courses/edit/1" className="bg-blue-600 px-4 py-1 rounded-sm text-white"> Edit </Link>
                <button className="bg-red-600 px-4 py-1 rounded-sm text-white">Delete</button>
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
</div>: <h3 className="absolute top-1/2 left-1/2 text-lg font-bold"> Loading ... </h3>} 
    </>);
}
 
export default CourseInformationPage;