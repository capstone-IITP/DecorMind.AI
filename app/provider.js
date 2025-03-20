import { useUser } from '@clerk/nextjs'
import React, { useEffect, useState } from 'react'
import { UserDetailContext } from '@/app/_context/UserDetailContext';
import axios from 'axios';

function Provider({ children }) {

    const { user } = useUser();
    const [userDetail, setUserDetail] = useState([]);
    useEffect(() => {
        user && VerifyUser();
    }, [user])

    const VerifyUser = async () => {
        const dataResult = await axios.post('/api/verify-user', {
            user: user,
        });
        setUserDetail(dataResult.data.result);
    }

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