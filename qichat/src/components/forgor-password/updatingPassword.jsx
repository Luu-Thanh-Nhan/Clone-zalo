
import Link from 'next/link'
import React, { useContext, useEffect, useState } from 'react'
import Logo from '../logo'
import { TypeHTTP, api, systemID } from '@/utils/api';
import { ThemeContext, notifyType } from '@/app/context';
import { useRouter } from 'next/navigation';

const UpdatingPassword = ({ setCurrentStep, user }) => {
    const router = useRouter()
    const { handler } = useContext(ThemeContext)
    const [newPassword, setNewPassword] = useState('')
    const [confirmNewPassword, setConfirmNewPassword] = useState('')

    const handleConfirm = () => {
        if (newPassword.length < 6) {
            handler.notify(notifyType.WARNING, 'New Password must be at least 6 characters')
            return
        }
        if (newPassword !== confirmNewPassword) {
            handler.notify(notifyType.WARNING, 'New Password must be match with confirm password')
            return
        }
        handler.notify(notifyType.LOADING, 'Updating password')
        api({ type: TypeHTTP.PUT, path: `/users/update-forgot-password/${user?._id}`, body: { password: systemID, newPassword } })
            .then(res => {
                handler.notify(notifyType.SUCCESS, "Update Password Successfully")
                router.push('/sign-in')
            })
            .catch(error => {
                handler.notify(notifyType.FAIL, "Update Password Failed")
            })
    }

    return (
        <section className='w-[100%] flex font-poppins'>
            <div style={{ backgroundImage: 'url(/bg-dung.jpg)' }} className='w-[50%] flex items-center relative h-screen justify-center bg-cover' >
                <div className='flex items-center left-[2rem] absolute top-[2rem]'>
                    <Logo text={'white'} />
                </div>
                <div className='flex flex-col items-center text-[white] font-poppins'>
                    <h1 className='text-[white] font-bold text-[30px] leading-[60px] justify-center text-center '>Welcome Back!</h1>
                    <span>To keep connected with us</span>
                    <span>please sign in your personal info</span>
                    <Link href={'/sign-in'}><button className=' border-[2px] mt-[20px] h-[40px] rounded-full text-[white] px-[80px] text-center '>Sign In</button></Link>
                </div>
            </div>
            <div className='w-[50%] px-[80px] flex flex-col justify-center'>
                <h1 className='font-bold text-[25px] mb-[5px]'>Update password</h1>
                <input onChange={(e) => setNewPassword(e.target.value)} value={newPassword} type='password' placeholder='Enter New Password' className='text-[15px] focus:outline-0 px-[15px] mt-[15px] bg-[#f5f2f2] w-[500px] h-[45px] rounded-[5px] ' />
                <input onChange={(e) => setConfirmNewPassword(e.target.value)} value={confirmNewPassword} type='password' placeholder='Confirm New Password' className='text-[15px] focus:outline-0 px-[15px] mt-[15px] bg-[#f5f2f2] w-[500px] h-[45px] rounded-[5px] ' />
                <button onClick={() => handleConfirm()} className='bg-[#e77373] w-[300px] h-[40px] rounded-[10px] text-[white] mt-4'>Update</button>
            </div>
        </section>
    )
}

export default UpdatingPassword