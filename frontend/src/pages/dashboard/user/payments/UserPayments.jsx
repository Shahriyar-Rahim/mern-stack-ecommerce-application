import React from 'react'
import { useSelector } from 'react-redux'
import { useGetOrderbyEmailQuery } from '../../../../redux/features/orders/orderApi';
import Loading from '../../../../components/Loading';
import ErrorComponent from '../../../../components/ErrorComponent';
import NoData from '../../../../components/NoData';

const UserPayments = () => {
    const {user} = useSelector((state) => state.auth);
    const {data, isLoading, error} = useGetOrderbyEmailQuery(user?.email);
    
    if(isLoading) return <Loading />
    if(error) return <ErrorComponent />
    if(!data) return <NoData />
    const orders = data?.data || [];
    const totalPayment = orders.reduce((acc, order) => acc + order.amount, 0);

  return (
    <div className="py-6 px-4 bg-gray-50/50 min-h-screen">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-slate-800">Payment History</h3>
        <p className="text-sm text-slate-500">Track your transactions and total spending</p>
      </div>

      {/* Modern Total Spent Card */}
      <div className="bg-linear-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 mb-8 shadow-xl shadow-indigo-200/50 text-center transform transition-all hover:scale-[1.02]">
         <p className="text-indigo-100 text-xs font-semibold uppercase tracking-widest mb-1 opacity-80">Total Spent</p>
         <h2 className="text-4xl font-extrabold text-white tracking-tight">
            ${totalPayment ? totalPayment.toLocaleString(undefined, {minimumFractionDigits: 2}) : '0.00'}
         </h2>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <ul className="divide-y divide-gray-100">
          {
           orders && orders.map((item, index) => (
              <li key={index} className="p-5 active:bg-gray-50 transition-colors group">
                {/* Header: Order Name and Amount */}
                <div className="flex justify-between items-start mb-3">
                    <div className="flex flex-col">
                        <h5 className="font-bold text-slate-800 text-base">Order #{index + 1}</h5>
                        <span className="text-[10px] font-mono text-slate-400 mt-0.5 uppercase tracking-tighter">
                            ID: {item._id || item.id}
                        </span>
                    </div>
                    <span className="text-lg font-bold text-indigo-600">${item?.amount.toFixed(2)}</span>
                </div>

                {/* Details Section */}
                <div className="flex flex-col gap-3 mt-4">
                  <div className="flex items-center text-slate-500 text-[13px]">
                    <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {new Date(item?.updatedAt).toLocaleString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                    })}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                            item.status?.toLowerCase() === 'completed' ? 'bg-emerald-500' :
                            item.status?.toLowerCase() === 'pending' ? 'bg-amber-500' :
                            'bg-blue-500'
                        }`}></div>
                        <span className="text-[13px] font-medium text-slate-600">Status</span>
                    </div>
                    
                    <span className={`py-1 px-3 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                        item.status?.toLowerCase() === 'completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                        item.status?.toLowerCase() === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                        item.status?.toLowerCase() === 'processing' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                        'bg-slate-50 text-slate-600 border border-slate-100'}`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              </li>
            ))
          }
        </ul>
        
        {orders.length === 0 && (
            <div className="text-center py-12 px-4">
                <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                </div>
                <p className="text-slate-500 font-medium">No payment history found</p>
                <button className="text-indigo-600 text-sm font-bold mt-2 hover:underline">Start Shopping</button>
            </div>
        )}
      </div>

      {/* Trust Footer */}
      <div className="mt-8 flex flex-col items-center gap-3 opacity-60 grayscale hover:grayscale-0 transition-all">
         <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Secure Payments via</p>
         <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-4" />
      </div>
    </div>
  )
}

export default UserPayments