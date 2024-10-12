import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom for routing
import axios from 'axios';
import { BACKEND_URL } from '../../constants/index'; // Adjust the import path as needed

const OrdersTable = () => {
  const [orders, setOrders] = useState([]); // State to hold orders
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(null); // State to handle errors

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/order/getAllorders`); // Fetch orders from the backend
        setOrders(response.data); // Set orders from the response
      } catch (err) {
        setError('Error fetching orders'); // Set error message
      } finally {
        setLoading(false); // Set loading to false
      }
    };

    fetchOrders(); // Call the fetch function
  }, []);

  if (loading) return <div>Loading...</div>; // Display loading state
  if (error) return <div>{error}</div>; // Display error message

  return (
    <div className="w-full mt-5 border border-gray-200 rounded-lg shadow-md">
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Recent Orders</h2>
        
          <Link to="/orders" className="bg-primary-pink text-white px-4 py-2 rounded transition hover:bg-light-pink font-semibold">
            See All
          </Link>
      
      </div>
      <div className="w-full bg-white rounded-lg shadow-md p-4">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border-b p-2 text-left">Name</th>
              <th className="border-b p-2 text-left">Location</th>
              <th className="border-b p-2 text-left">Phone</th>
            </tr>
          </thead>
          <tbody>
            {orders.slice(0, 4).map((order, index) => ( // Display only the first 4 orders
              <tr key={order._id} className={`border-b ${index % 2 === 0 ? 'bg-gray-50' : ''}`}>
                <td className="p-2">{order.clientName}</td> {/* Adjusted field name */}
                <td className="p-2">{order.address}</td> {/* Adjusted field name */}
                <td className="p-2">{order.phone}</td> {/* Adjusted field name */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersTable;
