import Link from 'next/link'
import React, { useContext, useEffect, useState } from 'react'
import Logo from '../logo'
import { steps } from '@/app/(auth)/forgot-password/page'
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'
import { auth } from '../firebase/firebase'
import { TypeHTTP, api } from '@/utils/api'
import { ThemeContext, notifyType } from '@/app/context'

const VerificationPhone = ({ setCurrentStep, user }) => {
    const { handler } = useContext(ThemeContext)
    const [verification, setVerification] = useState()
    const [otp, setOtp] = useState('')
    useEffect(() => {
        const recaptcha = new RecaptchaVerifier(auth, 'recaptcha', {})
        signInWithPhoneNumber(auth, user.phone, recaptcha)
            .then(confirmation => {
                setVerification(confirmation)
            })
    }, [user]);

    const handleSubmitOTPWithPhoneNumber = () => {
        handler.notify(notifyType.LOADING, 'Verifying code')
        verification.confirm(otp)
            .then(data => {
                handler.notify(notifyType.SUCCESS, 'Next Step')
                setCurrentStep(steps.UPDATINGPASSWORD)
            })
            .catch(() => {
                handler.notify(notifyType.FAIL, 'Verification codes do not match')
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
                <h1 className='font-bold text-[25px] mb-[10px]'>Enter OTP</h1>
                <span>{`We sent a code to your phone number (${user.phone})`}</span>
                <div id='recaptcha'></div>
                <input value={otp} onChange={e => setOtp(e.target.value)} type='text' placeholder='Enter OTP' className='focus:outline-0 px-[15px] mt-[15px] bg-[#f5f2f2] w-[500px] h-[45px] rounded-[5px] ' />
                <button onClick={() => handleSubmitOTPWithPhoneNumber()} type='submit' className='bg-[#e77373] w-[300px] h-[40px] rounded-[10px] text-[white] mt-[15px]'>Submit</button>
            </div>
        </section>
    )
}

export default VerificationPhone