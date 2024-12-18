import  { useState, useEffect } from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import { BiShow } from 'react-icons/bi';
import { useNavigate , Link} from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from '../../constants/index';
import { toast } from 'react-toastify';
import { FaSpinner } from "react-icons/fa"; // Import spinner icon


const AppointmentsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [actionType, setActionType] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [type,setType] = useState("All")
  const navigate = useNavigate();
  const [filtredAppointments , setFiltredAppointments] = useState([])
  const [date,setDate] = useState("")
  const [error,setError] = useState(null)


  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setError(null)
        const response = await axios.get(`${BACKEND_URL}/api/appointments/get_appointment`);
        setAppointments(response.data);
        setFiltredAppointments(response.data)
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
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  const handleSearchChange = (e) =>{
    setSearchTerm(e.target.value)
    const searchTerm = e.target.value.toLowerCase();
    let newdata = appointments.filter(appointment => 
        appointment.fullName.toLowerCase().startsWith(searchTerm) 
    );
    console.log(newdata);

    if(date != "")
    {
      newdata = newdata.filter(elem => elem.date === date)
    }
    if(type !=="All")
    {
      newdata = newdata.filter(elem => elem.status === type)
    }
    console.log(newdata);
    
    setFiltredAppointments(newdata);

  };
  const handleConfirmDeleteClick = (appointment, action) => {
    setSelectedAppointment(appointment);
    setActionType(action);
    setShowModal(true);
  };


  const handleAll = ()=>{
    setType("All")    
    let newdata = appointments.filter(appointment => 
      appointment.fullName.toLowerCase().startsWith(searchTerm) 
    );
    if(date != "")
    {
      newdata = newdata.filter(elem => elem.date === date)
    }
    setFiltredAppointments(newdata);

  }

  const handleConfrim = ()=>{
    setType("Confirmed")    
    let newdata = appointments.filter(appointment => 
      appointment.fullName.toLowerCase().startsWith(searchTerm) &&
      appointment.status === "Confirmed"
    );
    if(date != "")
    {
      newdata = newdata.filter(elem => elem.date === date)
    }
    setFiltredAppointments(newdata);
  }

  const handleComplete = ()=>{
    setType("Completed")
    let newdata = appointments.filter(appointment => 
      appointment.fullName.toLowerCase().startsWith(searchTerm) &&
      appointment.status === "Completed"
    );
    if(date != "")
    {
      newdata = newdata.filter(elem => elem.date === date)
    }
    setFiltredAppointments(newdata);

  }

  const handlePending = ()=>{
    setType("Pending")
    let newdata = appointments.filter(appointment => 
      appointment.fullName.toLowerCase().startsWith(searchTerm) &&
      appointment.status === "Pending"
    );
    if(date != "")
    {
      newdata = newdata.filter(elem => elem.date === date)
    }
    setFiltredAppointments(newdata);

  }

  const handleDate = (e)=>{
    setDate(e.target.value)
    const newdate = e.target.value
    let newdata = appointments.filter(appointment => 
      appointment.fullName.toLowerCase().startsWith(searchTerm) 
    );
    if(newdate != "")
    {
      newdata = newdata.filter(elem => elem.date === newdate)
    }
    if(type !=="All")
    {
      newdata = newdata.filter(elem => elem.status === type)
    }
    setFiltredAppointments(newdata);
    

  }
  const closeModal = () => setShowModal(false);

  const handleAction = async () => {  
      try {
        const response = await axios.delete(`${BACKEND_URL}/api/appointments/${selectedAppointment._id}`);
        toast.success(response.data.message)
        // Refresh orders after deletion
        console.log(response.data);
        
        setAppointments(appointments.filter(order => order._id !== selectedAppointment._id));
        setFiltredAppointments(filtredAppointments.filter(order => order._id !== selectedAppointment._id));
      } catch (error) {
        if(error.response?.data?.message)
        {
            toast.error(error.response.data.message)
        }
        else{
            toast.error(error.message)
        }
      }
    closeModal();
  };

  const handleRowClick = (appointmentId) => {
    navigate(`/appointments/${appointmentId}`);
  };

  if (loading) {
    return <h3 className="flex justify-center items-center h-screen  text-lg font-bold"> Chargement ... </h3>;
  }
  if(error) return ( <h3 className="flex justify-center items-center h-screen  text-lg font-bold text-red-600"> {error} </h3>)


  return (
    <div className="md:p-6 flex flex-col justify-center items-center mt-20 mb-10 px-2">
      <h1 className="text-2xl font-semibold mb-8 text-center">Rendez-vous</h1>

      <div className="lg:flex lg:gap-0 lg:justify-between w-full items-center grid grid-cols-2 gap-4 mb-4">
  <input
    type="text"
    placeholder="Rechercher par nom de patient "
    value={searchTerm}
    onChange={handleSearchChange}
    className="p-2 border rounded order-1"
  />
  
  <div className="flex justify-center items-center lg:order-2 order-3 col-span-2 lg:mt-0 mt-4">
    <button onClick={handleAll} className={type === "All" ? 'py-1 px-3 border-black rounded-l-md bg-primary-pink text-white shadow-inner' : 'py-1 px-3 border-black rounded-l-md shadow-inner'}>Tous</button>
    <button onClick={handleConfrim} className={type === "Confirmed" ? 'py-1 px-3 border-black bg-primary-pink text-white shadow-inner' : 'py-1 px-3 border-black shadow-inner'}>Confirmés</button>
    <button onClick={handlePending} className={type === "Pending" ? 'py-1 px-3 border-black shadow-inner bg-primary-pink text-white' : 'py-1 px-3 border-black text-black shadow-inner'}>En Attent</button>
    <button onClick={handleComplete} className={type === "Completed" ? 'py-1 px-3 rounded-r-md border-black shadow-inner bg-primary-pink text-white' : 'py-1 px-3 border-black rounded-r-md text-black shadow-inner'}>Completez</button>
  </div>

  <input
    type="date"
    value={date}
    onChange={handleDate}
    placeholder="Filter by Date"
    className="lg:order-3 order-2 p-2 border rounded"
  />
  <Link to="addAppointment">
  <button 
    className="p-2 bg-primary-pink text-white rounded order-4 ">
    {loading ? <FaSpinner className="animate-spin mr-2" /> : "Ajouter Rendez-vous"}

  </button>
  </Link>
  
</div>


      <div className='mt-5 border border-gray-200 w-screen md:w-full overflow-x-auto rounded-lg shadow-md'>
        <table className="w-full border-collapse bg-white">
          <thead>
            <tr>
              <th className="text-gray-800 font-semibold p-3 text-left">Date</th>
              <th className="text-gray-800 font-semibold p-3 text-left">Numéro</th>
              <th className="text-gray-800 font-semibold p-3 text-left">Patient</th>
              <th className="text-gray-800 font-semibold p-3 text-left">Status</th>
              <th className="text-gray-800 font-semibold p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtredAppointments.length > 0 ? (
              filtredAppointments.map((appointment) => (
                <tr
                  key={appointment._id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handleRowClick(appointment._id)}
                >
                  <td className="p-3 border-b border-gray-200">{formatDate(appointment.date)}</td>
                  <td className="p-3 border-b border-gray-200">{appointment.phoneNumber}</td>
                  <td className="p-3 border-b border-gray-200">{appointment.fullName}</td>
                  <td className="p-3 border-b border-gray-200">
                  {appointment.status.toLowerCase() === 'pending'
                  ? 'En attente'
                  : appointment.status.toLowerCase() === 'confirmed'
                  ? 'Confirmé'
                  : appointment.status.toLowerCase() === 'completed'
                  ? 'Complété'
                  : appointment.status}
                  </td>
                  <td className="p-3 border-b border-gray-200">
                    <div className='flex items-center gap-2'>
                      <BiShow
                        className="text-blue-500 cursor-pointer"
                        title="View Appointment"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRowClick(appointment._id);
                        }}
                      />
                      <FaTrashAlt
                        className="text-red-500 cursor-pointer"
                        title="Delete Appointment"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleConfirmDeleteClick(appointment, 'delete');
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-3">Pas de Rendez-vous</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-lg font-semibold mb-4">Action de Confirm</h2>
            <p className="mb-4">
              vous etes vraiment sur que vous voulez supprimre ce rendez-vous?
            </p>
            <div className="flex justify-end">
              <button
                className="text-gray-500 order-2 hover:text-gray-700 ml-4"
                onClick={closeModal}
              >
                NON
              </button>
              <button
                className={`${
                  actionType === 'confirm' ? 'bg-green-500' : 'bg-red-500'
                } text-white px-4 py-2 rounded order-1`}
                onClick={handleAction}
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

export default AppointmentsPage;
