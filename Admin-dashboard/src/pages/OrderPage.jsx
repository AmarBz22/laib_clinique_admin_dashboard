import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaTrashAlt } from 'react-icons/fa';
import { AiFillCloseCircle } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const OrdersPage = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [actionType, setActionType] = useState('');
  const [orders, setOrders] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/order/getAllorders');
        console.log('Orders fetched:', response.data); // Add this line to log the response
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
  
    fetchOrders();
  }, []);


  const filteredOrders = orders.filter(order => {
    return filterStatus === 'all' || order.status.toLowerCase() === filterStatus;
  });

  const handleStatusChange = (e) => setFilterStatus(e.target.value);

  const handleConfirmDeleteClick = (order, action) => {
    setSelectedOrder(order);
    setActionType(action);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleAction = async () => {
    if (actionType === 'confirm') {
      try {
        await axios.post(`http://localhost:4000/api/order/confirm/${selectedOrder.id}`);
      } catch (error) {
        console.error('Error confirming order:', error);
      }
    } else if (actionType === 'delete') {
      try {
        await axios.delete(`http://localhost:4000/api/order/delete/${selectedOrder.id}`);
        // Refresh orders after deletion
        setOrders(orders.filter(order => order.id !== selectedOrder.id));
      } catch (error) {
        console.error('Error deleting order:', error);
      }
    }
    closeModal();
  };

  const handleRowClick = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  return (
    <div className="md:p-6 flex flex-col px-4 justify-center items-center mt-20 mb-10">
      <h1 className="text-2xl font-semibold mb-8 text-center">Orders</h1>
      <div className="md:flex md:gap-0 md:justify-between w-full items-center grid grid-cols-2 gap-4 mb-4">
        <select
          value={filterStatus}
          onChange={handleStatusChange}
          className="p-2 border rounded"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <div className='col-span-2 flex justify-center'>
          <button className="w-[150px] bg-primary-pink text-white p-2 rounded">Add Order</button>
        </div>
      </div>

      <div className="w-full mt-5 border border-gray-200 rounded-lg shadow-md">
        
        <table className="w-full border-collapse bg-white">
          <thead>
            <tr>
              <th className="text-gray-800 font-semibold p-3 text-left">Name</th>
              <th className="text-gray-800 font-semibold p-3 text-left">Phone</th>
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
            className="text-green-500 cursor-pointer"
            title="Confirm Order"
            onClick={(e) => { e.stopPropagation(); handleConfirmDeleteClick(order, 'confirm'); }}
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
            <h2 className="text-lg font-semibold mb-4">Confirm Action</h2>
            <p className="mb-4">
              Are you sure you want to {actionType === 'confirm' ? 'confirm' : 'delete'} this order?
            </p>
            <div className="flex justify-end">
              <button
                className="text-gray-500 hover:text-gray-700 mr-4"
                onClick={closeModal}
              >
                <AiFillCloseCircle size={24} />
              </button>
              <button
                className={`${
                  actionType === 'confirm' ? 'bg-green-500' : 'bg-red-500'
                } text-white px-4 py-2 rounded`}
                onClick={handleAction}
              >
                {actionType === 'confirm' ? 'Confirm' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
