import React from 'react';

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] space-y-4">
      <div className="relative w-16 h-16">
        {/* Outer Ring */}
        <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
        
        {/* Spinning Orbits */}
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute inset-0 animate-spin"
            style={{
              animationDuration: `${1.5 + i * 0.2}s`,
              animationDirection: i % 2 === 0 ? 'normal' : 'reverse',
            }}
          >
            <div 
              className={`h-3 w-3 rounded-full bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.8)] 
              ${i === 1 ? 'bg-purple-500' : i === 2 ? 'bg-cyan-400' : ''}`}
              style={{
                transform: `translateX(${24 + i * 4}px)`,
              }}
            />
          </div>
        ))}
      </div>
      
      {/* Loading Text */}
      <p className="text-sm font-medium text-slate-500 animate-pulse tracking-widest uppercase">
        Loading...
      </p>
    </div>
  );
};

export default Loading;