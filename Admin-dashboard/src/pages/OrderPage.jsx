import React, { useState } from 'react';
import { FaCheckCircle, FaTrashAlt } from 'react-icons/fa';
import { AiFillCloseCircle } from 'react-icons/ai'; // Icon for closing the modal
import { useNavigate } from 'react-router-dom'; // Import useNavigate


const OrdersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null); // Store the order to confirm/delete
  const [actionType, setActionType] = useState(''); // Store action type ('confirm' or 'delete')

  const navigate = useNavigate(); // Hook to navigate

  // Sample orders data
  const orders = [
    { 
      id: 1, 
      name: 'John Doe', 
      status: 'Pending', 
      phone: '123-456-7890',
      items: ['Item A', 'Item B'], // List of items in the order
      totalPrice: 59.99, // Total price of the order
      location: '123 Main St, Anytown, USA' // Location of the order
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      status: 'Completed', 
      phone: '987-654-3210',
      items: ['Item C'], // List of items in the order
      totalPrice: 19.99, // Total price of the order
      location: '456 Elm St, Anytown, USA' // Location of the order
    },
    { 
      id: 3, 
      name: 'Mike Johnson', 
      status: 'Cancelled', 
      phone: '555-555-5555',
      items: ['Item D', 'Item E', 'Item F'], // List of items in the order
      totalPrice: 89.99, // Total price of the order
      location: '789 Oak St, Anytown, USA' // Location of the order
    },
    { 
      id: 4, 
      name: 'Emily Davis', 
      status: 'Pending', 
      phone: '444-444-4444',
      items: ['Item G'], // List of items in the order
      totalPrice: 39.99, // Total price of the order
      location: '321 Pine St, Anytown, USA' // Location of the order
    },
  ];
  

  // Search and filter logic
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status.toLowerCase() === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Handle search and filter change
  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleStatusChange = (e) => setFilterStatus(e.target.value);

  const handleConfirmDeleteClick = (order, action) => {
    setSelectedOrder(order);
    setActionType(action);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleAction = () => {
    if (actionType === 'confirm') {
      console.log(`Order ${selectedOrder.id} confirmed`);
    } else if (actionType === 'delete') {
      console.log(`Order ${selectedOrder.id} deleted`);
    }
    closeModal();
  };
  const handleRowClick = (orderId) => {
    navigate(`/orders/${orderId}`); // Navigate to appointment details
  };

  return (
    <div className="p-6 mt-20">
      <h1 className="text-2xl font-semibold mb-8 text-center">Orders</h1>
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search by order name"
          value={searchTerm}
          onChange={handleSearchChange}
          className="p-2 border rounded"
        />
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
        <button className="bg-primary-pink text-white p-2 rounded">Add Order</button>
      </div>

      <div className="w-full mt-5 border border-gray-200 rounded-lg shadow-md">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Filtered Orders</h2>
        </div>
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
              onClick={() => handleRowClick(order.id)}
              >
                <td className="p-3 border-b border-gray-200">{order.name}</td>
                <td className="p-3 border-b border-gray-200">{order.phone}</td>
                <td className="p-3 border-b border-gray-200">{order.status}</td>
                <td className="p-3 border-b border-gray-200 flex space-x-2">
                  <FaCheckCircle
                    className="text-green-500 cursor-pointer"
                    title="Confirm Order"
                    onClick={() => handleConfirmDeleteClick(order, 'confirm')}
                  />
                  <FaTrashAlt
                    className="text-red-500 cursor-pointer"
                    title="Delete Order"
                    onClick={() => handleConfirmDeleteClick(order, 'delete')}
                  />
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
