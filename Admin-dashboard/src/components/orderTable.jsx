import React from 'react';

const OrdersTable = ({ showSeeAllButton }) => {
  const orders = [
    { name: "John Doe", location: "New York", phone: "123-456-7890" },
    { name: "Jane Smith", location: "Los Angeles", phone: "987-654-3210" },
    { name: "Mike Johnson", location: "Chicago", phone: "555-555-5555" },
    { name: "Emily Davis", location: "Miami", phone: "444-444-4444" },
  ];

  return (
    <div className="w-full mt-5 border border-gray-200 rounded-lg shadow-md">
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Recent Orders</h2>
        {showSeeAllButton && (
          <button className="bg-primary-pink text-white px-4 py-2 rounded transition hover:bg-light-pink font-semibold">
            See All
          </button>
        )}
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
            {orders.map((order, index) => (
              <tr key={index} className={`border-b ${index % 2 === 0 ? 'bg-gray-50' : ''}`}>
                <td className="p-2">{order.name}</td>
                <td className="p-2">{order.location}</td>
                <td className="p-2">{order.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersTable;
