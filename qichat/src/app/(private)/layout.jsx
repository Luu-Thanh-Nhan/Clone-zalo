
import PrivateNavbar from '@/components/navbar/privateNavbar'
import React from 'react'

const PrivateLayout = ({ children }) => {
    return (
        <section className='flex'>
            <PrivateNavbar />
            <div className='w-full'>
                {children}
            </div>
        </section>
    )
}

export default PrivateLayout