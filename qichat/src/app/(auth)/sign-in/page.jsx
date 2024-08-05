'use client'
import Logo from '@/components/logo'
import { TypeHTTP, api } from '@/utils/api'
import React, { useContext, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation';
import { AuthContext } from '@/components/auth/context';
import { formatPhoneByFireBase } from '@/utils/call';
import { ThemeContext, notifyType } from '@/app/context';
import { signWithGoogle } from '@/components/firebase/firebase';
import Link from 'next/link';

const SignIn = () => {
    const pathname = usePathname()
    const { listData, listHandler } = useContext(AuthContext)
    const { handler } = useContext(ThemeContext)
    const router = useRouter();
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')

    const handleSignIn = () => {
        handler.notify(notifyType.LOADING, 'Verifying Account')
        api({ body: { phone: formatPhoneByFireBase(phone), password }, path: '/sign-in', type: TypeHTTP.POST, sendToken: false })
            .then(res => {
                listHandler.setUser(res.user)
                if (res?.user.statusSignUp === 'Complete Step 1') {
                    router.push('/sign-up/verification')
                } else if (res?.user.statusSignUp === 'Complete Step 2') {
                    router.push('/sign-up/information')
                } else if (res?.user.statusSignUp === 'Complete Sign Up') {
                    globalThis.localStorage.setItem('accessToken', res?.tokens.accessToken)
                    globalThis.localStorage.setItem('refreshToken', res?.tokens.refreshToken)
                    globalThis.localStorage.setItem('user_id', res?.user._id)
                    globalThis.localStorage.setItem('admin', res?.user.admin)
                    handler.setUser(res?.user)
                    if (res.user.disable === true) {
                        handler.notify(notifyType.FAIL, 'This account has been locked')
                        router.push('/lock')
                    } else {
                        router.push('/messages')
                    }
                }
                handler.notify(notifyType.NONE, '')
            })
            .catch(error => {
                if (pathname === '/sign-in') {
                    handler.notify(notifyType.FAIL, 'Wrong login information ')
                }
            })
    }

    const handleSignInWithGoogle = () => {
        signWithGoogle('sign-in')
            .then(res => {
                listHandler.setUser(res.user)
                if (res?.user.statusSignUp === 'Complete Step 1') {
                    router.push('/sign-up/verification')
                } else if (res?.user.statusSignUp === 'Complete Step 2') {
                    router.push('/sign-up/information')
                } else if (res?.user.statusSignUp === 'Complete Sign Up') {
                    globalThis.localStorage.setItem('accessToken', res?.tokens.accessToken)
                    globalThis.localStorage.setItem('refreshToken', res?.tokens.refreshToken)
                    globalThis.localStorage.setItem('user_id', res?.user._id)
                    globalThis.localStorage.setItem('admin', res?.user.admin)
                    handler.setUser(res?.user)
                    router.push('/messages')
                }
                handler.notify(notifyType.NONE, '')
            })
            .catch(error => {
                handler.notify(notifyType.FAIL, 'Wrong login information ')
            })
    }

    return (
        <div className='h-screen w-[100%] flex pl-[4rem]' >
            <div className='w-[55%] h-full' >
                <div className='flex py-[2rem]'>
                    <Logo text={'black'} />
                </div>
                <div className='flex flex-col items-start gap-4 h-full font-poppins'>
                    <h1 className='text-[#120505] font-bold text-[25px] py-[1rem]'>Sign In</h1>
                    <input value={phone} onChange={(e) => setPhone(e.target.value)} type="phone" placeholder='Phone' className='focus:outline-0 bg-[#f3f3f3] shadow-sm w-[80%] h-[50px] rounded-[10px] px-6' />
                    <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder='Password' className='focus:outline-0 bg-[#f3f3f3] shadow-sm w-[80%] h-[50px] rounded-[10px] px-6' />
                    <Link href={'/forgot-password'}><button className='font-bold text-[15px]'>Forgot password ?</button></Link>
                    <button onClick={() => handleSignIn()} className='bg-[#e77373] w-[300px] h-[40px] rounded-[10px] text-[white]'>Sign in</button>
                    {/* <span className='font-bold'>Or</span>
                    <button onClick={() => handleSignInWithGoogle()} className='font-bold w-[300px] h-[40px] border-[2px] text-[#353535] rounded-[10px]'> <i className='bx bxl-gmail text-[20px] mr-1 translate-y-[1px]'></i>  Sign in with Gmail</button> */}
                </div>
            </div>
            <div style={{ backgroundImage: 'url(/bg-dung.jpg)' }} className='font-poppins rounded-lg px-[4rem] flex items-center justify-center h-screen bg-cover w-[50%]'>
                <div className='flex flex-col items-center'>
                    <h1 className='text-[35px] text-[white]'>Hello, Friend!</h1>
                    <span className='text-[white] mt-[10px]'>Enter your personal information </span>
                    <span className='text-[white] mb-[20px]'>and start the experience</span>
                    <Link href={'/sign-up'}><button className='text-[white] font-medium w-[350px] h-[45px] border-[3px] rounded-[10px]'>Create an account</button></Link>
                </div>
            </div>
        </div>
    )
}

export default SignIn