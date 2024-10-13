import React, { useState, useEffect } from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import { AiFillCloseCircle } from 'react-icons/ai';
import { BiShow } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from '../../constants/index';

const AppointmentsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [actionType, setActionType] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [type,setType] = useState("All")
  const navigate = useNavigate();
  const [filtredAppointments , setFiltredAppointments] = useState([])
  const [date,setDate] = useState("")


  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/appointments/get_appointment`);
        setAppointments(response.data);
        setFiltredAppointments(response.data)
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError('Error fetching appointments');
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
    const newdata = appointments.filter(appointment => 
        appointment.fullName.toLowerCase().startsWith(searchTerm)
    );
    setFiltredAppointments(newdata);
    setDate("")
    setType("All")

  };
  const handleConfirmDeleteClick = (appointment, action) => {
    setSelectedAppointment(appointment);
    setActionType(action);
    setShowModal(true);
  };


  const handleAll = ()=>{
    setType("All")    
    setDate("")
    setSearchTerm("")
    setFiltredAppointments(appointments)

  }

  const handleConfrim = ()=>{
    setType("Confirmed")    
    setDate("")
    setSearchTerm("")
    const newdata = appointments.filter(e => e.status === "Confirmed");    
    setFiltredAppointments(newdata)
  }

  const handleCancel = ()=>{
    setType("Cancelled")
    setDate("")
    setSearchTerm("")
    const newdata = appointments.filter(e => e.status === "Cancelled");    
    setFiltredAppointments(newdata)

  }

  const handlePending = ()=>{
    setType("Pending")
    setDate("")
    setSearchTerm("")
    const newdata = appointments.filter(e => e.status === "Pending");    
    setFiltredAppointments(newdata)

  }

  const handleDate = (e)=>{
    setDate(e.target.value)
    const date = e.target.value
    if(date!=="")
    {
      setType("All")
      setSearchTerm("")
      const newdata = appointments.filter(e => e.date === date);    
      setFiltredAppointments(newdata)
    }else{
      setType("All")
      setSearchTerm("")
      setFiltredAppointments(appointments)
    }
    

  }
  


  const closeModal = () => setShowModal(false);
  const handleRowClick = (appointmentId) => {
    navigate(`/appointments/${appointmentId}`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="md:p-6 flex flex-col justify-center items-center mt-20 mb-10 px-2">
      <h1 className="text-2xl font-semibold mb-8 text-center">Appointments</h1>

      <div className="md:flex md:gap-0 md:justify-between w-full items-center grid grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by patient name"
          value={searchTerm}
          onChange={handleSearchChange}
          className="p-2 border rounded order-1"
        />
        <div className='flex  md:justify-center justify-start items-center  md:order-2 order-3 col-span-2 md:mt-0 mt-4'>
          <button onClick={handleAll} className={type==="All" ?'py-1 px-3  border-black rounded-l-md bg-primary-pink text-white shadow-inner' : 'py-1 px-3  border-black rounded-l-md shadow-inner'}>All</button>
          <button onClick={handleConfrim} className={type==="Confirmed" ?'py-1 px-3  border-black  bg-primary-pink text-white shadow-inner' : 'py-1 px-3  border-black shadow-inner'}>Confirmed</button>
          <button onClick={handlePending} className={type==="Pending" ? 'py-1 px-3  border-black    shadow-inner bg-primary-pink text-white' : 'py-1 px-3  border-black   text-black shadow-inner'}>Pending</button>
          <button  onClick={handleCancel} className={type==="Cancelled" ? 'py-1 px-3 rounded-r-md border-black    shadow-inner bg-primary-pink text-white' : 'py-1 px-3  border-black rounded-r-md  text-black shadow-inner'}>Cancelled</button>
        </div>
        <input type='date' value={date} onChange={(e)=>{handleDate(e)}} placeholder='filter by Date' className='md:order-3 order-2 p-2 border rounded '/>          
      </div>

      <div className='w-full mt-5 border border-gray-200 rounded-lg shadow-md'>
        <table className="w-full border-collapse bg-white">
          <thead>
            <tr>
              <th className="text-gray-800 font-semibold p-3 text-left">Date</th>
              <th className="text-gray-800 font-semibold p-3 text-left">Phone Number</th>
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
                  <td className="p-3 border-b border-gray-200">{appointment.status}</td>
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
                <td colSpan="5" className="text-center p-3">No appointments found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppointmentsPage;
