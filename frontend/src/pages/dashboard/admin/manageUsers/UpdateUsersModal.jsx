import React, { useState } from 'react';
import { useUpdateUserRoleMutation } from '../../../../redux/features/auth/authApi';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const UpdateUsersModal = ({ user, onClose, onRoleUpdate }) => {
    const [role, setRole] = useState(user?.role);
    const [updateUserRole, { isLoading }] = useUpdateUserRoleMutation();

    const handleUpdateRole = async () => {
        try {
            await updateUserRole({ userId: user?._id, role: role }).unwrap();
            Swal.fire({
                icon: 'success',
                color: 'purple',
                title: 'Role Updated!',
                showConfirmButton: false,
                timer: 1500
            })
            onRoleUpdate();
            onClose();
        } catch (error) {
            toast.error("Failed to update role");
        }
    };

    return (
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            {/* Modal Card - Set specific width and min-height to prevent squashing */}
            <div className="bg-white w-full max-w-[450px] rounded-[2.5rem] shadow-2xl overflow-hidden animate-fadeIn border border-gray-100">
                
                {/* Header */}
                <div className="px-8 py-6 bg-gray-50/50 border-b border-gray-100 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-black text-gray-800 tracking-tight">Edit User Role</h2>
                        <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-indigo-500">Access Control</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-red-50 rounded-full text-gray-400 hover:text-red-500 transition-all">
                        <i className="ri-close-line text-2xl"></i>
                    </button>
                </div>

                {/* Form Body */}
                <div className="p-8 space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 ml-1 uppercase">Account Email</label>
                        <div className="bg-gray-50 rounded-2xl px-5 py-4 flex items-center gap-3 border border-gray-100">
                            <i className="ri-mail-line text-indigo-400"></i>
                            <span className="text-sm font-bold text-gray-600 truncate">{user?.email}</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 ml-1 uppercase">Select Role</label>
                        <div className="relative group">
                            <select 
                                value={role} 
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full bg-white border-2 border-gray-100 rounded-2xl px-12 py-4 text-sm font-bold text-gray-700 appearance-none focus:border-indigo-500 focus:outline-none transition-all cursor-pointer shadow-sm"
                            >
                                <option value="user">User - Standard</option>
                                <option value="admin">Admin - Full Access</option>
                            </select>
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500">
                                <i className="ri-shield-user-line text-lg"></i>
                            </div>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 group-hover:text-indigo-500 transition-colors">
                                <i className="ri-arrow-down-s-line text-xl"></i>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="p-8 bg-gray-50/50 border-t border-gray-100 flex gap-4">
                    <button 
                        onClick={onClose}
                        className="flex-1 py-4 text-sm font-bold text-gray-500 hover:text-gray-800 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleUpdateRole}
                        disabled={isLoading}
                        className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 active:scale-95 transition-all disabled:opacity-50"
                    >
                        {isLoading ? "Updating..." : "Update Role"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpdateUsersModal;