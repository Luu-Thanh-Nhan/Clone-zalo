'use client'
import { ThemeContext } from '@/app/context'
import { useRouter } from 'next/navigation'
import React, { useContext, useEffect } from 'react'

const LockPage = () => {

    const router = useRouter()
    const { data } = useContext(ThemeContext)

    useEffect(() => {
        if (data.user?.disable === false) {
            router.push("/messages")
        }
    }, [data.user])

    return (
        <div className='w-full h-full flex items-center justify-center'>
            <div className='flex flex-col justify-center items-center gap-4'>
                <img src='/lock.png' width={'150px'} />
                <span className='text-[20px] font-medium text-[#535353]'>Your account has been locked !!!</span>
            </div>
        </div>
    )
}

export default LockPage