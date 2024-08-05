'use client'
import { createContext, useEffect, useState } from "react";
export const AuthContext = createContext();

export const ProviderContext = ({ children }) => {
    const [user, setUser] = useState()

    const listData = {
        user
    }

    const listHandler = {
        setUser
    }

    return (
        <AuthContext.Provider value={{ listData, listHandler }}>
            {children}
        </AuthContext.Provider>
    )
}