'use client'
import { ThemeContext, notifyType } from '@/app/context'
import { AuthContext } from '@/components/auth/context'
import Logo from '@/components/logo'
import { TypeHTTP, api } from '@/utils/api'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'

export const genders = {
    none: 'none',
    Male: 'Male',
    Female: 'Female'
}

const Information = () => {
    const pathname = usePathname()
    const [fullName, setFullName] = useState('')
    const [dateOfBirth, setDateOfBirth] = useState()
    const [bio, setBio] = useState('')
    const [gender, setGender] = useState('none')
    const { handler } = useContext(ThemeContext)
    const { listData, listHandler } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        if (!listData.user) {
            router.push('/sign-up')
        }
    }, [pathname])

    const handleSubmitInformation = () => {
        if (!/^[A-ZÀ-Ỹ][a-zà-ỹ]+(\s[A-ZÀ-Ỹ][a-zà-ỹ]+)+$/.test(fullName)) {
            handler.notify(notifyType.WARNING, 'Invalid Full Name');
            return;
        }

        if (!dateOfBirth || new Date().getFullYear() - new Date(dateOfBirth).getFullYear() - (new Date().getMonth() < new Date(dateOfBirth).getMonth() || (new Date().getMonth() === new Date(dateOfBirth).getMonth() && new Date().getDate() < new Date(dateOfBirth).getDate())) < 12) {
            handler.notify(notifyType.WARNING, 'Age must be at least 12');
            return;
        }

        if (gender !== genders.Male && gender !== genders.Female) {
            handler.notify(notifyType.WARNING, 'Invalid Gender');
            return;
        }
        handler.notify(notifyType.LOADING, 'Updating Information')
        api({ type: TypeHTTP.PUT, body: { fullName, dateOfBirth, bio, gender, statusSignUp: 'Complete Sign Up' }, path: `/users/${listData.user._id}`, sendToken: false })
            .then(res => {
                if (res) {
                    api({ type: TypeHTTP.POST, path: '/generate-tokens', body: { user_id: res?._id, admin: res?.admin }, sendToken: false })
                        .then(tokens => {
                            globalThis.localStorage.setItem('accessToken', tokens.accessToken)
                            globalThis.localStorage.setItem('refreshToken', tokens.refreshToken)
                            globalThis.localStorage.setItem('user_id', res?._id)
                            globalThis.localStorage.setItem('admin', res?.admin)
                            handler.setUser(res)
                            handler.notify(notifyType.SUCCESS, 'Update information successfully')
                            router.push('/messages')
                        })
                }
            })
    }

    return (
        <section className='w-[100%] flex' >
            <div style={{ backgroundImage: 'url(/bg-dung.jpg)' }} className='w-[50%] flex items-center relative h-screen justify-center bg-cover' >
                <div className='flex items-center left-[2rem] absolute top-[2rem]'>
                    <Logo text={'white'} />
                </div>
                <div className='flex flex-col items-center text-[white]'>
                    <h1 className='text-[white] font-bold text-[30px] leading-[60px] justify-center text-center '>Welcome Back!</h1>
                    <span>To keep connected with us</span>
                    <span>please sign in your personal info</span>
                    <Link href={'/sign-in'}><button className=' border-[2px] mt-[20px] h-[40px] rounded-full text-[white] px-[80px] text-center '>Sign In</button></Link>
                </div>
            </div>
            <div className='w-[50%] px-[80px] flex flex-col justify-center'>
                <h1 className='font-bold text-[25px] mb-[10px]'>Complete Your Profile</h1>
                <input onChange={(e) => setFullName(e.target.value)} value={fullName} type='text' placeholder='Full Name' className='focus:outline-0 px-[15px] mt-[15px] bg-[#f8f8f8] w-[500px] h-[45px] rounded-[5px] ' />
                <input onChange={(e) => setDateOfBirth(e.target.value)} value={dateOfBirth} type='date' placeholder='Date Of Birth' className='focus:outline-0 px-[15px] mt-[15px] bg-[#f8f8f8] w-[500px] h-[45px] rounded-[5px] ' />
                <input onChange={(e) => setBio(e.target.value)} value={bio} type='text' placeholder='Bio' className='focus:outline-0 px-[15px] mt-[15px] bg-[#f8f8f8] w-[500px] h-[45px] rounded-[5px]' />
                <select onChange={(e) => setGender(e.target.value)} className='focus:outline-0 px-[15px] mt-[15px] bg-[#f8f8f8] w-[500px] h-[45px] rounded-[5px]'>
                    <option value={genders.none}>Choose Gender</option>
                    <option value={genders.Male}>Male</option>
                    <option value={genders.Female}>Female</option>
                </select>
                <button onClick={() => handleSubmitInformation()} type='submit' className='bg-[#e77373] w-[300px] h-[40px] rounded-[10px] text-[white] mt-[15px]'>Submit</button>
            </div>
        </section>
    )
}

export default Information