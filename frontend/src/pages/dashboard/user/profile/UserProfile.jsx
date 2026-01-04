import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import avatarImg from '../../../../assets/avatar.png';
import { useEditProfileMutation } from '../../../../redux/features/auth/authApi';
import { setUser } from '../../../../redux/features/auth/authSlice';
import Loading from '../../../../components/Loading';
import ErrorComponent from '../../../../components/ErrorComponent';
import UploadImage from '../../admin/addProduct/UploadImage';

const UserProfile = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const [editProfile, { isLoading, isError }] = useEditProfileMutation();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        profileImage: '',
        bio: '',
        profession: '',
        userId: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || '',
                profileImage: user?.profileImage || '',
                bio: user?.bio || '',
                profession: user?.profession || '',
                userId: user?._id || ''
            });
        }
    }, [user]);

    if (isLoading) return <Loading />;
    if (isError) return <ErrorComponent />;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await editProfile({ id: user?._id, ...formData }).unwrap();
            dispatch(setUser(response.user || response.data)); 
            setIsModalOpen(false);
            Swal.fire({
                icon: 'success',
                title: 'Profile Updated!',
                showConfirmButton: false,
                timer: 1500,
                customClass: { popup: 'rounded-[2rem]' }
            });
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Update Failed' });
        }
    };

    const handleImageUpload = (imageUrl) => {
        setFormData({ ...formData, profileImage: imageUrl });
    };

    return (
        <div className='w-full lg:p-10 p-4 animate-in fade-in slide-in-from-bottom-4 duration-700'>
            {/* Main Card */}
            <div className='bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden max-w-5xl mx-auto'>
                {/* Banner Strip */}
                <div className='h-32 md:h-44 bg-linear-to-r from-indigo-600 via-purple-600 to-pink-500'></div>
                
                <div className='px-6 lg:px-16 pb-12'>
                    {/* Profile Header Area */}
                    <div className='relative flex flex-col md:flex-row items-center md:items-end -mt-16 md:-mt-20 mb-10 gap-6'>
                        <div className='relative group'>
                            <img 
                                src={formData.profileImage || avatarImg} 
                                alt="Profile" 
                                className='w-32 h-32 md:w-44 md:h-44 object-cover rounded-[2.5rem] border-[6px] md:border-10 border-white shadow-2xl bg-white transition-transform duration-500 group-hover:scale-105'
                            />
                        </div>

                        <div className='flex-1 text-center md:text-left md:pb-5'>
                            <h3 className='text-3xl lg:text-5xl font-black text-slate-800 tracking-tight'>
                                {formData.username || "N/a"}
                            </h3>
                            <p className='text-indigo-600 font-bold uppercase tracking-[0.25em] text-xs md:text-sm mt-1'>
                                {formData.profession || "N/A"}
                            </p>
                        </div>

                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className='md:mb-6 bg-slate-900 text-white flex items-center gap-2 px-6 py-3 rounded-2xl shadow-xl hover:bg-indigo-600 hover:-translate-y-1 transition-all active:scale-95'
                        >
                            <svg className='w-5 h-5' fill='none' stroke="currentColor" viewBox='0 0 24 24'>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            <span className='font-bold text-sm'>Edit Profile</span>
                        </button>
                    </div>

                    {/* Content Section */}
                    <div className='grid grid-cols-1 lg:grid-cols-3 gap-10 pt-10 border-t border-gray-50'>
                        <div className='lg:col-span-2 space-y-4'>
                            <h4 className='text-[10px] font-black uppercase tracking-[0.3em] text-slate-400'>Biography</h4>
                            <p className='text-slate-600 text-lg md:text-xl leading-relaxed italic font-medium'>
                                "{formData.bio || "Write your story here..."}"
                            </p>
                        </div>
                        
                        <div className='bg-slate-50 p-8 rounded-4xl border border-slate-100 flex flex-col justify-center'>
                            <h4 className='text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4'>Public Info</h4>
                            <div className='space-y-3'>
                                <p className='text-sm text-slate-500 font-medium'>User Reference:</p>
                                <p className='font-mono text-xs bg-white p-3 rounded-xl border border-slate-200 text-indigo-600 break-all'>
                                    {formData.userId}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stunning Snappy Modal */}
            {isModalOpen && (
                <div className='fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-999 p-4 sm:p-6'>
                    <div className='bg-white p-6 md:p-10 rounded-[2.5rem] w-full max-w-lg shadow-2xl relative animate-in zoom-in-95 duration-300'>
                        <button 
                            onClick={() => setIsModalOpen(false)} 
                            className='absolute top-6 right-6 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all'
                        >
                            <svg className='w-6 h-6' fill='none' stroke="currentColor" viewBox='0 0 24 24'><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                        
                        <div className='mb-8'>
                            <h2 className='text-2xl md:text-3xl font-black text-slate-800 tracking-tight'>Profile Settings</h2>
                            <p className='text-slate-400 text-sm font-medium'>Update your public presence</p>
                        </div>

                        <form onSubmit={handleOnSubmit} className='space-y-5'>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                                <div className='space-y-1.5'>
                                    <label className='text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1'>Username</label>
                                    <input type="text" name="username" value={formData.username} onChange={handleChange} className='w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold text-slate-700' placeholder="Your name" />
                                </div>
                                <div className='space-y-1.5'>
                                    <label className='text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1'>Profession</label>
                                    <input type="text" name="profession" value={formData.profession} onChange={handleChange} className='w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold text-slate-700' placeholder="e.g. Designer" />
                                </div>
                            </div>
                            
                            {/* <div className='space-y-1.5'>
                                <label className='text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1'>Profile Image URL</label>
                                <input type="text" name="profileImage" value={formData.profileImage} onChange={handleChange} className='w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold text-slate-700' placeholder="https://..." />
                            </div> */}
                            <div className='space-y-1.5'>
                                <UploadImage 
                                    name="profileImage"
                                    label="Upload Profile Photo"
                                    setImage={handleImageUpload} 
                                />
                                {formData.profileImage && (
                                    <p className="text-[10px] text-gray-400 truncate">URL: {formData.profileImage}</p>
                                )}
                            </div>

                            <div className='space-y-1.5'>
                                <label className='text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1'>Bio</label>
                                <textarea name="bio" value={formData.bio} onChange={handleChange} className='w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium text-slate-700 resize-none' rows="3" placeholder="Tell us about yourself..."></textarea>
                            </div>

                            <button type='submit' className='w-full bg-indigo-600 text-white font-black py-5 rounded-3xl hover:bg-slate-900 transition-all shadow-xl shadow-indigo-200 active:scale-95 flex justify-center items-center overflow-hidden relative'>
                                {isLoading ? <Loading /> : 'Save Changes'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfile;