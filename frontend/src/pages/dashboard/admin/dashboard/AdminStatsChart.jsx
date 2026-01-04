import React, { useState } from 'react';
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Loading from '../../../../components/Loading';
import ErrorComponent from '../../../../components/ErrorComponent';
import NoData from '../../../../components/NoData';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartDataLabels
);

const AdminStatsChart = ({ stats, isLoading, error }) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  if (isLoading) return <Loading />;
  if (error) return <ErrorComponent />;

  const isData = stats;
  if(!isData) return <NoData />

  // 1. Prepare Pie Chart Data
  const pieData = {
    labels: ["Orders", "Products", "Reviews", "Users"],
    datasets: [{
      data: [
        stats?.totalOrders || 0, 
        stats?.totalProducts || 0,
        stats?.totalReviews || 0, 
        stats?.totalUsers || 0
      ],
      backgroundColor: ["#3b82f6", "#6366f1", "#f59e0b", "#a855f7"],
      hoverOffset: 15,
      borderWidth: 2,
      borderColor: '#fff',
    }]
  };

  // 2. Prepare Dynamic Line Chart Data
  const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const earningsArray = new Array(12).fill(0);
  
  // Filter by year if your data includes a 'year' property
  const filteredEarnings = stats?.monthlyEarnings?.filter(entry => 
    entry.year ? entry.year === parseInt(selectedYear) : true
  );

  filteredEarnings?.forEach((entry) => {
    if (entry.month >= 1 && entry.month <= 12) {
      earningsArray[entry.month - 1] = entry.earnings;
    }
  });

  const lineChartData = {
    labels,
    datasets: [{
      label: `${selectedYear} Revenue`,
      data: earningsArray,
      fill: true,
      backgroundColor: "rgba(34, 197, 94, 0.1)",
      borderColor: "#22c55e",
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: "#22c55e",
    }]
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'bottom', 
        labels: { boxWidth: 10, padding: 20, font: { size: 12, weight: '500' }, usePointStyle: true } 
      },
      datalabels: { display: false } 
    }
  };

  return (
    <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Monthly Earnings Graph */}
      <div className="bg-white p-5 sm:p-8 rounded-3xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Revenue Growth</h2>
            <p className="text-sm text-gray-500 font-medium">Tracking earnings over time</p>
          </div>
          
          {/* Year Selector Dropdown */}
          <select 
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block p-2.5 outline-none"
          >
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
          </select>
        </div>

        <div className="h-[300px]">
          <Line 
            data={lineChartData} 
            options={{
              ...commonOptions,
              scales: {
                y: { 
                  beginAtZero: true, 
                  grid: { color: "#f9fafb" },
                  ticks: { callback: (val) => `$${val.toLocaleString()}` }
                },
                x: { grid: { display: false } }
              }
            }} 
          />
        </div>
      </div>

      {/* Distribution Pie Chart */}
      <div className="bg-white p-5 sm:p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800">Platform Distribution</h2>
          <p className="text-sm text-gray-500 font-medium">Activity across segments</p>
        </div>
        <div className="h-[300px] flex justify-center">
          <Pie data={pieData} options={commonOptions} />
        </div>
      </div>

    </div>
  );
};

export default AdminStatsChart;