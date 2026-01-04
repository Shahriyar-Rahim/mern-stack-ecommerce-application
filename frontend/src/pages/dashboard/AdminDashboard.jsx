import React, { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router'
import { useLogoutUserMutation } from '../../redux/features/auth/authApi'
import { useDispatch } from 'react-redux'
import { logOut } from '../../redux/features/auth/authSlice'

const navItems = [
    { path: "/dashboard/admin", label: "Dashboard", icon: "ri-dashboard-3-line" },
    { path: "/dashboard/add-product", label: "Add Product", icon: "ri-add-circle-line" },
    { path: "/dashboard/manage-products", label: "Products", icon: "ri-shopping-bag-3-line" },
    { path: "/dashboard/users", label: "Users", icon: "ri-group-line" },
    { path: "/dashboard/manage-orders", label: "Orders", icon: "ri-truck-line" },
]

const AdminDashboard = () => {
    const [logoutUser] = useLogoutUserMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // --- SCROLL LOGIC START ---
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const controlNavbar = () => {
            if (typeof window !== 'undefined') {
                // If scrolling down, hide; if scrolling up, show
                if (window.scrollY > lastScrollY && window.scrollY > 100) { 
                    setIsVisible(false);
                } else {
                    setIsVisible(true);
                }
                setLastScrollY(window.scrollY);
            }
        };

        window.addEventListener('scroll', controlNavbar);
        return () => window.removeEventListener('scroll', controlNavbar);
    }, [lastScrollY]);
    // --- SCROLL LOGIC END ---

    const handleLogOut = async () => {
        try {
            await logoutUser().unwrap();
            dispatch(logOut());
            navigate("/");
        } catch (error) {
            console.error("Error logging out:", error);
        }
    }

    return (
        <div className='flex flex-col h-full font-sans bg-white'>
            {/* Top Header */}
            <div className='flex flex-row md:flex-col justify-between items-center md:items-start p-4 md:p-0 mb-0 md:mb-6 border-b md:border-none border-slate-50'>
                <div>
                    <Link to="/" className='text-xl md:text-2xl font-black tracking-tighter text-slate-900'>
                        LEBABA<span className='text-indigo-600'>.</span>
                    </Link>
                    <p className='hidden md:block text-[10px] uppercase tracking-widest font-bold text-slate-400'>Admin Terminal</p>
                </div>
                
                <button onClick={handleLogOut} className='md:hidden p-2 rounded-lg text-red-500 bg-red-50 active:scale-90 transition-transform'>
                    <i className="ri-logout-box-r-line text-lg"></i>
                </button>
            </div>

            <hr className='hidden md:block mb-6 border-slate-100' />

            {/* Navigation with Transition Logic */}
            <nav className={`
                fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-2 py-2 z-50
                transition-transform duration-300 ease-in-out
                ${isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"} 
                md:relative md:border-none md:p-0 md:z-auto md:flex-1 md:translate-y-0 md:opacity-100
            `}>
                <ul className='flex flex-row md:flex-col items-center justify-around md:justify-start gap-1 md:gap-2 w-full'>
                    {navItems.map((item, index) => (
                        <li key={index} className="flex-1 md:w-full">
                            <NavLink 
                                to={item.path}
                                className={({ isActive }) => `
                                    flex flex-col md:flex-row items-center md:gap-4 
                                    py-2 md:px-5 md:py-3.5 rounded-xl transition-all duration-300 group
                                    ${isActive 
                                        ? "text-indigo-600 md:bg-indigo-600 md:text-white" 
                                        : "text-slate-400 md:text-slate-500 md:hover:bg-slate-50"}
                                `}
                            >
                                {({ isActive }) => (
                                    <>
                                        <i className={`${item.icon} text-2xl md:text-lg ${isActive ? "text-indigo-600 md:text-white" : "text-slate-400 md:group-hover:text-indigo-600"}`}></i>
                                        <span className='text-[10px] md:text-sm font-bold md:font-semibold uppercase md:capitalize tracking-tight text-center'>
                                            {item.label}
                                        </span>
                                        {isActive && <div className="md:hidden w-1 h-1 bg-indigo-600 rounded-full mt-0.5"></div>}
                                    </>
                                )}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className='hidden md:block mt-auto pt-8 border-t border-slate-100'>
                <button onClick={handleLogOut} className='w-full flex flex-row items-center gap-4 px-5 py-4 rounded-xl text-slate-500 font-bold hover:bg-red-50 hover:text-red-600 transition-all duration-300'>
                    <i className="ri-logout-box-r-line text-xl"></i>
                    <span className='text-sm uppercase tracking-widest'>Logout</span>
                </button>
            </div>
        </div>
    )
}

export default AdminDashboard