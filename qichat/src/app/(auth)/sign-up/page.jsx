'use client'
import Logo from '@/components/logo'
import { TypeHTTP, api } from '@/utils/api'
import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { formatPhoneByFireBase } from '@/utils/call';
import { AuthContext } from '@/components/auth/context';
import toast from 'react-hot-toast';
import { ThemeContext, notifyType } from '@/app/context';
import { signWithGoogle } from '@/components/firebase/firebase';
import Link from 'next/link';

const SignUp = () => {
    const router = useRouter();
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const { listHandler } = useContext(AuthContext)
    const { handler } = useContext(ThemeContext)


    const handleSignUp = () => {
        if (!/^\d{10}$/.test(phone)) {
            handler.notify(notifyType.WARNING, 'Invalid phone number')
            return
        }
        if (password.length < 6) {
            handler.notify(notifyType.WARNING, 'Password must be at least 6 characters')
            return
        }
        if (confirmPassword !== password) {
            handler.notify(notifyType.WARNING, 'Passwords do not match')
            return
        }
        api({ body: { phone: formatPhoneByFireBase(phone), password }, type: TypeHTTP.POST, sendToken: false, path: '/sign-up' })
            .then(res => {
                if (res) {
                    listHandler.setUser(res)
                    handler.notify(notifyType.SUCCESS, 'Account creation completed')
                    router.push('/sign-up/verification')
                }
            })
            .catch(error => {

                handler.notify(notifyType.FAIL, 'Registered phone number')
            })
    }

    const handleSignUpWithGoogle = () => {
        signWithGoogle('sign-up')
            .then(user => {
                if (user) {
                    listHandler.setUser(user)
                    handler.notify(notifyType.SUCCESS, 'Account creation completed')
                    router.push('/sign-up/verification')
                }
            })
            .catch(error => {
                handler.notify(notifyType.FAIL, error.message)
            })
    }

    return (
        <section className='w-[100%] flex font-poppins' >
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
                <h1 className='font-bold text-[25px] mb-[10px]'>Sign up</h1>
                <input onChange={(e) => setPhone(e.target.value)} value={phone} type='text' placeholder='Phone' className='text-[15px] focus:outline-0 px-[15px] mt-[15px] bg-[#f5f2f2] w-[500px] h-[45px] rounded-[5px] ' />
                <input onChange={(e) => setPassword(e.target.value)} value={password} type='password' placeholder='Password' className='text-[15px] focus:outline-0 px-[15px] mt-[15px] bg-[#f5f2f2] w-[500px] h-[45px] rounded-[5px] ' />
                <input onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} type='password' placeholder='Confirm Password' className='text-[15px] focus:outline-0 px-[15px] mt-[15px] bg-[#f5f2f2] w-[500px] h-[45px] rounded-[5px] ' />
                <button onClick={() => handleSignUp()} className='w-[300px] h-[40px] rounded-[10px] bg-[#e77373] text-[white] mt-[15px]'>Sign up</button>
                {/* <span className='my-[10px]'>Or</span>
                <button onClick={() => handleSignUpWithGoogle()} className='font-bold w-[300px] h-[40px] border-[2px] text-[#353535] rounded-[10px]'> <i className='bx bxl-gmail text-[20px] mr-1 translate-y-[1px]'></i>  Sign up with Gmail</button> */}
            </div>
        </section>
    )
}

export default SignUp