import React from 'react'
import AuthContext from '../context/authContext'

const AuthLayout = ({ children }) => {
    return (
        <AuthContext>
            {children}
        </AuthContext>
    )
}

export default AuthLayout