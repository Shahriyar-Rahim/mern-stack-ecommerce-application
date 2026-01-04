import React from "react";
import { useSelector } from "react-redux";
// Assuming you have a separate admin hook or the stats hook handles admin roles
import { useGetAdminStatsQuery } from "../../../../redux/features/stats/statsApi"; 
import Loading from "../../../../components/Loading";
import ErrorComponent from "../../../../components/ErrorComponent";
import AdminStats from "./AdminStats"; // Using the AdminStats component we created
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Navigate } from "react-router";
import AdminStatsChart from "./AdminStatsChart";
import NoData from "../../../../components/NoData";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDMain = () => {
  const { user } = useSelector((state) => state.auth);
  // Ensure you are calling the admin-specific stats endpoint
  const { data: adminData, isLoading, error } = useGetAdminStatsQuery(user?.email);

  if(!user){
    return Navigate("/login");
  }
  if (isLoading) return <Loading />;
  if (error) return <ErrorComponent />;

  const stats = adminData || {};

  if(!stats) return <NoData />
  
  // Destructuring the admin-specific keys
  const { 
    totalEarnings, 
    totalOrders, 
    totalProducts, 
    totalReviews, 
    totalUsers 
  } = stats;

  // Chart Data Configuration for Admin
//   const data = {
//     labels: ["Earnings", "Orders", "Products", "Reviews", "Users"],
//     datasets: [
//       {
//         label: "Platform Metrics",
//         data: [totalEarnings, totalOrders, totalProducts, totalReviews, totalUsers],
//         backgroundColor: [
//           "rgba(34, 197, 94, 0.7)",  // Emerald (Earnings)
//           "rgba(59, 130, 246, 0.7)",  // Blue (Orders)
//           "rgba(99, 102, 241, 0.7)",  // Indigo (Products)
//           "rgba(245, 158, 11, 0.7)",  // Amber (Reviews)
//           "rgba(168, 85, 247, 0.7)",  // Purple (Users)
//         ],
//         borderColor: [
//           "rgb(34, 197, 94)",
//           "rgb(59, 130, 246)",
//           "rgb(99, 102, 241)",
//           "rgb(245, 158, 11)",
//           "rgb(168, 85, 247)",
//         ],
//         borderWidth: 1,
//         borderRadius: 6,
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: { display: false }, // Hide legend as bars are self-explanatory
//       tooltip: {
//         callbacks: {
//           label: function (tooltipItem) {
//             if (tooltipItem.label === "Earnings") {
//               return `Total Revenue: $${tooltipItem.raw.toLocaleString()}`;
//             }
//             return `${tooltipItem.label}: ${tooltipItem.raw.toLocaleString()}`;
//           },
//         },
//       },
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//         grid: { color: "rgba(0, 0, 0, 0.05)" },
//       },
//       x: { grid: { display: false } },
//     },
//   };

  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm">Overview of the entire platform's performance.</p>
      </header>

      {/* Admin Stats Grid */}
      <AdminStats stats={stats} />

      {/* Visual Chart Representation */}
      {/* <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold mb-6 text-gray-700">Platform Growth Analysis</h2>
        <div style={{ height: "400px" }}>
          <Bar data={data} options={options} />
        </div>
      </div> */}
      <AdminStatsChart stats={stats} />
    </div>
  );
};

export default AdminDMain;