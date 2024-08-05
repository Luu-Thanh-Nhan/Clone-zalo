'use client'
import { RecaptchaVerifier, getAuth, signInWithPhoneNumber, sendEmailVerification } from 'firebase/auth';
import { auth } from '@/components/firebase/firebase';
import { AuthContext } from '@/components/auth/context';
import Logo from '@/components/logo';
import React, { useContext, useEffect, useState } from 'react';
import { TypeHTTP, api } from '@/utils/api';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ThemeContext, notifyType } from '@/app/context';

const Verification = () => {
    const pathname = usePathname()
    const router = useRouter();
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('')
    const [verification, setVerification] = useState()
    const [otp, setOtp] = useState('')
    const { listData, listHandler } = useContext(AuthContext);
    const { handler } = useContext(ThemeContext)

    useEffect(() => {
        if (!listData.user) {
            router.push('/sign-up')
        }
    }, [pathname])

    useEffect(() => {
        if (listData.user?.phone) {
            setPhone(listData.user.phone);
            const recaptcha = new RecaptchaVerifier(auth, 'recaptcha', {})
            signInWithPhoneNumber(auth, listData.user.phone, recaptcha)
                .then(confirmation => {
                    setVerification(confirmation)
                })
        } else if (listData.user?.email) {
            setEmail(listData.user.email)
            api({ sendToken: false, path: `/send-verify-code/${listData.user.email}`, type: TypeHTTP.POST })
            globalThis.localStorage.setItem('currentEmail', listData.user.email)
            globalThis.localStorage.setItem('currentUser', listData.user._id)
        }
    }, [listData.user]);

    const handleSubmitOTPWithPhoneNumber = () => {
        if (otp === '') {
            handler.notify(notifyType.WARNING, "Enter Verify Code, Please")
            return
        }
        handler.notify(notifyType.LOADING, 'Verifying Phone Number')
        verification.confirm(otp)
            .then(data => {
                const user = listData.user
                api({ type: TypeHTTP.PUT, body: { statusSignUp: 'Complete Step 2' }, path: `/users/${user._id}`, sendToken: false })
                    .then(res => {
                        if (res) {
                            handler.notify(notifyType.SUCCESS, 'Successful Authentication')
                            router.push('/sign-up/information')
                        }
                    })
            })
            .catch(() => {
                handler.notify(notifyType.FAIL, 'Verification codes do not match')
            })
    }

    const handleSubmitOTPWithGmail = () => {
        if (otp === '') {
            handler.notify(notifyType.WARNING, "Enter Verify Code, Please")
            return
        }
        handler.notify(notifyType.LOADING, 'Verifying Email')
        api({ type: TypeHTTP.POST, sendToken: false, path: '/verify-gmail', body: { code: otp, email } })
            .then(res => {
                const user = listData.user
                api({ type: TypeHTTP.PUT, body: { statusSignUp: 'Complete Step 2' }, path: `/users/${user._id}`, sendToken: false })
                    .then(res => {
                        if (res) {
                            handler.notify(notifyType.SUCCESS, 'Successful Authentication')
                            router.push('/sign-up/information')
                        }
                    })
            })
            .catch(error => {
                handler.notify(notifyType.FAIL, error.message.data)
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
                <h1 className='font-bold text-[25px] mb-[10px]'>Verification</h1>
                <span className='font-medium'>{`We sent a ${phone !== '' ? 'code' : 'email verification'} to your ${phone === '' ? `Email (${email})` : `Phone Number (${phone})`}`}</span>
                <div id='recaptcha'></div>
                {phone !== '' && (
                    <>
                        <input onChange={(e) => setOtp(e.target.value)} value={otp} type='text' placeholder='Enter OTP' className='focus:outline-0 px-[15px] mt-[15px] bg-[#f5f2f2] w-[500px] h-[45px] rounded-[5px] ' />
                        <button onClick={() => handleSubmitOTPWithPhoneNumber()} type='submit' className='bg-[#e77373] w-[300px] h-[40px] rounded-[10px] text-[white] mt-[15px]'>Submit</button>
                    </>
                )}
                {email !== '' && (
                    <>
                        <input onChange={(e) => setOtp(e.target.value)} value={otp} type='text' placeholder='Enter OTP' className='focus:outline-0 px-[15px] mt-[15px] bg-[#f5f2f2] w-[500px] h-[45px] rounded-[5px] ' />
                        <button onClick={() => handleSubmitOTPWithGmail()} type='submit' className='bg-[#e77373] w-[300px] h-[40px] rounded-[10px] text-[white] mt-[15px]'>Submit</button>
                    </>
                )}
            </div>
        </section>
    )
}

export default Verification