import React, { createContext, useState } from 'react'
export const authContext = createContext()
const AuthContext = ({ children }) => {
    const [user, setUser] = useState()

    const authData = {
        user
    }

    const authHandler = {
        setUser
    }
    return (
        <authContext.Provider value={{ authData, authHandler }}>
            {children}
        </authContext.Provider>
    )
}

export default AuthContext