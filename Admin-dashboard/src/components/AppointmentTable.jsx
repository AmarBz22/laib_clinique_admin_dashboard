import React from 'react';

const AppointmentsTable = () => {
  const appointments = [
    { id: 1, date: '2024-10-01', time: '10:00 AM', patient: 'John Doe', status: 'In Progress' },
    { id: 2, date: '2024-10-02', time: '11:00 AM', patient: 'Jane Smith', status: 'Pending' },
    { id: 3, date: '2024-10-03', time: '01:00 PM', patient: 'Michael Brown', status: 'Review' },
    { id: 4, date: '2024-10-04', time: '02:00 PM', patient: 'Emma Johnson', status: 'Completed' },
    { id: 5, date: '2024-10-05', time: '03:00 PM', patient: 'Sophia Wilson', status: 'In Progress' },
    { id: 6, date: '2024-10-06', time: '04:00 PM', patient: 'Liam Smith', status: 'Pending' },
  ];

  return (
    <div className="w-full mt-5 border border-gray-200 rounded-lg shadow-md"> {/* Full width for responsiveness */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Recent Appointments</h2>
        <button className="bg-primary-pink text-white px-4 py-2 rounded transition hover:bg-light-pink font-semibold">
          See All
        </button>
      </div>
      <table className="w-full border-collapse bg-white">
        <thead>
          <tr>
            <th className="text-gray-800 font-semibold p-3 text-left">Date</th>
            <th className="text-gray-800 font-semibold p-3 text-left">Time</th>
            <th className="text-gray-800 font-semibold p-3 text-left">Patient</th>
            <th className="text-gray-800 font-semibold p-3 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment.id} className="hover:bg-gray-50 transition-colors">
              <td className="p-3 border-b border-gray-200">{appointment.date}</td>
              <td className="p-3 border-b border-gray-200">{appointment.time}</td>
              <td className="p-3 border-b border-gray-200">{appointment.patient}</td>
              <td className="p-3 border-b border-gray-200 flex items-center">
                <span
                  className={`status-indicator 
                    ${appointment.status === 'In Progress' ? 'status-in-progress' : 
                      appointment.status === 'Pending' ? 'status-pending' : 
                      appointment.status === 'Review' ? 'status-review' : 
                      'status-completed'}`}
                />
                <span className="ml-2">{appointment.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AppointmentsTable;
