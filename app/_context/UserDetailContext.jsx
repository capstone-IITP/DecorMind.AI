// app/context/UserDetailContext.js
'use client';

// import Header from '../dashboard/_components/Header';
import React, { createContext, useState, useEffect } from 'react';

// Create the context
export const UserDetailContext = createContext(null);

// Create a provider component
export const UserDetailProvider = ({ children }) => {
  const [userDetail, setUserDetail] = useState({
    credits: 0
  });

  // You would typically fetch user details here
  useEffect(() => {
    // Example: fetch user details from API
    // For now just using mock data
    const mockUserData = {
      credits: 100
    };
    
    setUserDetail(mockUserData);
  }, []);

  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      {/* <Header /> */}
      {children}
    </UserDetailContext.Provider>
  );
};

export default UserDetailContext;