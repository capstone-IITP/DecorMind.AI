'use client';

import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import PaymentButton from '../app/_components/PaymentButton';

/**
 * PricingPlans Component
 * Displays pricing options and handles plan selection
 */
const PricingPlans = ({ 
  userPlan = {
    plan: "premium", // "free" | "premium" | "pro"
    expiry: "2025-04-06T12:00:00Z"
  }, 
  onUpgrade,
  showHeader = true
}) => {
  // Check if plan is expired
  const now = new Date();
  const isExpired = userPlan?.expiry ? new Date(userPlan.expiry) < now : false;
  
  // Determine current plan status
  const isFree = !userPlan?.plan || userPlan?.plan === "free";
  const isFreeExpired = isFree && isExpired;
  const isPremium = userPlan?.plan === "premium" && !isExpired;
  const isPro = userPlan?.plan === "pro" && !isExpired;

  const plans = [
    {
      name: "Free",
      price: "₹0.00",
      features: ["2 AI Design Generations", "Basic Room Styles", "Community Support"],
      planKey: "free",
    },
    {
      name: "Premium",
      price: "₹1",
      features: ["10 AI Design Generations", "All Room Styles", "High-Quality Generations", "Email Support"],
      planKey: "premium",
    },
    {
      name: "Pro",
      price: "₹835.00 /month",
      features: ["Unlimited AI Designs", "Premium Styles & Features", "4K Resolution", "Priority Support", "Commercial License"],
      planKey: "pro",
    },
  ];

  // Handle selecting free plan
  const handleSelectFree = () => {
    if (onUpgrade) {
      onUpgrade('free');
    }
  };

  // Handle plan purchases
  const handleBuyPremium = () => {
    // This will be handled by PaymentButton's onSuccess callback
    console.log('Premium plan selected');
  };

  const handleBuyPro = () => {
    // This will be handled by PaymentButton's onSuccess callback
    console.log('Pro plan selected');
  };

  // Handle payment success
  const handlePaymentSuccess = (plan, response) => {
    if (onUpgrade) {
      onUpgrade(plan, response);
    }
  };

  return (
    <div className="w-full">
      {showHeader && (
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#1e3a5c] via-[#22d3ee] to-[#4ade80] text-transparent bg-clip-text">
            Choose Your Plan
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Unlock the full potential of AI-powered interior design with our premium plans. Choose the plan that suits your needs.
          </p>
          {isExpired && userPlan?.plan && (
            <div className="mt-4 p-3 bg-red-900/30 text-red-200 rounded-lg inline-block">
              Your {userPlan.plan} plan has expired. Please renew to continue enjoying premium features.
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Free Plan */}
        <div className={`rounded-xl p-6 bg-zinc-900 text-white shadow-md ${isFree && !isExpired ? "border-2 border-cyan-400" : ""}`}>
          <h2 className="text-2xl font-bold">{plans[0].name}</h2>
          <p className="text-xl mt-2">{plans[0].price}</p>
          <ul className="mt-4 space-y-2">
            {plans[0].features.map((feature, i) => (
              <li key={i} className="flex items-center gap-2">
                ✅ {feature}
              </li>
            ))}
          </ul>
          
          <button
            disabled={!isFree && !isFreeExpired}
            onClick={handleSelectFree}
            className={`mt-6 w-full ${isFree && !isExpired ? "bg-gray-700" : "bg-cyan-400 hover:bg-cyan-500"} ${!isFree && !isFreeExpired ? "opacity-50 cursor-not-allowed" : ""} text-${isFree && !isExpired ? "white" : "black"} py-2 rounded-lg`}
          >
            {isFree && !isExpired ? "Current Plan" : "Select Free Plan"}
          </button>
        </div>

        {/* Premium Plan */}
        <div className={`rounded-xl p-6 bg-zinc-900 text-white shadow-md ${isPremium ? "border-2 border-cyan-400" : ""}`}>
          <h2 className="text-2xl font-bold">{plans[1].name}</h2>
          <p className="text-xl mt-2">{plans[1].price}</p>
          <ul className="mt-4 space-y-2">
            {plans[1].features.map((feature, i) => (
              <li key={i} className="flex items-center gap-2">
                ✅ {feature}
              </li>
            ))}
          </ul>
          
          {isPremium ? (
            <button
              disabled
              className="mt-6 w-full bg-gray-700 text-white py-2 rounded-lg cursor-not-allowed"
            >
              Current Plan
            </button>
          ) : (
            <PaymentButton
              amount={100} // 1 INR in paise
              buttonText="Buy Premium for ₹1"
              className="mt-6 w-full bg-cyan-400 hover:bg-cyan-500 text-black py-2 rounded-lg"
              onSuccess={(response) => handlePaymentSuccess('premium', response)}
            />
          )}
        </div>

        {/* Pro Plan */}
        <div className={`rounded-xl p-6 bg-zinc-900 text-white shadow-md ${isPro ? "border-2 border-cyan-400" : ""}`}>
          <h2 className="text-2xl font-bold">{plans[2].name}</h2>
          <p className="text-xl mt-2">{plans[2].price}</p>
          <ul className="mt-4 space-y-2">
            {plans[2].features.map((feature, i) => (
              <li key={i} className="flex items-center gap-2">
                ✅ {feature}
              </li>
            ))}
          </ul>
          
          {isPro ? (
            <button
              disabled
              className="mt-6 w-full bg-gray-700 text-white py-2 rounded-lg cursor-not-allowed"
            >
              Current Plan
            </button>
          ) : (
            <PaymentButton
              amount={83500} // 835 INR in paise
              buttonText="Buy Pro for ₹835"
              className="mt-6 w-full bg-cyan-400 hover:bg-cyan-500 text-black py-2 rounded-lg"
              onSuccess={(response) => handlePaymentSuccess('pro', response)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PricingPlans; 