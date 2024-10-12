import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const OrderInformationPage = () => {
  const { orderId } = useParams(); // Extracting the orderId from the route parameters
  const [orderDetails, setOrderDetails] = useState(null); // State to store the fetched order details
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [actionType, setActionType] = useState(null); // State to track the action type (confirm or cancel)
  const navigate = useNavigate(); // Hook for programmatically navigating

  // Fetch the order details when the component mounts or when orderId changes
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        console.error('No order ID found in params');
        return;
      }
      try {
        const response = await axios.get(`http://localhost:4000/api/order/${orderId}`);
        console.log('Order details fetched:', response.data); // Add this log
        setOrderDetails(response.data);
      } catch (error) {
        console.error('Error fetching order details:', error);
        navigate('/orders'); // Redirect to orders page if error occurs
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
      await axios.put(`http://localhost:4000/api/order/confirm/${orderId}`);
      // Refresh the page to update the order status
      setOrderDetails({ ...orderDetails, status: 'Completed' });
      closeModal(); // Close the modal after confirmation
    } catch (error) {
      console.error('Error confirming order:', error);
    }
  };

  // Cancel order action
  const handleCancel = async () => {
    try {
      await axios.put(`http://localhost:4000/api/order/cancel/${orderId}`);
      // Refresh the page to update the order status
      setOrderDetails({ ...orderDetails, status: 'Cancelled' });
      closeModal(); // Close the modal after cancellation
    } catch (error) {
      console.error('Error cancelling order:', error);
    }
  };

  // If the order details are not yet fetched, show a loading state
  if (!orderDetails) return <div>Loading...</div>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl min-h-[500px]">
        <h2 className="text-center text-black text-xl font-semibold mb-4">Order Information</h2>
        <hr className="border-gray-300 mb-4" />

        {/* Order Info */}
        <div className="info mb-6">
          <p className="text-black font-bold">Name: <span className="text-gray-500">{orderDetails.clientName}</span></p>
          <br />
          <p className="text-black font-bold">Phone: <span className="text-gray-500">{orderDetails.phone}</span></p>
          <br />
          <p className="text-black font-bold">Status: 
            <span className={`font-semibold ${orderDetails.status === 'Completed' ? 'text-green-500' : orderDetails.status === 'Cancelled' ? 'text-red-500' : 'text-yellow-500'}`}>
              {orderDetails.status}
            </span>
          </p>
          <br />
          <p className="text-black font-bold">Location: <span className="text-gray-500">{orderDetails.address}</span></p>
        </div>

        {/* Order Items */}
        <div className="mb-6">
          <h3 className="text-lg font-medium">Items</h3>
          <ul className="list-disc list-inside">
            {orderDetails.products && Array.isArray(orderDetails.products) ? (
              orderDetails.products.map(item => (
                <li key={item.id} className="text-black font-semibold">{item.productName} <span className='text-gray-500'> {item.quantity} </span></li>
              ))
            ) : (
              <p className="text-gray-600"></p>
            )}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center">
          {orderDetails.status === 'Pending' ? (
            <div className="flex space-x-4">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded transition duration-300 hover:bg-white hover:text-green-500 border border-green-500"
                onClick={() => openModal('confirm')}
              >
                Confirm
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded transition duration-300 hover:bg-white hover:text-red-500 border border-red-500"
                onClick={() => openModal('cancel')}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              className="bg-primary-pink text-white px-4 py-2 rounded"
              onClick={() => navigate('/orders')} // Redirect back to orders page
            >
              Back to Orders
            </button>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-1/3">
            <h3 className="text-lg font-semibold mb-4">{actionType === 'confirm' ? 'Confirm Order' : 'Cancel Order'}</h3>
            <p className="mb-4">
              Are you sure you want to {actionType === 'confirm' ? 'confirm' : 'cancel'} this order?
            </p>
            <div className="flex justify-end">
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded mr-2"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 rounded ${actionType === 'confirm' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
                onClick={actionType === 'confirm' ? handleConfirm : handleCancel}
              >
                {actionType === 'confirm' ? 'Confirm' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderInformationPage;
