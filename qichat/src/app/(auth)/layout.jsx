import { ProviderContext } from '@/components/auth/context'
import React from 'react'

const Layout = ({ children }) => {
    return (
        <ProviderContext>
            {children}
        </ProviderContext>
    )
}

export default Layout