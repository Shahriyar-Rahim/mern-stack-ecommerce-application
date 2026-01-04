import React from "react";

const TimelineStep = ({
  step,
  order,
  isCompleted,
  isCurrent,
  icon,
  description,
  isLastStep,
}) => {
  const isActuallyFailed = order?.status === 'failed';

  // --- Dynamic Style Logic ---
  const iconBgColor = isCompleted || isCurrent ? `bg-${icon?.bgColor}` : "bg-gray-100";
  const iconTextColor = isCompleted || isCurrent ? "text-white" : ''; //`text-${icon?.textColor}`
  
  const connectorColor = isActuallyFailed && (isCurrent || isCompleted) 
    ? "bg-red-500" 
    : isCompleted ? `bg-${icon?.bgColor}` : "bg-gray-200";

  const labelTextColor = isCompleted || isCurrent ? "text-gray-900" : "text-gray-400";

  const formatFullDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleString([], { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="w-full group">
      <style>{`
        @keyframes active-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-active-bounce {
          animation: active-bounce 1.5s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>

      <li className="relative flex flex-row items-start mb-8 sm:block sm:mb-0 sm:flex-1">
        <div className="flex flex-col items-center sm:flex-row w-full">
          
          {/* Icon Box with Dynamic Bounce */}
          <div
            className={`
              relative z-20 flex items-center justify-center 
              w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl shrink-0
              transition-all duration-500 shadow-md sm:shadow-lg
              ${iconBgColor} ${iconTextColor}
              ${isCurrent ? "animate-active-bounce ring-4 ring-opacity-30" : "scale-100"}
              ${isCurrent && !isActuallyFailed ? "ring-blue-100" : isActuallyFailed ? "ring-red-100" : ""}
            `}
          >
            {/* The icon itself spins if it's the processing step */}
            <i className={`
                ri-${icon?.iconName} text-lg sm:text-2xl 
                ${isCurrent && step.status === 'processing' && !isActuallyFailed ? 'animate-spin-slow' : ''}
            `}></i>
          </div>

          {!isLastStep && (
            <>
              {/* Connector Lines */}
              <div className="hidden sm:block flex-1 h-1 mx-2 rounded-full overflow-hidden bg-gray-100">
                <div className={`h-full transition-all duration-1000 ${connectorColor} ${isCompleted ? 'w-full' : 'w-0'}`}></div>
              </div>
              <div className="sm:hidden absolute left-5 top-10 -z-10 w-0.5 h-full bg-gray-100">
                <div className={`w-full transition-all duration-1000 ${connectorColor} ${isCompleted ? 'h-full' : 'h-0'}`}></div>
              </div>
            </>
          )}
        </div>

        {/* Text Content */}
        <div className="mt-0 ml-5 sm:mt-6 sm:ml-0 sm:pr-4">
          <div className="flex items-center gap-1.5">
            <h3 className={`font-black text-sm sm:text-lg tracking-tight ${labelTextColor}`}>
              {step?.label}
            </h3>
            
            {/* Live Ping Dot */}
            {isCurrent && (
              <span className="flex h-2 w-2 relative">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isActuallyFailed ? 'bg-red-400' : 'bg-blue-400'} opacity-75`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isActuallyFailed ? 'bg-red-500' : 'bg-blue-500'}`}></span>
              </span>
            )}
          </div>

          <time className="block text-[10px] sm:text-xs font-bold text-gray-400 uppercase mb-1">
            {formatFullDate(order?.updatedAt)}
          </time>

          <p className={`text-[12px] sm:text-sm leading-tight ${isCurrent ? 'font-bold text-gray-900' : 'text-gray-500 opacity-80'}`}>
            {description}
          </p>
        </div>
      </li>
    </div>
  );
};

export default TimelineStep;