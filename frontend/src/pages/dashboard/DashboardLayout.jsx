import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, Link } from "react-router";
import Swal from "sweetalert2";
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";
import avatarImg from "../../assets/avatar.png";

const DashboardLayout = () => {
  const { user } = useSelector((state) => state.auth);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second for a "Live" feel
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!user) {
    Swal.fire("Please login to access this page");
    return <Navigate to="/login" />;
  }

  const renderDashboard = () => {
    switch (user?.role) {
      case "admin":
        return <AdminDashboard />;
      case "user":
        return <UserDashboard />;
      default:
        return <Navigate to="/login" />;
    }
  };

  // Format date and time
  const formattedDate = currentTime.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    /* Removed py-6 and px-4 on mobile so content can touch the edges */
    <div className="min-h-screen bg-extra-light flex flex-col md:items-center md:justify-center pt-0 md:py-12 px-0 md:px-6 pb-24 md:pb-12">
      {/* Removed gap-6 on mobile to allow the Sidebar and Main area to touch */}
      <div className="container mx-auto max-w-6xl flex flex-col md:flex-row gap-0 md:gap-10 items-center md:items-stretch justify-center w-full">
        {/* Sidebar Header: Removed all mobile padding */}
        <header className="w-full md:w-72 bg-white md:bg-white md:border md:border-slate-200 p-0 md:p-8 md:rounded-3xl md:shadow-sm flex flex-col justify-center">
          {renderDashboard()}
        </header>

        {/* Main Content Area: Added px-4 back here so the interior text doesn't touch the screen edges */}
        <main className="w-full md:flex-1 min-h-[60vh] md:min-h-[80vh] p-4 md:p-10 bg-white border-t md:border border-slate-100 shadow-2xl shadow-slate-200/60 md:rounded-3xl flex flex-col">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-slate-50">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-indigo-600 overflow-hidden flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-indigo-100 uppercase">
                {user?.image || avatarImg ? (
                  <img
                    src={user?.profileImage || avatarImg}
                    alt="profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span>{user?.username?.charAt(0) || "U"}</span>
                )}
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-slate-800 leading-tight">
                  Welcome,{" "}
                  <span className="text-indigo-600 capitalize">
                    {user?.username || "User"}
                  </span>
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                    {user?.role}
                  </span>
                  <span className="text-slate-300">|</span>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                    <i className="ri-time-line text-indigo-500"></i>
                    {formattedDate} • {formattedTime}
                  </p>
                </div>
              </div>
            </div>

            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-500 hover:text-white hover:bg-slate-900 rounded-xl transition-all duration-300 w-fit border border-slate-100 shadow-sm"
            >
              <i className="ri-home-4-line"></i>
              Back to Home
            </Link>
          </div>

          <div className="flex-1">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
