import React from 'react';
import { AlertCircle, ArrowLeft, RefreshCcw } from "lucide-react";

const ErrorComponent = ({ 
  title = "Something went wrong", 
  message = "We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.",
  onRetry 
}) => {
  return (
    <div className="min-h-[400px] w-full flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
      {/* Icon Container */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-red-100 rounded-full blur-2xl opacity-50 animate-pulse"></div>
        <div className="relative bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <AlertCircle className="w-12 h-12 text-red-500" />
        </div>
      </div>

      {/* Text Content */}
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        {title}
      </h2>
      <p className="text-gray-500 max-w-md leading-relaxed mb-8">
        {message}
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => window.history.back()}
          className="flex items-center justify-center px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </button>
        
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center justify-center px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95"
          >
            <RefreshCcw className="w-4 h-4 mr-2" />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorComponent;