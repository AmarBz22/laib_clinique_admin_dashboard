import  { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BACKEND_URL } from '../../constants';

const OrderInformationPage = () => {
  const { orderId } = useParams(); // Extracting the orderId from the route parameters
  const [orderDetails, setOrderDetails] = useState(null); // State to store the fetched order details
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [actionType, setActionType] = useState(null); // State to track the action type (confirm or cancel)
  const navigate = useNavigate(); // Hook for programmatically navigating
  const [isLoading,setLoading]=useState(true)
  const [error,setError] = useState(null)
  // Fetch the order details when the component mounts or when orderId changes
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        console.error('No order ID found in params');
        return;
      }
      try {
        setError(null)
        const response = await axios.get(`${BACKEND_URL}/api/order/${orderId}`);
        setOrderDetails(response.data);
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

    fetchOrderDetails();
  }, [orderId, navigate]);

  // Open modal for confirmation
  const openModal = (type) => {
    setActionType(type);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setActionType(null);
  };

  // Confirm order action
  const handleConfirm = async () => {
    try {
      await axios.put(`${BACKEND_URL}/api/order/confirm/${orderId}`);
      // Refresh the page to update the order status
      setOrderDetails({ ...orderDetails, status: 'Confirmed' });
      closeModal(); // Close the modal after confirmation
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

  // Cancel order action
  const handleCancel = async () => {
    try {
      await axios.put(`${BACKEND_URL}/api/order/cancel/${orderId}`);
      // Refresh the page to update the order status
      setOrderDetails({ ...orderDetails, status: 'Cancelled' });
      closeModal(); // Close the modal after cancellation
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

  if(isLoading) return ( <h3 className="flex justify-center items-center h-screen  text-lg font-bold"> Chargement ... </h3>)
  if(error) return ( <h3 className="flex justify-center items-center h-screen  text-lg font-bold text-red-600"> {error} </h3>)

  return (
    <div className="flex justify-center items-center h-screen mt-[80px] bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg  w-full max-w-2xl min-h-[500px]">
        <div className='p-4 bg-primary-pink border-b-2 rounded-t-lg border-gray-300'>
          <h2 className="text-center text-white text-xl font-semibold ">Information de la Commande</h2>
        </div>
        

        {/* Order Info */}
        <div className="info mb-4 p-8 border-b-2 border-gray-200">
          <p className="text-black font-bold">Nom: <span className="text-gray-500">{orderDetails.clientName}</span></p>
          <br />
          <p className="text-black font-bold">Numéro: <span className="text-gray-500">{orderDetails.phone}</span></p>
          <br />
          <p className="text-black font-bold">Status:  
            <span className={`ml-2 font-semibold ${orderDetails.status === 'Confirmed' ? 'text-green-600' : orderDetails.status === 'Cancelled' ? 'text-red-500' : 'text-yellow-500'}`}>
              {orderDetails.status}
            </span>
          </p>
          <br />
          <p className="text-black font-bold">Adress: <span className="text-gray-500">{orderDetails.address}</span></p>
        </div>

        {/* Order Items */}
        <div className="mb-6 px-8">
          <h3 className="text-lg font-medium">Items</h3>
          <ul className="list-disc list-inside">
            {orderDetails.products && Array.isArray(orderDetails.products) ? (
              orderDetails.products.map(item => (
                <li key={item.id} className="text-black font-semibold">{item.productName} <span className='text-gray-500'> ({item.quantity} {(item.quantity ===1 || item.quantity ===0) ? "item" : "items"}) </span></li>
              ))
            ) : (
              <p className="text-gray-600"></p>
            )}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center">
          {orderDetails.status === 'Pending' ? (
          <div className='flex flex-col gap-2'>
            <div className="flex space-x-4">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded transition duration-300 hover:bg-white hover:text-green-500 border border-green-500"
                onClick={() => openModal('confirm')}
              >
                Confirmer
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded transition duration-300 hover:bg-white hover:text-red-500 border border-red-500"
                onClick={() => openModal('cancel')}
              >
                Annuler
              </button>
            </div>
              <button
                className="text-primary-pink font-bold hover:underline px-4 py-2 rounded"
                
                onClick={() =>{
                  closeModal();
                  navigate('/orders')}} // Redirect back to orders page
              >
                Consulter les Commandes
              </button>
            </div>
          ) : (
            <button
            className="text-primary-pink font-bold hover:underline px-4 py-2 rounded"
              
              onClick={() =>{
                closeModal();
                navigate('/orders')}} // Redirect back to orders page
            >
              Consulter les Commandes
            </button>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-94 ">
            <h3 className="text-lg font-semibold mb-4">{actionType === 'confirm' ? 'Confirmer Commande' : 'Annuler Commande'}</h3>
            <p className="mb-4">
            vous-etes sur que vous voulez {actionType === 'confirm' ? 'confirmer' : 'annuler '} cette Command?
            </p>
            <div className="flex justify-end">
              <button
                className="bg-gray-300 order-2 text-black px-4 py-2 rounded ml-2"
                onClick={closeModal}
              >
                NON
              </button>
              <button
                className={`order-1 px-4 py-2 rounded ${actionType === 'confirm' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
                onClick={actionType === 'confirm' ? handleConfirm : handleCancel}
              >
                OUI
                {/* {actionType === 'confirm' ? 'Confirm' : 'Cancel'} */}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderInformationPage;
