import React, { useEffect, useState } from 'react';
import { getBaseUrl } from '../../utils/getBaseUrl';
import axios from 'axios';
import Loading from '../../components/Loading';
import TimelineStep from '../../components/TimelineStep';
import confetti from 'canvas-confetti';

const steps = [
    {
        status: 'pending',
        label: 'Pending',
        description: 'Your order has been created and is awaiting processing.',
        icon: { iconName: 'edit-2-line', bgColor: 'red-500', textColor: 'gray-800' },
    },
    {
        status: 'processing',
        label: 'Processing',
        description: 'We are currently preparing your items.',
        icon: { iconName: 'loader-2-line', bgColor: 'blue-500', textColor: 'white' },
    },
    {
        status: 'shipped',
        label: 'Shipped',
        description: 'Your order has been shipped.',
        icon: { iconName: 'truck-line', bgColor: 'blue-800', textColor: 'blue-100' },
    },
    {
        status: 'completed',
        label: 'Completed',
        description: 'Your order has been successfully completed.',
        icon: { iconName: 'check-line', bgColor: 'green-800', textColor: 'white' },
    },
];

const PaymentSuccess = () => {
    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isCopied, setIsCopied] = useState(false);

    // Shortened Confetti Celebration (1.5 Seconds)
    const fireConfetti = () => {
        const duration = 1.5 * 1000; 
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);

            const particleCount = 40 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
    };

    const handleCopy = (text) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const sessionId = query.get("session_id");
        if (sessionId) {
            const confirmPayment = async () => {
                try {
                    const response = await axios.post(`${getBaseUrl()}/api/orders/confirm-payment`, {
                        session_id: sessionId
                    }, {
                        headers: { "Content-Type": "application/json" }
                    });

                    if (response?.data) {
                        setOrder(response?.data.data);
                        setIsLoading(false);
                        fireConfetti();
                    }
                } catch (err) {
                    console.error(err);
                    setIsLoading(false);
                }
            };
            confirmPayment();
        }
    }, []);

    if (isLoading) return <Loading />;

    const isCompleted = (status) => {
        const statuses = ['pending', 'processing', 'shipped', 'completed'];
        const orderStatusIndex = statuses.indexOf(order?.status);
        const stepStatusIndex = statuses.indexOf(status);
        return stepStatusIndex < orderStatusIndex;
    };
    
    const isCurrent = (status) => order?.status === status;

    return (
        <div className='section__container bg-gray-50/50 py-6 md:py-12 px-4 flex justify-center'>
            <style>{`
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-slide-up { animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .stagger-1 { animation-delay: 0.1s; opacity: 0; }
                .stagger-2 { animation-delay: 0.2s; opacity: 0; }
                .stagger-3 { animation-delay: 0.3s; opacity: 0; }
            `}</style>

            <div className=' w-full bg-white rounded-4xl md:rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-6 md:p-12 lg:p-20 border border-white animate-slide-up overflow-hidden'>
                
                {/* Header Section */}
                <div className='text-center mb-12 md:mb-20 stagger-1 animate-slide-up'>
                    <div className='relative inline-flex mb-8'>
                        <div className='absolute inset-0 bg-green-400 blur-3xl opacity-20 animate-pulse'></div>
                        <div className='relative z-10 flex items-center justify-center w-20 h-20 md:w-28 md:h-28 bg-green-500 text-white rounded-3xl md:rounded-4xl rotate-12 shadow-xl'>
                            <i className="ri-check-double-line text-4xl md:text-6xl"></i>
                        </div>
                    </div>
                    
                    <h2 className='text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tighter'>
                        Order <span className='text-green-500 capitalize'>{order?.status}!</span>
                    </h2>
                    <p className='text-lg md:text-2xl text-gray-400 font-medium max-w-2xl mx-auto'>
                        Payment confirmed! Your items are now being prepared for shipment.
                    </p>
                </div>

                {/* Details Grid */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-12 md:mb-20 stagger-2 animate-slide-up'>
                    
                    {/* Order ID Card with Copy Logic */}
                    <div className='group p-6 md:p-10 bg-gray-50/30 rounded-4xl border border-gray-100 hover:bg-white hover:shadow-2xl transition-all duration-500'>
                        <div className='flex items-center justify-between mb-4'>
                            <div className='flex items-center gap-3'>
                                <div className='w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center'>
                                    <i className="ri-hashtag text-xl"></i>
                                </div>
                                <p className='text-xs uppercase tracking-widest text-gray-400 font-bold'>Order ID</p>
                            </div>
                            <button 
                                onClick={() => handleCopy(order?.orderId)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                    isCopied ? 'bg-green-500 text-white' : 'bg-white text-blue-600 border border-blue-100 hover:bg-blue-50'
                                }`}
                            >
                                <i className={isCopied ? "ri-check-line" : "ri-file-copy-line"}></i>
                                {isCopied ? "Copied" : "Copy"}
                            </button>
                        </div>
                        <p className='text-lg md:text-xl font-mono font-black text-gray-800 break-all'>{order?.orderId.slice(-8)}</p>
                    </div>

                    <div className='group p-6 md:p-10 bg-gray-50/30 rounded-4xl border border-gray-100 hover:bg-white hover:shadow-2xl transition-all duration-500'>
                        <div className='flex items-center gap-3 mb-4'>
                            <div className='w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center'>
                                <i className="ri-bank-card-line text-xl"></i>
                            </div>
                            <p className='text-xs uppercase tracking-widest text-gray-400 font-bold'>Status</p>
                        </div>
                        <p className='text-xl font-black text-gray-800 capitalize'>{order?.status}</p>
                    </div>

                    <div className='group p-6 md:p-10 bg-gray-50/30 rounded-4xl border border-gray-100 hover:bg-white hover:shadow-2xl transition-all duration-500 lg:col-span-1 md:col-span-2'>
                        <div className='flex items-center gap-3 mb-4'>
                            <div className='w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center'>
                                <i className="ri-calendar-line text-xl"></i>
                            </div>
                            <p className='text-xs uppercase tracking-widest text-gray-400 font-bold'>Order Date</p>
                        </div>
                        <p className='text-xl font-black text-gray-800'>
                            {order?.updatedAt ? new Date(order.updatedAt).toLocaleDateString() : 'Today'}
                        </p>
                    </div>
                </div>

                {/* Timeline Tracking */}
                <div className='stagger-3 animate-slide-up bg-gray-50/30 p-6 md:p-12 rounded-4xl md:rounded-[3rem] border border-gray-100'>
                    <div className='flex flex-col md:flex-row items-center justify-between mb-12 gap-4'>
                        <h3 className='text-2xl md:text-3xl font-black text-gray-900 tracking-tight'>Tracking Detail</h3>
                        <span className='px-5 py-2 bg-blue-50 text-blue-600 text-xs font-bold rounded-full animate-pulse'>LIVE UPDATES</span>
                    </div>
                    
                    <ol className='flex flex-col sm:flex-row w-full justify-between items-stretch sm:items-start gap-0'>
                        {steps.map((step, index) => (
                            <TimelineStep 
                                key={index} 
                                step={step}
                                order={order}
                                isCompleted={isCompleted(step?.status)}
                                isCurrent={isCurrent(step?.status)}
                                isLastStep={index === steps?.length - 1}
                                icon={step.icon}
                                description={step.description}
                            />
                        ))}
                    </ol>
                </div>

                {/* Footer Actions */}
                <div className='mt-12 md:mt-20 flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 stagger-3 animate-slide-up'>
                    <button 
                        onClick={() => window.location.href = '/'}
                        className='w-full sm:w-auto px-12 py-5 bg-gray-900 text-white text-lg font-bold rounded-2xl hover:bg-blue-600 transition-all duration-500 transform hover:-translate-y-1'
                    >
                        Continue Shopping
                    </button>
                    <button 
                        onClick={() => window.location.href = '/dashboard/orders'}
                        className='w-full sm:w-auto px-12 py-5 bg-white text-gray-900 text-lg border-2 border-gray-100 font-bold rounded-2xl hover:border-gray-900 transition-all duration-500'
                    >
                        View Orders
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;