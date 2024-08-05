import { ProviderContext } from '@/components/adding/context'
import React from 'react'

const Layout = ({ children }) => {
    return (
        <ProviderContext>
            {children}
        </ProviderContext>
    )
}

export default Layout