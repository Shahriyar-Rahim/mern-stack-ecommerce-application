import React from "react";
import { useSelector } from "react-redux";
import { useGetUserStatsQuery } from "../../../../redux/features/stats/statsApi";
import Loading from "../../../../components/Loading";
import ErrorComponent from "../../../../components/ErrorComponent";
import UserStats from "./UserStats";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import NoData from "../../../../components/NoData";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const UserDMain = () => {
  const { user } = useSelector((state) => state.auth);
  const { data: UserData, isLoading, error } = useGetUserStatsQuery(user?.email);

  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    return <ErrorComponent />;
  }

  const stats = UserData?.data || {};
  const { totalPayments, totalPurchasedProducts, totalReviews } = stats;

  if(stats === null) return <NoData />

  // Chart Data Configuration
  const data = {
    labels: ["Total Payments", "Total Purchased Products", "Total Reviews"],
    datasets: [
      {
        label: "User Activities",
        data: [totalPayments, totalPurchasedProducts, totalReviews],
        // Array of colors for a modern, distinct look
        backgroundColor: [
          "rgba(54, 162, 235, 0.7)", // Soft Blue
          "rgba(75, 192, 192, 0.7)", // Teal
          "rgba(153, 102, 255, 0.7)", // Purple
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
        borderRadius: 4, // Smoother bar edges
        hoverBackgroundColor: [
          "rgba(54, 162, 235, 0.9)",
          "rgba(75, 192, 192, 0.9)",
          "rgba(153, 102, 255, 0.9)",
        ],
      },
    ],
  };

  // Chart Options Configuration
  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allows the chart to fill the container height
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            if (tooltipItem.label === "Total Payments") {
              return `Total Payments: $${tooltipItem.raw.toFixed(2)}`;
            }
            return `${tooltipItem.label}: ${tooltipItem.raw}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          drawBorder: false,
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Your Dashboard</h1>
        <p className="text-gray-500 text-sm">Welcome back! Here is an overview of your activity.</p>
      </header>

      {/* Numerical Stats Summary */}
      <UserStats stats={stats} />

      {/* Visual Data Representation */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-lg font-medium mb-4 text-gray-700">Activity Overview</h2>
        <div style={{ height: "400px" }}>
          <Bar data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default UserDMain;