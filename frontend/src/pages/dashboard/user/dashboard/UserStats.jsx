// const UserStats = ({stats}) => {
//   return (
//     <div className='my-5 space-y-4 '>
//         <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
//             <div className='bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:border-primary cursor-pointer hover:scale-105 transition-all duration-200'>
//                 <h2 className='text-lg font-semibold mb-2'>Total Payments</h2>
//                 <p className='text-2xl font-bold'>{stats?.totalPayments}</p>
//             </div>
//             <div className='bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:border-primary cursor-pointer hover:scale-105 transition-all duration-200'>
//                 <h2 className='text-lg font-semibold mb-2'>Total Reviews</h2>
//                 <p className='text-2xl font-bold'>{stats?.totalReviews}</p>
//             </div>
//             <div className='bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:border-primary cursor-pointer hover:scale-105 transition-all duration-200'>
//                 <h2 className='text-lg font-semibold mb-2'>Total Purchased Products</h2>
//                 <p className='text-2xl font-bold'>{stats?.totalPurchasedProducts}</p>
//             </div>
//         </div>
//     </div>
//   )
// }
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Star, ShoppingBag, ArrowUpRight, ArrowDownRight, X, Clock, TrendingUp } from 'lucide-react';

const UserStats = ({ stats, previousStats, isLoading }) => {
  const [selectedStat, setSelectedStat] = useState(null);

  const calculateTrend = (current, previous) => {
    if (!previous || previous === 0) return { percent: 0, isPositive: true };
    const diff = ((current - previous) / previous) * 100;
    return { percent: Math.abs(diff).toFixed(1), isPositive: diff >= 0 };
  };

  const statConfigs = [
    {
      key: 'totalPayments',
      label: 'Total Revenue',
      icon: CreditCard,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'hover:border-indigo-200',
      isCurrency: true
    },
    {
      key: 'totalReviews',
      label: 'Your Reviews',
      icon: Star,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'hover:border-amber-200',
    },
    {
      key: 'totalPurchasedProducts',
      label: 'Orders Placed',
      icon: ShoppingBag,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'hover:border-emerald-200',
    },
  ];

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  if (isLoading) {
    return (
      <div className='my-6 grid grid-cols-1 md:grid-cols-3 gap-6'>
        {[1, 2, 3].map((i) => (
          <div key={i} className='h-32 bg-gray-100 animate-pulse rounded-2xl' />
        ))}
      </div>
    );
  }

  return (
    <div className='my-6'>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className='flex md:grid overflow-x-auto md:overflow-x-visible pb-6 md:pb-0 gap-6 md:grid-cols-3 snap-x snap-mandatory no-scrollbar'
      >
        {statConfigs.map((config) => {
          const currentVal = stats?.[config.key] || 0;
          const prevVal = previousStats?.[config.key] || 0;
          const trend = calculateTrend(currentVal, prevVal);

          return (
            <motion.div 
              key={config.key}
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedStat({ ...config, currentVal, trend })}
              className={`min-w-[85%] md:min-w-0 snap-center bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl ${config.borderColor} cursor-pointer transition-all duration-300 relative overflow-hidden group`}
            >
              {/* Decorative Background Icon */}
              <config.icon className={`absolute -right-4 -bottom-4 size-24 opacity-[0.03] group-hover:scale-110 transition-transform duration-500 ${config.color}`} />

              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={`p-2 rounded-lg ${config.bgColor} ${config.color}`}>
                   <config.icon size={20} />
                </div>
                
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold ${
                  trend.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                }`}>
                  {trend.isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {trend.percent}%
                </div>
              </div>

              <div className="relative z-10">
                <p className='text-sm font-medium text-gray-500 mb-1'>{config.label}</p>
                <p className='text-3xl font-bold text-gray-900 tracking-tight'>
                  {config.isCurrency && '$'}{currentVal.toLocaleString()}
                </p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="flex items-center gap-2 mt-4 text-gray-400 text-[11px] uppercase tracking-widest font-semibold px-1">
        <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span>Live System Status</span>
      </div>

      {/* --- REFINED MODAL --- */}
      <AnimatePresence>
        {selectedStat && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedStat(null)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="relative w-full max-w-sm bg-white rounded-4xl shadow-2xl overflow-hidden"
            >
              <div className={`h-2 w-full ${selectedStat.bgColor.replace('bg-', 'bg-')}`} />
              
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <div className={`p-4 rounded-2xl ${selectedStat.bgColor} ${selectedStat.color} shadow-inner`}>
                    <selectedStat.icon size={32} />
                  </div>
                  <button onClick={() => setSelectedStat(null)} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
                    <X size={20} />
                  </button>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedStat.label}</h3>
                <p className="text-gray-500 leading-relaxed mb-8">Performance analysis for the current billing cycle.</p>

                <div className="space-y-4">
                  <div className="flex justify-between items-end p-4 bg-gray-50 rounded-2xl">
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Current Balance</p>
                      <p className="text-3xl font-black text-gray-900">
                        {selectedStat.isCurrency && '$'}{selectedStat.currentVal.toLocaleString()}
                      </p>
                    </div>
                    <div className={`flex items-center gap-1 font-bold ${selectedStat.trend.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                       <TrendingUp size={16} />
                       {selectedStat.trend.percent}%
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedStat(null)}
                  className="w-full mt-8 py-4 bg-gray-900 text-white rounded-2xl font-bold shadow-lg shadow-gray-200 active:scale-[0.98] transition-all"
                >
                  Close Insights
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserStats;