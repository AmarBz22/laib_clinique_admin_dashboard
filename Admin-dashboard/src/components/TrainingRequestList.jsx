import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../../constants';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TrainingRequestList = ({ title }) => {
    const [requests, setRequests] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [actionType, setActionType] = useState(''); // Either 'confirm' or 'delete'

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                setError(null);
                const response = await axios.get(`${BACKEND_URL}/api/trainingrequest/training_request_by_course/${title}`);
                setRequests(response.data.result || []);
            } catch (err) {
                const errorMessage = err.response?.data?.message || err.message;
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        if (title) {
            fetchRequests();
        }
    }, [title]);

    const handleConfirm = async () => {
        if (!selectedRequest) return;
        try {
            const response = await axios.put(`${BACKEND_URL}/api/trainingrequest/trainingrequest/confirm/${selectedRequest}`);
            if (response.status === 200) {
                setRequests((prevRequests) =>
                    prevRequests.map((request) =>
                        request._id === selectedRequest ? { ...request, status: 'completed' } : request
                    )
                );
                toast.success('Request confirmed successfully!');
                window.location.reload(); // Refresh the page after confirmation
            }
        } catch (error) {
            toast.error('Error confirming request: ' + (error.response?.data?.message || error.message));
        } finally {
            closeModal();
        }
    };

    const handleDelete = async () => {
        if (!selectedRequest) return;
        try {
            const response = await axios.delete(`${BACKEND_URL}/api/trainingrequest/delete_trainingRequest/${selectedRequest}`);
            if (response.status === 200) {
                setRequests((prevRequests) => prevRequests.filter((request) => request._id !== selectedRequest));
                toast.success('Request deleted successfully!');
                window.location.reload(); // Refresh the page after deletion
            }
        } catch (error) {
            toast.error('Error deleting request: ' + (error.response?.data?.message || error.message));
        } finally {
            closeModal();
        }
    };

    const openModal = (requestId, action) => {
        setSelectedRequest(requestId);
        setActionType(action);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedRequest(null);
    };

    if (isLoading) return <h3 className="flex justify-center items-center h-screen text-lg font-bold">Loading requests...</h3>;
    if (error) return <h3 className="flex justify-center items-center h-screen text-lg font-bold text-red-600">{error}</h3>;

    return (
        <div className="mt-4">
            <ToastContainer /> {/* Toast Container for notifications */}
            <h3 className="text-lg font-bold">Training Requests</h3>
            {requests.length > 0 ? (
                <table className="min-w-full table-auto mt-2 border-collapse border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2 text-left">Name</th>
                            <th className="border p-2 text-left">Email</th>
                            <th className="border p-2 text-left">Phone</th>
                            <th className="border p-2 text-left">Status</th>
                            <th className="border p-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((request) => (
                            <tr key={request._id}>
                                <td className="border p-2">{request.name}</td>
                                <td className="border p-2">{request.email}</td>
                                <td className="border p-2">{request.phone}</td>
                                <td className="border p-2">
                                    {request.status === 'completed' ? (
                                        <span className="text-green-600 font-bold">Completed</span>
                                    ) : (
                                        <span className="text-yellow-600 font-bold">Pending</span>
                                    )}
                                </td>
                                <td className="border p-2">
                                    {request.status !== 'completed' && (
                                        <>
                                            <button
                                                className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                                                onClick={() => openModal(request._id, 'confirm')}
                                            >
                                                Confirm
                                            </button>
                                            <button
                                                className="bg-red-500 text-white px-2 py-1 rounded"
                                                onClick={() => openModal(request._id, 'delete')}
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No training requests found.</p>
            )}

            {/* Modal for Confirm or Delete actions */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 w-94">
                        <h3 className="text-lg font-semibold mb-4">{actionType === 'confirm' ? 'Confirm Request' : 'Delete Request'}</h3>
                        <p className="mb-4">
                            Are you sure you want to {actionType === 'confirm' ? 'confirm' : 'delete'} this request?
                        </p>
                        <div className="flex justify-end">
                            <button
                                className="order-2 bg-gray-300 text-black px-4 py-2 rounded ml-2"
                                onClick={closeModal}
                            >
                                No
                            </button>
                            <button
                                className={`order-1 px-4 py-2 rounded ${actionType === 'confirm' ? 'bg-primary-pink text-white' : 'bg-red-500 text-white'}`}
                                onClick={actionType === 'confirm' ? handleConfirm : handleDelete}
                            >
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrainingRequestList;
