import React from 'react';

const NoData = ({ 
  title = "No Data Available", 
  message = "We couldn't find any information for this period. Try changing your filters or check back later." 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-3xl border-2 border-dashed border-gray-100 min-h-[300px] text-center transition-all duration-300 ease-in-out">
      {/* Visual Icon Container */}
      <div className="relative mb-6">
        {/* Soft Background Glow */}
        <div className="absolute inset-0 bg-blue-100 rounded-full blur-2xl opacity-40 transform scale-150"></div>
        
        {/* Icon */}
        <div className="relative bg-white p-4 rounded-2xl shadow-sm border border-gray-50">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            ></path>
          </svg>
        </div>
      </div>

      {/* Text Section */}
      <div className="max-w-xs">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 leading-relaxed font-medium">
          {message}
        </p>
      </div>

      {/* Subtle Bottom Decoration */}
      <div className="mt-8 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-gray-200"></span>
        <span className="w-1.5 h-1.5 rounded-full bg-gray-100"></span>
        <span className="w-1.5 h-1.5 rounded-full bg-gray-50"></span>
      </div>
    </div>
  );
};

export default NoData;