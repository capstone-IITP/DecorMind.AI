'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function UpgradeModal({ show, onClose, currentPlan = "free" }) {
    const router = useRouter();

    if (!show) return null;

    let upgradeTo = "premium"; // Default upgrade
    let message = "You've used all your free credits! Upgrade to Premium for 10 AI designs.";
    let planDetails = {
        price: "₹1",
        features: "10 designs per month",
        tag: "POPULAR"
    };

    // Customize based on current plan
    if (currentPlan === "premium") {
        upgradeTo = "pro";
        message = "Upgrade to Pro for unlimited AI designs and priority support!";
        planDetails = {
            price: "₹999",
            features: "Unlimited designs + priority support",
            tag: "UNLIMITED"
        };
    }

    const handleUpgrade = () => {
        router.push(`/pricing?plan=${upgradeTo}`);
        onClose();
    };
    
    const handleContinue = () => {
        onClose();
        // Reset the entire design process by simulating a click on start over
        window.location.href = '/redesign';
    };

    return (
        <div className="fixed inset-0 backdrop-blur-md bg-black/60 flex items-center justify-center z-50 p-4 transition-all duration-300 animate-fadeIn">
            <div
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-md w-full shadow-xl animate-scaleIn"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-amber-600/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Out of Credits!</h3>
                    <p className="text-zinc-400 mb-4">
                        {message}
                    </p>
                </div>

                <div className="space-y-3 mb-6">
                    <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700 cursor-pointer hover:border-[#22d3ee] transition-all duration-300 hover:scale-105" onClick={handleUpgrade}>
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="text-lg font-medium text-white">{upgradeTo.charAt(0).toUpperCase() + upgradeTo.slice(1)} Plan</h4>
                            <span className={`${upgradeTo === 'premium' ? 'bg-gradient-to-r from-[#1e3a5c] to-[#22d3ee]' : 'bg-gradient-to-r from-[#22d3ee] to-[#4ade80]'} text-${upgradeTo === 'premium' ? 'white' : 'black'} text-xs py-1 px-2 rounded-full`}>
                                {planDetails.tag}
                            </span>
                        </div>
                        <p className="text-zinc-400 text-sm mb-2">{planDetails.features}</p>
                        <div className="flex items-baseline">
                            <span className="text-xl font-bold text-white">{planDetails.price}</span>
                            <span className="text-zinc-500 text-xs ml-1">/month</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={handleContinue}
                        className="py-2 px-4 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"
                    >
                        Continue with {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}
                    </button>
                    <button
                        onClick={handleUpgrade}
                        className="py-2 px-4 rounded-lg bg-gradient-to-r from-[#1e3a5c] via-[#22d3ee] to-[#4ade80] text-white hover:opacity-90 transition-all"
                    >
                        Upgrade to {upgradeTo.toUpperCase()}
                    </button>
                </div>
            </div>

            <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from { 
            opacity: 0;
            transform: scale(0.9);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.4s ease-out forwards;
        }
      `}</style>
        </div>
    );
} 