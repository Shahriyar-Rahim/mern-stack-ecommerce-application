import React, { useState } from 'react'
import { useDeleteOrderByIdMutation, useGetAllOrdersQuery } from '../../../../redux/features/orders/orderApi'
import Loading from '../../../../components/Loading';
import ErrorComponent from '../../../../components/ErrorComponent';
import NoData from '../../../../components/NoData';
import { toast } from 'react-toastify';
import UpdateOrderModal from './UpdateOrderModal';
import Swal from 'sweetalert2';

const getStatusColor = (status) => {
    switch (status) {
        case 'pending': return 'bg-yellow-500';
        case 'processing': return 'bg-blue-500';
        case 'shipped': return 'bg-green-500';
        case 'completed': return 'bg-gray-500';
        default: return 'bg-gray-300';
    }
};

const ManageOrders = () => {
    const { data, isLoading, isError, refetch } = useGetAllOrdersQuery();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all'); // Filter state
    
    const [deleteOrderById] = useDeleteOrderByIdMutation();

    if (isLoading) return <Loading />
    if (isError) return <ErrorComponent />
    
    const allOrders = data?.data || [];
    
    // Filter logic
    const filteredOrders = statusFilter === 'all' 
        ? allOrders 
        : allOrders.filter(order => order.status === statusFilter);

    if (allOrders.length === 0) return <NoData />

    const handleDeleteClick = async (orderId) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#7c3aed',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            });

            if (result.isConfirmed) {
                await deleteOrderById(orderId).unwrap();
                refetch();
                Swal.fire({
                    icon: 'success',
                    title: 'Order Deleted!',
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        } catch (error) {
            toast.error("Failed to delete order");
        }
    }

    const handleEdit = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    }

    const handleCloseModal = () => {
        setSelectedOrder(null);
        setIsModalOpen(false);
        refetch();
    }

    return (
        <section className="section__container p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <h2 className="text-2xl font-semibold">Manage Orders</h2>
                
                {/* Filter Dropdown */}
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-500 whitespace-nowrap">Filter by:</span>
                    <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 outline-none"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Completed</option>
                    </select>
                </div>
            </div>

            {/* THE SLIDING WRAPPER: overflow-x-auto makes it scrollable on mobile */}
            <div className="w-full overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredOrders.length > 0 ? (
                            filteredOrders.map((order, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap">{order?.orderId.slice(-8)}</td>
                                    <td className="py-4 px-6 text-sm text-gray-600 whitespace-nowrap">{order?.email}</td>
                                    <td className="py-4 px-6 whitespace-nowrap">
                                        <span className={`inline-block px-3 text-[10px] font-bold py-1 text-white rounded-full uppercase ${getStatusColor(order.status)}`}>
                                            {order?.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap">
                                        {new Date(order?.updatedAt).toLocaleDateString()}
                                    </td>
                                    <td className="py-4 px-6 text-sm font-medium text-center whitespace-nowrap">
                                        <div className="flex items-center justify-center space-x-4 gap-4">
                                            <button
                                                onClick={() => handleEdit(order)}
                                                className="text-indigo-600 hover:text-indigo-900 transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(order?._id)}
                                                className="text-red-600 hover:text-red-900 transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="py-10 text-center text-gray-500">
                                    No orders found matching this filter.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {selectedOrder && (
                <UpdateOrderModal
                    order={selectedOrder}
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                />
            )}
        </section>
    )
}

export default ManageOrders