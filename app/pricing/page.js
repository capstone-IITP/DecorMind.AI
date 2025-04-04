'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '../../components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import PaymentButton from '../_components/PaymentButton';

export default function Pricing() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [currency, setCurrency] = useState('INR');
  const [exchangeRates, setExchangeRates] = useState({
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    INR: 83.50,
    CAD: 1.37,
    AUD: 1.52,
    JPY: 150.45
  });
  const [currentPlan, setCurrentPlan] = useState('free');
  const [highlightedPlan, setHighlightedPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  // Function to convert price to selected currency
  const convertPrice = (usdPrice) => {
    const convertedPrice = (usdPrice * exchangeRates[currency]).toFixed(2);
    const currencySymbols = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      INR: '₹',
      CAD: 'C$',
      AUD: 'A$',
      JPY: '¥'
    };
    return `${currencySymbols[currency]}${convertedPrice}`;
  };

  // Load user's current plan on component mount
  useEffect(() => {
    const storedPlan = localStorage.getItem('userPlan') || 'free';
    setCurrentPlan(storedPlan);
    
    // Check if a specific plan is highlighted from URL params
    const planParam = searchParams.get('plan');
    if (planParam && ['premium', 'pro'].includes(planParam)) {
      setHighlightedPlan(planParam);
    }
  }, [searchParams]);

  // Handle plan upgrade
  const handleUpgrade = (plan) => {
    // Don't do anything if clicking on current plan
    if (plan === currentPlan) return;
    
    setLoading(true);
    
    // In a real app, this would connect to a payment gateway
    // For demo purposes, we'll just update localStorage
    setTimeout(() => {
      localStorage.setItem("userPlan", plan);
      localStorage.setItem("usedCredits", "0"); // Reset used credits
      setLoading(false);
      
      // Show success notification and redirect
      alert(`Successfully upgraded to ${plan.toUpperCase()} plan!`);
      router.push("/redesign");
    }, 1000); // Simulate API call
  };

  // Add CSS animations
  useEffect(() => {
    // Set mounted state to true
    setMounted(true);
    
    // Add CSS for animations
    let style;
    if (typeof window !== 'undefined') {
      style = document.createElement('style');
      style.innerHTML = `
        @keyframes highlightSection {
          0% { background-color: rgba(34, 211, 238, 0.1); }
          50% { background-color: rgba(34, 211, 238, 0.2); }
          100% { background-color: transparent; }
        }
        
        .highlight-section {
          animation: highlightSection 1.5s ease-out;
        }

        /* Special animation for contact section */
        @keyframes highlightContactSection {
          0% { background-color: rgba(34, 211, 238, 0.15); }
          50% { background-color: rgba(34, 211, 238, 0.3); }
          100% { background-color: rgba(24, 24, 27, 1); } /* bg-zinc-900 */
        }
        
        #contact.highlight-section {
          animation: highlightContactSection 1.5s ease-out;
        }

        /* Contact form highlight animation */
        @keyframes highlightContactForm {
          0% { box-shadow: 0 0 0 0 rgba(34, 211, 238, 0.3); }
          50% { box-shadow: 0 0 20px 5px rgba(34, 211, 238, 0.5); }
          100% { box-shadow: 0 0 0 0 rgba(34, 211, 238, 0); }
        }
        
        #contact.highlight-section form {
          animation: highlightContactForm 2s ease-out;
        }

        /* Success Popup Styles */
        .success-popup {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          background-color: rgba(0, 0, 0, 0.7);
        }

        .success-popup-content {
          background-color: #18181b;
          border: 2px solid #22d3ee;
          border-radius: 12px;
          padding: 20px 30px;
          text-align: center;
          max-width: 400px;
          animation: popupAppear 0.3s ease-out forwards;
        }

        @keyframes popupAppear {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .success-popup button {
          background-color: #22d3ee;
          color: #000;
          border: none;
          border-radius: 50px;
          padding: 10px 20px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-top: 15px;
        }

        .success-popup button:hover {
          background-color: #0cb8de;
          transform: scale(1.05);
        }
        
        /* Section scroll animation */
        @keyframes sectionFadeIn {
          0% { 
            opacity: 0.7; 
            transform: translateY(20px);
          }
          100% { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .section-fade-in {
          animation: sectionFadeIn 0.8s ease-out forwards;
        }

        /* Heading highlight animation */
        @keyframes headingHighlight {
          0% { 
            background-size: 100% 0%;
          }
          100% { 
            background-size: 100% 100%;
          }
        }
        
        .heading-highlight {
          background-image: linear-gradient(transparent 60%, rgba(34, 211, 238, 0.2) 40%);
          background-size: 100% 0%;
          background-repeat: no-repeat;
          animation: headingHighlight 0.8s ease-out forwards;
        }

        /* Icon animation */
        @keyframes iconPulse {
          0% { 
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(34, 211, 238, 0.7);
          }
          70% { 
            transform: scale(1.1);
            box-shadow: 0 0 0 10px rgba(34, 211, 238, 0);
          }
          100% { 
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(34, 211, 238, 0);
          }
        }
        
        .icon-pulse {
          animation: iconPulse 1.5s ease-out;
        }

        /* Navigation link click animation */
        @keyframes navLinkClick {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        
        .nav-link-clicked {
          animation: navLinkClick 0.3s ease-out;
          color: #22d3ee !important;
        }

        /* Navigation link hover animation */
        .nav-link {
          position: relative;
          transition: all 0.3s ease;
        }
        
        .nav-link::after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: -4px;
          left: 0;
          background-color: #22d3ee;
          transition: width 0.3s ease;
        }
        
        .nav-link:hover::after {
          width: 100%;
        }

        /* Navigation links fade-in animation on page load */
        @keyframes fadeInDown {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .nav-link:nth-child(1) {
          animation: fadeInDown 0.5s ease-out 0.1s forwards;
          opacity: 0;
        }

        .nav-link:nth-child(2) {
          animation: fadeInDown 0.5s ease-out 0.2s forwards;
          opacity: 0;
        }

        .nav-link:nth-child(3) {
          animation: fadeInDown 0.5s ease-out 0.3s forwards;
          opacity: 0;
        }

        .nav-link:nth-child(4) {
          animation: fadeInDown 0.5s ease-out 0.4s forwards;
          opacity: 0;
        }

        .nav-link:nth-child(5) {
          animation: fadeInDown 0.5s ease-out 0.5s forwards;
          opacity: 0;
        }

        /* Navigation bar slide-down animation */
        @keyframes slideDown {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(0);
          }
        }

        .nav-slide-down {
          animation: slideDown 0.5s ease-out forwards;
        }

        /* Global smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
      `;
      document.head.appendChild(style);
    }

    // Function to add animations to a section
    const animateSection = (section) => {
      if (!section) return;
      
      // Add highlight animation to the section
      section.classList.add("highlight-section");
      
      // Add fade-in animation to section elements
      const sectionElements = section.querySelectorAll('h2, h3, h4, p, .grid, .flex');
      sectionElements.forEach((element, index) => {
        // Stagger the animations
        setTimeout(() => {
          element.classList.add('section-fade-in');
          
          // Remove the animation class after it completes
          setTimeout(() => {
            element.classList.remove('section-fade-in');
          }, 800);
        }, index * 100); // Stagger by 100ms
      });
      
      // Add special highlight to headings
      const headings = section.querySelectorAll('h2, h3');
      headings.forEach((heading, index) => {
        setTimeout(() => {
          heading.classList.add('heading-highlight');
          
          // Remove the animation class after some time
          setTimeout(() => {
            heading.classList.remove('heading-highlight');
          }, 2000);
        }, 300 + (index * 150)); // Stagger with delay
      });
      
      // Add pulse animation to icons
      const icons = section.querySelectorAll('.w-10, .w-12, svg');
      icons.forEach((icon, index) => {
        setTimeout(() => {
          icon.classList.add('icon-pulse');
          
          // Remove the animation class after it completes
          setTimeout(() => {
            icon.classList.remove('icon-pulse');
          }, 1500);
        }, 500 + (index * 200)); // Stagger with delay
      });
      
      // Remove the highlight animation after some time
      setTimeout(() => {
        section.classList.remove("highlight-section");
      }, 1500);
    };

    // Function to highlight active section based on scroll position
    const highlightActiveSection = () => {
      // This is a placeholder function since we don't need this functionality on this page
      // But we need to define it to avoid the error when removing the event listener
    };

    // Smooth scroll function with delay animation
    const handleSmoothScroll = (e) => {
      e.preventDefault();
      const href = e.currentTarget.getAttribute("href");
      
      // Add a visual feedback to the clicked link
      if (e.currentTarget.classList && e.currentTarget.classList.add) {
        e.currentTarget.classList.add("nav-link-clicked");
      }
      
      // Delay the scroll action for a better visual effect
      setTimeout(() => {
        // If it's not a hash link, navigate to the page
        if (!href || !href.startsWith("#")) {
          router.push(href);
          return;
        }
        
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          // Special case for top - scroll to top
          if (targetId === 'top') {
            window.scrollTo({
              top: 0,
              behavior: 'smooth'
            });
          } else {
            // Add extra offset for contact section
            const offset = targetId === 'contact' ? 100 : 80;
            
            // Calculate the position to scroll to
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
            
            // Use the native smooth scrolling
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
            
            // Add animations to the target section after scrolling
            setTimeout(() => {
              animateSection(targetElement);
            }, 1000); // Wait for the scroll to complete
          }
        }
        
        // Remove the visual feedback class
        if (e.currentTarget.classList && e.currentTarget.classList.remove) {
          setTimeout(() => {
            e.currentTarget.classList.remove("nav-link-clicked");
          }, 300);
        }
      }, 300); // 300ms delay before scrolling
    };

    // Add event listeners to navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener("click", handleSmoothScroll);
    });

    // Cleanup
    return () => {
      if (style && style.parentNode) {
        document.head.removeChild(style);
      }
      
      // Get all navigation links again for cleanup
      const navLinks = document.querySelectorAll('.nav-link');
      navLinks.forEach(link => {
        link.removeEventListener("click", handleSmoothScroll);
      });
      
      // Remove scroll event listener
      window.removeEventListener('scroll', highlightActiveSection);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#1e3a5c] via-[#22d3ee] to-[#4ade80] text-transparent bg-clip-text">
            Choose Your Plan
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Unlock the full potential of AI-powered interior design with our premium plans. Choose the plan that suits your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Free Plan */}
          <div className={`bg-zinc-900 border ${currentPlan === 'free' ? 'border-zinc-600' : 'border-zinc-800'} ${highlightedPlan === 'free' ? 'ring-2 ring-[#22d3ee]' : ''} rounded-xl p-6 transition-all duration-300 hover:border-zinc-700`}>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Free</h2>
              <div className="text-3xl font-bold mb-2">{convertPrice(0)}</div>
              <p className="text-zinc-500">Perfect for trying out</p>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center text-zinc-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#22d3ee]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>2 AI Design Generations</span>
              </div>
              <div className="flex items-center text-zinc-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#22d3ee]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Basic Room Styles</span>
              </div>
              <div className="flex items-center text-zinc-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#22d3ee]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Community Support</span>
              </div>
            </div>
            
            <Button
              disabled={currentPlan === 'free' || loading}
              onClick={() => handleUpgrade('free')}
              className={`w-full ${currentPlan === 'free' ? 'bg-zinc-700 cursor-not-allowed' : 'bg-zinc-800 hover:bg-zinc-700'} text-white py-2 rounded-lg transition-colors`}
            >
              {currentPlan === 'free' ? 'Current Plan' : 'Select Free Plan'}
            </Button>
          </div>
          
          {/* Premium Plan */}
          <div className={`bg-zinc-900 border ${highlightedPlan === 'premium' ? 'ring-4 ring-[#22d3ee]' : currentPlan === 'premium' ? 'border-zinc-600' : 'border-zinc-800'} rounded-xl p-6 transform ${highlightedPlan === 'premium' ? 'scale-105' : ''} transition-all duration-300 hover:border-[#22d3ee]/70 relative z-10`}>
            {highlightedPlan === 'premium' && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-[#1e3a5c] to-[#22d3ee] text-white text-xs py-1 px-3 rounded-full font-medium">
                RECOMMENDED
              </div>
            )}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Premium</h2>
              <div className="flex items-center justify-center">
                <div className="text-3xl font-bold">₹1</div>
                <span className="text-zinc-500 ml-1">/month</span>
              </div>
              <p className="text-zinc-500">For regular users</p>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center text-zinc-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#22d3ee]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>10 AI Design Generations</span>
              </div>
              <div className="flex items-center text-zinc-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#22d3ee]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>All Room Styles</span>
              </div>
              <div className="flex items-center text-zinc-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#22d3ee]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>High-Quality Generations</span>
              </div>
              <div className="flex items-center text-zinc-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#22d3ee]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Email Support</span>
              </div>
            </div>
            
            <Button
              disabled={currentPlan === 'premium' || loading}
              onClick={() => handleUpgrade('premium')}
              className={`w-full ${currentPlan === 'premium' ? 'bg-zinc-700 cursor-not-allowed' : 'bg-gradient-to-r from-[#1e3a5c] to-[#22d3ee] hover:opacity-90'} text-white py-2 rounded-lg transition-all duration-300 shadow-lg`}
            >
              {loading && currentPlan !== 'premium' ? 'Processing...' : currentPlan === 'premium' ? 'Current Plan' : 'Upgrade to Premium'}
            </Button>
          </div>
          
          {/* Pro Plan */}
          <div className={`bg-zinc-900 border ${highlightedPlan === 'pro' ? 'ring-4 ring-[#4ade80]' : currentPlan === 'pro' ? 'border-zinc-600' : 'border-zinc-800'} rounded-xl p-6 transition-all duration-300 hover:border-[#4ade80]/70`}>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Pro</h2>
              <div className="flex items-center justify-center">
                <div className="text-3xl font-bold">{convertPrice(10)}</div>
                <span className="text-zinc-500 ml-1">/month</span>
              </div>
              <p className="text-zinc-500">For professional users</p>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center text-zinc-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#4ade80]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Unlimited AI Designs</span>
              </div>
              <div className="flex items-center text-zinc-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#4ade80]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Premium Styles & Features</span>
              </div>
              <div className="flex items-center text-zinc-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#4ade80]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">4K Resolution</span>
              </div>
              <div className="flex items-center text-zinc-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#4ade80]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Priority Support</span>
              </div>
              <div className="flex items-center text-zinc-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#4ade80]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Commercial License</span>
              </div>
            </div>
            
            <Button
              disabled={currentPlan === 'pro' || loading}
              onClick={() => handleUpgrade('pro')}
              className={`w-full ${currentPlan === 'pro' ? 'bg-zinc-700 cursor-not-allowed' : 'bg-gradient-to-r from-[#22d3ee] to-[#4ade80] hover:opacity-90'} text-${currentPlan === 'pro' ? 'white' : 'black'} font-medium py-2 rounded-lg transition-all duration-300 shadow-lg`}
            >
              {loading && currentPlan !== 'pro' ? 'Processing...' : currentPlan === 'pro' ? 'Current Plan' : 'Upgrade to Pro'}
            </Button>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-zinc-500 mb-4">All plans include access to our basic features</p>
          <Button 
            onClick={() => router.push('/redesign')}
            className="bg-zinc-800 hover:bg-zinc-700 text-white transition-colors duration-300"
          >
            Continue with Current Plan
          </Button>
        </div>
      </div>
    </div>
  );
}