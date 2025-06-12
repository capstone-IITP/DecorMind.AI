'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

export default function useUserPlan() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [plan, setPlan] = useState('free');
  const [usedCredits, setUsedCredits] = useState(0);
  const [totalCredits, setTotalCredits] = useState(2); // Default for free plan
  const [hasUsedFreePlan, setHasUsedFreePlan] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load user plan data from localStorage or server
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      // In a real app, you would fetch this from your database
      const userId = user.id;
      
      // Load from localStorage for now
      const storedPlan = localStorage.getItem(`plan_${userId}`) || 'free';
      const storedUsedCredits = parseInt(localStorage.getItem(`usedCredits_${userId}`), 10) || 0;
      const storedTotalCredits = localStorage.getItem(`totalCredits_${userId}`);
      const storedHasUsedFreePlan = localStorage.getItem(`hasUsedFreePlan_${userId}`) === 'true';
      
      // Set plan details
      setPlan(storedPlan);
      setUsedCredits(storedUsedCredits);
      
      // Set total credits based on plan
      if (storedTotalCredits === 'unlimited') {
        setTotalCredits('unlimited');
      } else if (storedTotalCredits) {
        setTotalCredits(parseInt(storedTotalCredits, 10));
      } else {
        // Default credits based on plan if not explicitly stored
        setTotalCredits(storedPlan === 'free' ? 2 : storedPlan === 'premium' ? 10 : 30);
      }
      
      setHasUsedFreePlan(storedHasUsedFreePlan);
      setLoading(false);
    } else if (isLoaded && !isSignedIn) {
      // Default values for non-signed in users
      setPlan('free');
      setUsedCredits(0);
      setTotalCredits(2);
      setHasUsedFreePlan(false);
      setLoading(false);
    }
  }, [isLoaded, isSignedIn, user]);

  // Save user plan data
  const saveUserPlanData = () => {
    if (isSignedIn && user) {
      const userId = user.id;
      localStorage.setItem(`plan_${userId}`, plan);
      localStorage.setItem(`usedCredits_${userId}`, usedCredits.toString());
      localStorage.setItem(`totalCredits_${userId}`, totalCredits.toString());
      localStorage.setItem(`hasUsedFreePlan_${userId}`, hasUsedFreePlan.toString());
    }
  };

  // Update plan
  const updatePlan = (newPlan) => {
    setPlan(newPlan);
    
    // Reset used credits and set total credits based on the new plan
    setUsedCredits(0);
    
    if (newPlan === 'free') {
      setTotalCredits(2);
      setHasUsedFreePlan(true);
    } else if (newPlan === 'premium') {
      setTotalCredits(10);
    } else if (newPlan === 'pro') {
      setTotalCredits(30);
    }
    
    // Save the updated data
    setTimeout(saveUserPlanData, 0);
  };

  // Use a credit
  const useCredit = () => {
    if (totalCredits === 'unlimited' || usedCredits < totalCredits) {
      const newUsedCredits = usedCredits + 1;
      setUsedCredits(newUsedCredits);
      
      // Mark free plan as used if all free credits are used
      if (plan === 'free' && newUsedCredits >= totalCredits) {
        setHasUsedFreePlan(true);
      }
      
      // Save the updated data
      setTimeout(saveUserPlanData, 0);
      return true;
    }
    return false;
  };

  // Check if user has available credits
  const hasAvailableCredits = () => {
    return totalCredits === 'unlimited' || usedCredits < totalCredits;
  };

  // Get remaining credits
  const getRemainingCredits = () => {
    if (totalCredits === 'unlimited') return 'unlimited';
    return Math.max(0, totalCredits - usedCredits);
  };

  // Check if user can use the free plan
  const canUseFreeplan = () => {
    return !hasUsedFreePlan;
  };

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      saveUserPlanData();
    }
  }, [plan, usedCredits, totalCredits, hasUsedFreePlan, isLoaded, isSignedIn]);

  return {
    plan,
    usedCredits,
    totalCredits,
    hasUsedFreePlan,
    loading,
    updatePlan,
    useCredit,
    hasAvailableCredits,
    getRemainingCredits,
    canUseFreeplan
  };
} 