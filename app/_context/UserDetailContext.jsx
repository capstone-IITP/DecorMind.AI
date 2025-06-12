// app/context/UserDetailContext.js
'use client';

// import Header from '../dashboard/_components/Header';
import React, { createContext, useContext, useCallback } from 'react';
import useUserPlan from '../_hooks/useUserPlan';

// Create the context
export const UserDetailContext = createContext(null);

// Create a provider component
export const UserDetailProvider = ({ children }) => {
  const userPlan = useUserPlan();
  
  // Create a wrapper function for useCredit that can be called from event handlers
  const creditUsed = useCallback(() => {
    userPlan.useCredit();
  }, [userPlan]);
  
  // Combine user plan data with any other user details
  const userDetail = {
    plan: userPlan.plan,
    usedCredits: userPlan.usedCredits,
    totalCredits: userPlan.totalCredits,
    hasUsedFreePlan: userPlan.hasUsedFreePlan,
    remainingCredits: userPlan.getRemainingCredits(),
    hasAvailableCredits: userPlan.hasAvailableCredits(),
    canUseFreeplan: userPlan.canUseFreeplan(),
  };

  // Create value object with all user data and functions
  const value = {
    userDetail,
    updatePlan: userPlan.updatePlan,
    useCredit: userPlan.useCredit,
    creditUsed, // Add the wrapper function
    loading: userPlan.loading,
  };

  return (
    <UserDetailContext.Provider value={value}>
      {/* <Header /> */}
      {children}
    </UserDetailContext.Provider>
  );
};

// Custom hook to use the context
export const useUserDetail = () => {
  const context = useContext(UserDetailContext);
  if (!context) {
    throw new Error('useUserDetail must be used within a UserDetailProvider');
  }
  return context;
};

export default UserDetailContext;