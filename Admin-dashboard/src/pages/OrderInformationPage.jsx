import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const OrderInformationPage = () => {
  const { orderId } = useParams(); // Get order ID from URL parameters
  const [orderDetails, setOrderDetails] = useState(null); // State to hold order details
  const navigate = useNavigate(); // Hook to navigate

  // Sample order data, in a real application, fetch this from an API
  const sampleOrders = [
    { 
      id: 1, 
      name: 'John Doe', 
      phone: '123-456-7890', 
      status: 'Pending', 
      items: ['Item A', 'Item B'], 
      totalPrice: 59.99,
      location: '123 Main St, Anytown, USA' // Location added
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      phone: '987-654-3210', 
      status: 'Completed', 
      items: ['Item C'], 
      totalPrice: 19.99,
      location: '456 Elm St, Anytown, USA' // Location added
    },
    { 
      id: 3, 
      name: 'Mike Johnson', 
      phone: '555-555-5555', 
      status: 'Cancelled', 
      items: ['Item D', 'Item E', 'Item F'], 
      totalPrice: 89.99,
      location: '789 Oak St, Anytown, USA' // Location added
    },
    { 
      id: 4, 
      name: 'Emily Davis', 
      phone: '444-444-4444', 
      status: 'Pending', 
      items: ['Item G'], 
      totalPrice: 39.99,
      location: '321 Pine St, Anytown, USA' // Location added
    },
  ];

  // Function to fetch order details based on orderId
  useEffect(() => {
    const order = sampleOrders.find(order => order.id === parseInt(orderId));
    if (order) {
      setOrderDetails(order);
    } else {
      // Handle case where order is not found
      console.log('Order not found');
      navigate('/orders'); // Redirect to orders page
    }
  }, [orderId, navigate]);

  const handleBackClick = () => {
    navigate('/orders'); // Navigate back to the orders page
  };

  if (!orderDetails) return <div>Loading...</div>; // Loading state

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-center text-blue-500 text-lg font-semibold mb-4">Order Information</h2>
        
        <div className="info mb-4">
          <h3 className="text-lg font-medium">Customer Details</h3>
          <p className="text-gray-700">Name: <span className="font-semibold">{orderDetails.name}</span></p>
          <p className="text-gray-700">Phone: <span className="font-semibold">{orderDetails.phone}</span></p>
          <p className="text-gray-700">Status: <span className={`font-semibold ${orderDetails.status === 'Completed' ? 'text-green-500' : 'text-yellow-500'}`}>{orderDetails.status}</span></p>
          <p className="text-gray-700">Location: <span className="font-semibold">{orderDetails.location}</span></p>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-medium">Items</h3>
          <ul className="list-disc list-inside">
            {orderDetails.items.map((item, index) => (
              <li key={index} className="text-gray-700">{item}</li>
            ))}
          </ul>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-medium">Total Price</h3>
          <p className="text-gray-700 font-semibold">${orderDetails.totalPrice.toFixed(2)}</p>
        </div>

        <div className="flex justify-center button-group mt-6">
          <button 
            onClick={handleBackClick}
            className="accept bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
          >
            Back to Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderInformationPage;
