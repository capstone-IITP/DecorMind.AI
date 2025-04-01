import { useUser } from '@clerk/nextjs'
import React, { useEffect, useState, useCallback } from 'react'
import { UserDetailContext } from '@/app/_context/UserDetailContext';
import axios from 'axios';

function Provider({ children }) {

    const { user } = useUser();
    const [userDetail, setUserDetail] = useState([]);
    
    const VerifyUser = useCallback(async () => {
        const dataResult = await axios.post('/api/verify-user', {
            user: user,
        });
        setUserDetail(dataResult.data.result);
    }, [user]);
    
    useEffect(() => {
        user && VerifyUser();
    }, [user, VerifyUser]);

    return (
        <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
            <header />
            <div>
                {children}
            </div>
        </UserDetailContext.Provider>
    )
}

export default Provider