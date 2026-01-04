import React, { useState } from 'react';
import { useUpdateOrderStatusMutation } from '../../../../redux/features/orders/orderApi';
import { toast } from 'react-toastify';
import Loading from '../../../../components/Loading';
import ErrorComponent from '../../../../components/ErrorComponent';

const UpdateOrderModal = ({ order, isOpen, onClose }) => {
    const [status, setStatus] = useState(order?.status);
    const [updateOrderStatus, { isLoading, isError }] = useUpdateOrderStatusMutation();

    if (!isOpen) return null;

    // We handle Loading/Error states inside the modal body to prevent the 
    // entire modal UI from disappearing/glitching during the process.
    const handleUpdate = async () => {
        try {
            await updateOrderStatus({ id: order?._id, status }).unwrap();
            toast.success("Order status updated successfully");
            onClose();
        } catch (error) {
            console.error("Error updating order status:", error);
            toast.error("Failed to update order status");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-x-hidden overflow-y-auto">
            {/* Soft Backdrop with Blur */}
            <div 
                className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" 
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all border border-gray-100">
                
                {/* Header */}
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Update Order Status</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Updating status for: <span className="font-mono font-medium text-indigo-600">#{order?.orderId?.slice(-8)}</span>
                    </p>
                </div>

                {isLoading ? (
                    <div className="py-10"><Loading /></div>
                ) : isError ? (
                    <ErrorComponent />
                ) : (
                    <>
                        {/* Body */}
                        <div className="mb-8">
                            <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="status">
                                Select New Status
                            </label>
                            <div className="relative">
                                <select
                                    id="status"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="block w-full px-4 py-3 text-gray-700 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none transition-all cursor-pointer"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Completed</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Footer / Buttons */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={onClose}
                                className="flex-1 px-4 py-3 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdate}
                                className="flex-1 px-4 py-3 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all active:scale-95"
                            >
                                Update Status
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default UpdateOrderModal;