"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './button';
import { Loader2 } from 'lucide-react';

export default function BuyCreditsButton({ className = "", variant = "default" }) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!user);
  }, []);

  const handleBuy = async () => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Create order on your backend
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 499, // ₹499 for 10 credits
          currency: 'INR',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const order = await response.json();

      // Load Razorpay script
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: order.currency,
          name: 'AI Room Designer',
          description: '10 Design Credits',
          order_id: order.id,
          handler: async (response) => {
            try {
              // Verify payment on backend
              const verifyResponse = await fetch('/api/verify-payment', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              });

              if (!verifyResponse.ok) {
                throw new Error('Payment verification failed');
              }

              // Update user credits
              const user = JSON.parse(localStorage.getItem('user'));
              user.credits = (user.credits || 0) + 10;
              localStorage.setItem('user', JSON.stringify(user));

              // Show success message
              alert('Payment successful! 10 credits added to your account.');
              
              // Refresh the page to update credits display
              window.location.reload();
            } catch (error) {
              console.error('Payment verification error:', error);
              setError('Payment verification failed. Please contact support.');
            }
          },
          prefill: {
            name: JSON.parse(localStorage.getItem('user'))?.name || '',
            email: JSON.parse(localStorage.getItem('user'))?.email || '',
          },
          theme: {
            color: '#22d3ee',
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      };

      script.onerror = () => {
        setError('Failed to load payment gateway. Please try again.');
      };
    } catch (error) {
      console.error('Payment error:', error);
      setError('Failed to start payment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <Button 
        onClick={handleBuy} 
        disabled={isLoading}
        className={`${className} relative`}
        variant={variant}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          'Buy 10 Credits - ₹499'
        )}
      </Button>
      
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
} 