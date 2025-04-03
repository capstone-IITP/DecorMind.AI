'use client';

import { useEffect, useState } from 'react';
import { Button } from '../../components/ui/button';
import Script from 'next/script';

const PaymentButton = ({ amount = 500, buttonText = 'Pay Now', className = '', onSuccess }) => {
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Check if Razorpay is already loaded
    if (window.Razorpay) {
      setIsRazorpayLoaded(true);
    }
  }, []);

  const handleRazorpayLoad = () => {
    setIsRazorpayLoaded(true);
  };

  const handlePayment = async () => {
    if (!isRazorpayLoaded) {
      alert('Razorpay is still loading. Please try again in a moment.');
      return;
    }

    try {
      setIsProcessing(true);
      
      // Create order on the server
      const res = await fetch("/api/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          amount: Math.max(100, Math.round(amount)) // Ensure minimum 1 INR (100 paise) and round to integer
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create payment order');
      }

      const data = await res.json();

      // Configure Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: "INR",
        name: "Decormind AI",
        description: "Interior Design AI Image",
        order_id: data.id,
        handler: function (response) {
          // Handle successful payment
          setIsProcessing(false);
          
          // Call the success callback if provided
          if (onSuccess && typeof onSuccess === 'function') {
            onSuccess(response);
          } else {
            alert("Payment Successful!");
            console.log(response);
          }
        },
        prefill: {
          name: "User Name",
          email: "user@example.com",
          contact: "9999999999",
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          }
        },
        notes: {
          address: "Decormind AI Headquarters"
        },
        theme: {
          color: "#22d3ee" // Cyan color to match the site theme
        }
      };

      // Initialize Razorpay
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert(`Payment initialization failed: ${error.message}`);
      setIsProcessing(false);
    }
  };

  return (
    <>
      {/* Load Razorpay script */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={handleRazorpayLoad}
        strategy="lazyOnload"
      />
      
      <Button
        onClick={handlePayment}
        disabled={isProcessing || !isRazorpayLoaded}
        className={`${className} ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {isProcessing ? 'Processing...' : buttonText}
      </Button>
    </>
  );
};

export default PaymentButton;