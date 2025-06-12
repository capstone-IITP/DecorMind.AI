'use client'

import { useUser } from '@clerk/nextjs'
import React, { useEffect, useState, useCallback } from 'react'
import { UserDetailProvider } from '../app/_context/UserDetailContext';
import axios from 'axios';

function Provider({ children }) {
    const { user } = useUser();
    const [userData, setUserData] = useState(null);
    
    const VerifyUser = useCallback(async () => {
        if (user) {
            try {
                // Call the verify-user API
                const dataResult = await axios.post('/api/verify-user', {
                    user: user,
                });
                setUserData(dataResult.data.result);
            } catch (error) {
                console.error("Error verifying user:", error);
                
                // Provide fallback user data if API call fails
                setUserData({
                    email: user.primaryEmailAddress?.emailAddress,
                    name: user.fullName || user.username || "User",
                    imageUrl: user.imageUrl,
                    credits: 5
                });
            }
        }
    }, [user]);
    
    useEffect(() => {
        if (user) {
            VerifyUser();
        }
    }, [user, VerifyUser]);

    return (
        <UserDetailProvider>
            <header />
            <div>
                {children}
            </div>
        </UserDetailProvider>
    )
}

export default Provider