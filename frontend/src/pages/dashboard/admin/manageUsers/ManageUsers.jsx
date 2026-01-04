import React, { useState } from 'react'
import { useDeleteUserMutation, useGetUsersQuery } from '../../../../redux/features/auth/authApi';
import Loading from '../../../../components/Loading';
import ErrorComponent from '../../../../components/ErrorComponent';
import { Link } from 'react-router'; 
import NoData from '../../../../components/NoData';
import { toast } from 'react-toastify';
import UpdateUsersModal from './UpdateUsersModal';
// import { formatDistanceToNow } from 'date-fns'; // Recommended for "time ago" formatting

const ManageUsers = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState(""); 
    const [filterRole, setFilterRole] = useState("all");
    const [copiedEmail, setCopiedEmail] = useState(null);
    
    const { data, isLoading, error, refetch } = useGetUsersQuery();
    const [deleteUser] = useDeleteUserMutation();

    if (isLoading) return <Loading />;
    if (error) return <ErrorComponent />;

    const users = data?.data || [];
    if(users === null) return <NoData />

    const totalUsers = users.length;
    const adminCount = users.filter(u => u.role === 'admin').length;
    const standardUsers = users.filter(u => u.role === 'user').length;

    const filteredUsers = users.filter((user) => {
        const matchesSearch = user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === "all" || user?.role === filterRole;
        return matchesSearch && matchesRole;
    });

    const handleCopyEmail = (email) => {
        navigator.clipboard.writeText(email);
        setCopiedEmail(email);
        toast.info(`Copied: ${email}`, { autoClose: 1000, position: "bottom-right" });
        setTimeout(() => setCopiedEmail(null), 2000);
    }

    const handleDeleteUser = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await deleteUser(id).unwrap();
                toast.success("User deleted successfully");
                refetch();
            } catch (error) {
                toast.error("Failed to delete user");
            }
        }
    }

    return (
        <section className="p-4 md:p-6 space-y-8 max-w-[1400px] mx-auto">
            {/* --- HORIZONTAL STATS CARDS (SNAP SCROLL ON MOBILE) --- */}
            <div className="flex overflow-x-auto pb-4 gap-4 snap-x snap-mandatory no-scrollbar lg:grid lg:grid-cols-3 lg:overflow-visible lg:pb-0">
                <div className="shrink-0 w-[85%] sm:w-[300px] lg:w-auto snap-center bg-white p-6 rounded-4xl border border-gray-100 shadow-sm flex items-center gap-5">
                    <div className="shrink-0 w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600"><i className="ri-group-line text-2xl"></i></div>
                    <div className="min-w-0">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Total Users</p>
                        <h4 className="text-2xl font-black text-gray-800 leading-none mt-1">{totalUsers}</h4>
                    </div>
                </div>
                <div className="shrink-0 w-[85%] sm:w-[300px] lg:w-auto snap-center bg-white p-6 rounded-4xl border border-gray-100 shadow-sm flex items-center gap-5">
                    <div className="shrink-0 w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600"><i className="ri-shield-star-line text-2xl"></i></div>
                    <div className="min-w-0">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Admins</p>
                        <h4 className="text-2xl font-black text-gray-800 leading-none mt-1">{adminCount}</h4>
                    </div>
                </div>
                <div className="shrink-0 w-[85%] sm:w-[300px] lg:w-auto snap-center bg-white p-6 rounded-4xl border border-gray-100 shadow-sm flex items-center gap-5">
                    <div className="shrink-0 w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600"><i className="ri-user-follow-line text-2xl"></i></div>
                    <div className="min-w-0">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Standard</p>
                        <h4 className="text-2xl font-black text-gray-800 leading-none mt-1">{standardUsers}</h4>
                    </div>
                </div>
            </div>

            {/* --- CONTROLS & TABLE --- */}
            <div className="bg-white shadow-md rounded-[2.5rem] overflow-hidden border border-gray-100">
                <div className="px-8 py-8 border-b border-gray-100 bg-gray-50/50 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div>
                        <h3 className="text-xl font-black text-gray-800 tracking-tight">User Directory</h3>
                        <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mt-1">Management Portal</p>
                    </div>
                    <div className="flex flex-col md:flex-row flex-1 max-w-3xl items-center gap-3">
                        <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="w-full md:w-48 pl-5 pr-10 py-3 bg-white border-2 border-gray-100 rounded-2xl text-sm font-bold appearance-none cursor-pointer">
                            <option value="all">All Roles</option>
                            <option value="admin">Admins</option>
                            <option value="user">Users</option>
                        </select>
                        <div className="relative w-full group">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within:text-indigo-500"><i className="ri-search-line text-lg"></i></span>
                            <input type="text" placeholder="Search by email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-12 py-3 bg-white border-2 border-gray-100 rounded-2xl text-sm font-bold" />
                        </div>
                        <Link to="/" className="w-full md:w-auto">
                            <button className="w-full bg-indigo-600 text-white text-xs font-black uppercase tracking-widest px-8 py-4 rounded-2xl shadow-lg shadow-indigo-100 active:scale-95 transition-all">Back Home</button>
                        </Link>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {filteredUsers.length > 0 ? (
                        <table className="w-full text-left border-collapse min-w-[1000px]">
                            <thead>
                                <tr className="bg-gray-50/50 text-gray-400 uppercase text-[10px] tracking-[0.2em] font-black border-b border-gray-100">
                                    <th className="px-8 py-5">No.</th>
                                    <th className="px-8 py-5">User Email</th>
                                    <th className="px-8 py-5 text-center">User Role</th>
                                    {/* <th className="px-8 py-5 text-center">Last Login</th> */}
                                    <th className="px-8 py-5 text-center">Manage</th>
                                    <th className="px-8 py-5 text-center">Delete</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredUsers.map((user, index) => (
                                    <tr key={user._id} className="hover:bg-indigo-50/30 transition-colors group">
                                        <td className="px-8 py-5 text-xs font-bold text-gray-300">{(index + 1).toString().padStart(2, '0')}</td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3 group/item">
                                                <span className="text-sm font-bold text-gray-700">{user?.email}</span>
                                                <button onClick={() => handleCopyEmail(user?.email)} className={`p-1.5 rounded-lg transition-all ${copiedEmail === user?.email ? 'bg-green-100 text-green-600' : 'bg-gray-50 text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-indigo-50 hover:text-indigo-600'}`}>
                                                    <i className={copiedEmail === user?.email ? "ri-check-line" : "ri-file-copy-line"}></i>
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tighter ${user?.role === "admin" ? "bg-indigo-100 text-indigo-700" : "bg-amber-100 text-amber-700"}`}>{user?.role}</span>
                                        </td>
                                        {/* --- LAST LOGIN COLUMN --- */}
                                        {/* <td className="px-8 py-5 text-center">
                                            <span className="text-xs font-bold text-gray-500">
                                                {user?.updatedAt 
                                                    ? formatDistanceToNow(new Date(user.updatedAt), { addSuffix: true }) 
                                                    : "Never"
                                                }
                                            </span>
                                        </td> */}
                                        <td className="px-8 py-5 text-center">
                                            <button onClick={() => { setSelectedUser(user); setIsModalOpen(true); }} className="inline-flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest hover:text-indigo-800"><i className="ri-edit-2-line text-base"></i> Edit</button>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <button onClick={() => handleDeleteUser(user?._id)} className="p-2.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"><i className="ri-delete-bin-line text-xl"></i></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="py-32 flex flex-col items-center"><NoData title="Empty Results" message="No users found matching filters." /></div>
                    )}
                </div>
            </div>

            {isModalOpen && <UpdateUsersModal user={selectedUser} onClose={() => { setIsModalOpen(false); setSelectedUser(null); }} onRoleUpdate={refetch} />}
        </section>
    )
}

export default ManageUsers;