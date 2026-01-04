import React, { useState } from "react";
import avatar from "../assets/avatar.png";
import { Link, NavLink, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutUserMutation } from "../redux/features/auth/authApi";
import { logOut } from "../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import CartModal from "../pages/shop/CartModal";
import { motion, AnimatePresence } from "framer-motion";

const NavBar = () => {
  const products = useSelector((state) => state.cart.products);
  const { user } = useSelector((state) => state.auth);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Shop", path: "/shop" },
    { label: "Pages", path: "/pages" },
    { label: "Contact", path: "/contact" },
  ];

  const userDropDownMenus = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Profile", path: "/dashboard/profile" },
    { label: "Payments", path: "/dashboard/payments" },
    { label: "Orders", path: "/dashboard/orders" },
  ];

  const adminDropDownMenus = [
    { label: "Dashboard", path: "/dashboard/admin" },
    { label: "Manage Items", path: "/dashboard/manage-products" },
    { label: "All Orders", path: "/dashboard/manage-orders" },
    { label: "Add Product", path: "/dashboard/add-product" },
  ];

  const dropDownMenus = user?.role === "admin" ? adminDropDownMenus : userDropDownMenus;

  const [logoutUser] = useLogoutUserMutation();

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      dispatch(logOut());
      toast.success("Logout successful");
      navigate("/");
    } catch (error) {
      toast.error("Logout Failed");
    }
  };

  return (
    <header className="fixed-nav-bar w-full bg-white shadow-sm z-100">
      {/* STRATEGY: Use a 3-column grid where each column is exactly 1fr.
          This prevents the logo from being pushed by the width of the links.
      */}
      <nav className="max-w-screen-2xl mx-auto px-4 py-4 grid grid-cols-3 items-center">
        
        {/* 1. LEFT SECTION (Mobile: Burger, Desktop: Links) */}
        <div className="flex items-center justify-start overflow-hidden">
          <button 
            onClick={() => setIsMobileMenuOpen(true)} 
            className="md:hidden text-2xl active:scale-90 transition-transform"
          >
            <i className="ri-menu-line"></i>
          </button>
          
          <ul className="hidden md:flex items-center gap-6 nav__links">
            {navLinks.map((link) => (
              <li key={link.path} className="shrink-0">
                <NavLink 
                  to={link.path} 
                  className={({ isActive }) => isActive ? "active font-bold text-primary" : "hover:text-primary transition-colors"}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* 2. CENTER SECTION (Logo) */}
        <div className="flex justify-center items-center">
          <Link to="/" className="text-2xl font-bold tracking-tighter whitespace-nowrap">
            Lebaba<span className="text-primary">.</span>
          </Link>
        </div>

        {/* 3. RIGHT SECTION (Icons) */}
        <div className="flex items-center justify-end gap-4 md:gap-6">
          {/* Desktop Search */}
          <Link to="/search" className="hidden md:block hover:text-primary transition-colors">
            <i className="ri-search-line text-xl"></i>
          </Link>
          
          {/* Cart */}
          <button onClick={() => setIsCartOpen(true)} className="relative p-1 hover:text-primary transition-colors">
            <i className="ri-shopping-bag-line text-xl cursor-pointer"></i>
            <span className="absolute -top-1 -right-2 size-4 bg-primary text-white text-[10px] flex items-center justify-center rounded-full font-bold border border-white">
              {products.length}
            </span>
          </button>

          {/* User/Avatar */}
          <div className="relative">
            {user ? (
              <>
                <motion.img
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  src={user?.profileImage || avatar}
                  className="size-8 rounded-full cursor-pointer border-2 border-transparent hover:border-primary transition-all object-cover shrink-0"
                />
                <AnimatePresence>
                  {isDropdownOpen && (
                    <>
                      {/* Backdrop for click-away */}
                      <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)}></div>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.1 }}
                        className="absolute right-0 top-full mt-3 w-48 bg-white shadow-xl rounded-xl border border-gray-100 z-20 overflow-hidden"
                      >
                        <ul className="p-2">
                          {dropDownMenus.map((menu, idx) => (
                            <li key={idx}>
                              <Link 
                                to={menu.path} 
                                onClick={() => setIsDropdownOpen(false)}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-light hover:text-primary rounded-md transition-colors"
                              >
                                {menu.label}
                              </Link>
                            </li>
                          ))}
                          <li className="border-t mt-1 pt-1">
                            <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-500 font-bold hover:bg-red-50 rounded-md">
                              Logout
                            </button>
                          </li>
                        </ul>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <Link to="/login" className="hover:text-primary transition-colors">
                <i className="ri-user-line text-xl"></i>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* MOBILE DRAWER (High Stiffness for Snappiness) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-200"
            />
            <motion.div 
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 450, damping: 40 }}
              className="fixed left-0 top-0 h-full w-[280px] bg-white z-201 p-6 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <span className="text-xl font-bold">Menu</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>
              <ul className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <li key={link.path}>
                    <NavLink 
                      to={link.path} 
                      onClick={() => setIsMobileMenuOpen(false)} 
                      className="text-lg font-medium block border-b border-gray-100 pb-2 hover:text-primary"
                    >
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <CartModal products={products} isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
};

export default NavBar;