
import { steps } from '@/app/(auth)/forgot-password/page';
import Link from 'next/link'
import React, { useContext, useEffect, useState } from 'react'
import Logo from '../logo'
import { formatPhoneByFireBase } from '@/utils/call';
import { TypeHTTP, api } from '@/utils/api';
import { ThemeContext, notifyType } from '@/app/context';


const EnteringPhone = ({ setCurrentStep, setUser }) => {
    const [phone, setPhone] = useState('');
    const { handler } = useContext(ThemeContext)

    const handleSubmitPhone = () => {
        if (!/^\d{10}$/.test(phone)) {
            handler.notify(notifyType.WARNING, 'Invalid phone number')
            return
        }
        handler.notify(notifyType.LOADING, 'Verifying Phone Number')
        api({ type: TypeHTTP.GET, path: `/users/find-by-phone-no-token/${formatPhoneByFireBase(phone)}` })
            .then(res => {
                if (res.data[0]) {
                    if (res.data[0].statusSignUp === 'Complete Sign Up') {
                        handler.notify(notifyType.SUCCESS, "Next Step")
                        setUser(res.data[0])
                        setCurrentStep(steps.VERIFICATIONPHONE)
                    } else {
                        handler.notify(notifyType.FAIL, "Your Account don't verified")
                    }
                } else {
                    handler.notify(notifyType.FAIL, "Not Found User")
                }
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
                <h1 className='font-bold text-[25px]'>Enter Phone</h1>
                <span className='font-medium'>Please enter your phone number for us to start verification</span>
                <input onChange={(e) => setPhone(e.target.value)} value={phone} type='text' placeholder='Phone' className='text-[15px] focus:outline-0 px-[15px] mt-[15px] bg-[#f5f2f2] w-[500px] h-[45px] rounded-[5px] ' />
                <button onClick={() => handleSubmitPhone()} className='bg-[#e77373] w-[300px] h-[40px] rounded-[10px] text-[white] mt-[15px]'>Submit</button>
            </div>
        </section>
    )
}

export default EnteringPhone