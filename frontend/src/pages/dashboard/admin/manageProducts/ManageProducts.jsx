import React, { useState } from 'react'
import { useDeleteProductMutation, useFetchAllProductsQuery } from '../../../../redux/features/products/productsApi';
import ErrorComponent from '../../../../components/ErrorComponent';
import Loading from '../../../../components/Loading';
import NoData from '../../../../components/NoData';
import { toast } from 'react-toastify';
import { Link } from 'react-router';
import Swal from 'sweetalert2';

const ManageProducts = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(12);

    const { data: productsData = {}, isLoading, error, refetch } = useFetchAllProductsQuery({
        category: "",
        color: "",
        minPrice: "",
        maxPrice: "",
        page: currentPage,
        limit: productsPerPage,
    });

    const [deleteProduct] = useDeleteProductMutation();

    if (isLoading) return <Loading />;
    if (error) return <ErrorComponent />

    const { products = [], totalPages, totalProducts } = productsData?.data || {};
    
    if (!products || products.length === 0) return <NoData />

    const handleDeleteProduct = async (id) => {
        if (Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#7c3aed',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        })) {
            try {
                await deleteProduct(id).unwrap();
                toast.success("Product deleted successfully");
                await refetch();
            } catch (error) {
                toast.error("Failed to delete product");
            }
        }
    }

    const handlePageChange = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) setCurrentPage(pageNumber);
    };

    const startProduct = (currentPage - 1) * productsPerPage + 1;
    const endProduct = Math.min(startProduct + products.length - 1, totalProducts);

    return (
        <div className="section__container mt-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h3 className="text-2xl font-bold text-gray-800">Manage Products</h3>
                    <p className='text-sm text-gray-500 mt-1'>
                        Showing <span className='font-semibold text-gray-800'>{startProduct}-{endProduct}</span> of {totalProducts} products
                    </p>
                </div>
                <Link to="/dashboard/add-new-product">
                    <button className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-black transition-all shadow-sm flex items-center gap-2">
                        <i className="ri-add-line"></i> Add Product
                    </button>
                </Link>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-xs uppercase font-bold text-gray-600">No.</th>
                            <th className="px-6 py-4 text-xs uppercase font-bold text-gray-600">Product</th>
                            <th className="px-6 py-4 text-xs uppercase font-bold text-gray-600">Date</th>
                            <th className="px-6 py-4 text-xs uppercase font-bold text-gray-600 text-right pr-10">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {products.map((product, index) => (
                            <tr key={product?._id} className="hover:bg-blue-50/30 transition-colors">
                                <td className="px-6 py-4 text-sm text-gray-500">{startProduct + index}</td>
                                <td className="px-6 py-4">
                                    <Link to={`/shop/${product?._id}`} className="font-medium text-gray-900 hover:text-primary">
                                        {product?.name}
                                    </Link>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {new Date(product?.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end items-center gap-4 pr-4"> {/* Added gap-4 here */}
                                        <Link 
                                            to={`/dashboard/update-product/${product?._id}`} 
                                            className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1"
                                        >
                                            <i className="ri-edit-line"></i> Edit
                                        </Link>
                                        <button 
                                            onClick={() => handleDeleteProduct(product?._id)}
                                            className="text-red-500 hover:text-red-700 font-medium text-sm flex items-center gap-1"
                                        >
                                            <i className="ri-delete-bin-line"></i> Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile List View */}
            <div className="md:hidden space-y-4">
                {products.map((product, index) => (
                    <div key={product?._id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-start mb-3">
                            <span className="text-xs font-bold text-gray-400">#{startProduct + index}</span>
                            <span className="text-xs text-gray-400">{new Date(product?.createdAt).toLocaleDateString()}</span>
                        </div>
                        <h4 className="font-bold text-gray-800 mb-5">{product?.name}</h4>
                        <div className="flex gap-3"> {/* Increased gap-3 for mobile buttons */}
                            <Link 
                                to={`/dashboard/update-product/${product?._id}`} 
                                className="flex-1 text-center bg-blue-50 text-blue-600 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2"
                            >
                                <i className="ri-edit-line text-lg"></i> Edit
                            </Link>
                            <button 
                                onClick={() => handleDeleteProduct(product?._id)}
                                className="flex-1 bg-red-50 text-red-600 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2"
                            >
                                <i className="ri-delete-bin-line text-lg"></i> Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Controls */}
            <div className="mt-10 flex flex-wrap justify-center items-center gap-2 pb-10">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 bg-white border border-gray-200 rounded-lg disabled:opacity-30"
                >
                    <i className="ri-arrow-left-s-line"></i>
                </button>
                
                {[...Array(totalPages)].map((_, index) => (
                    <button
                        key={index}
                        onClick={() => handlePageChange(index + 1)}
                        className={`w-10 h-10 rounded-lg font-semibold ${
                            currentPage === index + 1 
                            ? 'bg-primary text-white shadow-md' 
                            : 'bg-white text-gray-600 border border-gray-200'
                        }`}
                    >
                        {index + 1}
                    </button>
                ))}

                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 bg-white border border-gray-200 rounded-lg disabled:opacity-30"
                >
                    <i className="ri-arrow-right-s-line"></i>
                </button>
            </div>
        </div>
    )
}

export default ManageProducts