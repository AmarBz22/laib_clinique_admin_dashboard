import  { useState, useEffect } from 'react';
import { FaCheckCircle, FaTrashAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BACKEND_URL } from '../../constants';

const OrdersPage = () => {
  const [type,setType] = useState("All")
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [actionType, setActionType] = useState('');
  const [orders, setOrders] = useState([]);
  const [filteredOrders,setFiltredOrders] = useState([])
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading,setLoading]=useState(true)
  const [error,setError] = useState(null)
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setError(null)
        const response = await axios.get(`${BACKEND_URL}/api/order/getAllorders`);
        setOrders(response.data);
        setFiltredOrders(response.data)
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
  
    fetchOrders();
  }, []);

  
  const handleSearchChange = (e) =>{
    setSearchTerm(e.target.value)
    const searchTerm = e.target.value.toLowerCase();
    let newdata = orders.filter(order => 
      order.clientName.toLowerCase().startsWith(searchTerm)
    );
    if(type !=="All")
    {
      newdata = newdata.filter(elem => elem.status === type)
    }
    setFiltredOrders(newdata);
    
  };

  const handleAll = ()=>{
    setType("All")    
    let newdata = orders.filter(order => 
      order.clientName.toLowerCase().startsWith(searchTerm)
    );
    setFiltredOrders(newdata)

  }

  const handleConfrim = ()=>{
    setType("Confirmed")    
    let newdata = orders.filter(order => 
      order.clientName.toLowerCase().startsWith(searchTerm) &&
      order.status === "Confirmed"
    );
    setFiltredOrders(newdata)
  }

  const handleCancel = ()=>{
    setType("Cancelled")
    let newdata = orders.filter(order => 
      order.clientName.toLowerCase().startsWith(searchTerm) &&
      order.status === "Cancelled"
    );
    setFiltredOrders(newdata)

  }

  const handlePending = ()=>{
    setType("Pending")
    let newdata = orders.filter(order => 
      order.clientName.toLowerCase().startsWith(searchTerm) &&
      order.status === "Pending"
    );
    setFiltredOrders(newdata)

  }

  const handleConfirmDeleteClick = (order, action) => {
    setSelectedOrder(order);
    setActionType(action);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleAction = async () => {
    if (actionType === 'confirm') {
      try {
        console.log(selectedOrder);
        
        const response = await axios.put(`${BACKEND_URL}/api/order/confirm/${selectedOrder._id}`);
        toast.success(response.data.message)
        setFiltredOrders((prevOrders) =>
          prevOrders.map(order =>
            order._id === selectedOrder._id ? { ...order, ...response.data.order } : order
          )
        );  
        setOrders((prevOrders) =>
          prevOrders.map(order =>
            order._id === selectedOrder._id ? { ...order, ...response.data.order } : order
          ))              
      } catch (error) {
        if(error.response?.data?.message)
        {
            toast.error(error.response.data.message)
        }
        else{
            toast.error(error.message)
        }
    }
    } else if (actionType === 'delete') {
      try {
        const response = await axios.delete(`${BACKEND_URL}/api/order/${selectedOrder._id}`);
        toast.success(response.data.message)
        // Refresh orders after deletion
        console.log(response.data);
        
        setOrders(orders.filter(order => order._id !== selectedOrder._id));
        setFiltredOrders(filteredOrders.filter(order => order._id !== selectedOrder._id));
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
    closeModal();
  };

  const handleRowClick = (orderId) => {
    navigate(`/orders/${orderId}`);
  };


  if(isLoading) return ( <h3 className="flex justify-center items-center h-screen  text-lg font-bold"> Loading ... </h3>)
  if(error) return ( <h3 className="flex justify-center items-center h-screen  text-lg font-bold text-red-600"> {error} </h3>)

  return (
    <div className="md:p-6 flex flex-col px-4 justify-center items-center mt-20 mb-10">
      <h1 className="text-2xl font-semibold mb-8 text-center">Commandes</h1>
      <div className="md:flex md:gap-0 md:justify-between w-full items-center  grid grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          placeholder="recherche par nom de client"
          value={searchTerm}
          onChange={handleSearchChange}
          className="p-2 border rounded md:order-1 order-1 md:col-span-0 col-span-2 md:mx-0 mx-8 "
        />
        <div className='flex  justify-center tems-center  md:order-2 col-span-2 md:mt-0 mt-4 order-3' >
          <button onClick={handleAll} className={type==="All" ?'py-1 px-3  border-black rounded-l-md bg-primary-pink text-white shadow-inner' : 'py-1 px-3  border-black rounded-l-md shadow-inner'}>Tous</button>
          <button onClick={handleConfrim} className={type==="Confirmed" ?'py-1 px-3  border-black  bg-primary-pink text-white shadow-inner' : 'py-1 px-3  border-black shadow-inner'}>Confirmés</button>
          <button onClick={handlePending} className={type==="Pending" ? 'py-1 px-3  border-black    shadow-inner bg-primary-pink text-white' : 'py-1 px-3  border-black   text-black shadow-inner'}>En Attent</button>
          <button  onClick={handleCancel} className={type==="Cancelled" ? 'py-1 px-3 rounded-r-md border-black    shadow-inner bg-primary-pink text-white' : 'py-1 px-3  border-black rounded-r-md  text-black shadow-inner'}>Annulés</button>
        </div>
        
      </div>

      <div className="md:w-full mt-5 border border-gray-200 rounded-lg shadow-md overflow-x-auto w-screen">
        
        <table className="w-full border-collapse bg-white">
          <thead>
            <tr>
              <th className="text-gray-800 font-semibold p-3 text-left">Nom de Client</th>
              <th className="text-gray-800 font-semibold p-3 text-left">Numéro</th>
              <th className="text-gray-800 font-semibold p-3 text-left">Status</th>
              <th className="text-gray-800 font-semibold p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
  {filteredOrders.map(order => (
    <tr key={order.id} className="hover:bg-gray-50 transition-colors cursor-pointer"
        onClick={() => handleRowClick(order._id)}
    >
      <td className="p-3 border-b border-gray-200">{order.clientName}</td>
      <td className="p-3 border-b border-gray-200">{order.phone}</td>
      <td className="p-3 border-b border-gray-200">{order.status}</td>
      <td className="p-3 border-b border-gray-200">
        <div className='flex items-center gap-4'>
          <FaCheckCircle
            className={order.status === "Pending" ? "text-green-500 cursor-pointer" : "text-gray-500 cursor-pointer"}
            title="Confirm Order"
            
            onClick={(e) => {  if (order.status !== "Pending") return; // Prevent click if disabled
              e.stopPropagation();
              handleConfirmDeleteClick(order, 'confirm') }}
          />
          <FaTrashAlt
            className="text-red-500 cursor-pointer"
            title="Delete Order"
            onClick={(e) => { e.stopPropagation(); handleConfirmDeleteClick(order, 'delete'); }}
          />
        </div>
      </td>
    </tr>
  ))}
</tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-lg font-semibold mb-4">Action de Confirm</h2>
            <p className="mb-4">
              Vous etes sur que vous voulez {actionType === 'confirm' ? 'confirmer' : 'supprimer'} cette commande?
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

export default OrdersPage;
