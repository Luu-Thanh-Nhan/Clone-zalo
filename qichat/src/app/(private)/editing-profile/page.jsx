"use client"
import { genders } from '@/app/(auth)/sign-up/information/page'
import { ThemeContext, notifyType } from '@/app/context'
import { AuthContext } from '@/components/auth/context'
import Input from '@/components/editing-profile/input'
import { TypeHTTP, api } from '@/utils/api'
import { useRouter } from 'next/navigation'
import React, { useContext, useEffect, useRef, useState } from 'react'




const EditingProfile = () => {
    const router = useRouter()
    const { data, handler } = useContext(ThemeContext)
    const [user, setUser] = useState()
    const [file, setFile] = useState()
    const [password, setPassword] = useState('')
    const [newPassWord, setNewPassWord] = useState('')
    const [confirmPassWord, setConfirmPassWord] = useState('')
    const inputRef = useRef()

    useEffect(() => {
        setUser(data.user)
    }, [data.user])

    const handleFile = (e) => {
        const f = e.target.files[0]
        const url = URL.createObjectURL(f)
        const file = f
        setFile({
            path: url,
            file: file,
        })
        setUser({ ...user, avatar: url })
    }


    const handleSubmitInformation = () => {
        if (!/^[A-ZÀ-Ỹ][a-zà-ỹ]+(\s[A-ZÀ-Ỹ][a-zà-ỹ]+)+$/.test(user?.fullName)) {
            handler.notify(notifyType.WARNING, 'Invalid Full Name');
            return;
        }

        if (!user?.dateOfBirth || new Date().getFullYear() - new Date(user?.dateOfBirth).getFullYear() - (new Date().getMonth() < new Date(user?.dateOfBirth).getMonth() || (new Date().getMonth() === new Date(user?.dateOfBirth).getMonth() && new Date().getDate() < new Date(user?.dateOfBirth).getDate())) < 12) {
            handler.notify(notifyType.WARNING, 'Age must be at least 12');
            return;
        }

        const formData = new FormData()
        if (file) {
            formData.append("image", file.file)
        }
        formData.append("user", JSON.stringify(user))
        handler.notify(notifyType.LOADING, 'Updating Account')
        api({ type: TypeHTTP.PUT, path: `/users/update-information/${user._id}`, sendToken: true, body: formData })
            .then(res => {
                handler.notify(notifyType.SUCCESS, "Update Information Successfully")
                setTimeout(() => {
                    globalThis.window.location.reload()
                }, 1000);
            })
    }

    const handleSubmitPassword = () => {

        if (password.length < 6) {
            handler.notify(notifyType.WARNING, 'Password must be at least 6 characters')
            return
        }
        if (newPassWord.length < 6) {
            handler.notify(notifyType.WARNING, 'New password must be at least 6 characters')
            return
        }

        if (newPassWord === password) {
            handler.notify(notifyType.WARNING, 'New password must be different from password')
            return
        }

        if (confirmPassWord !== newPassWord) {
            handler.notify(notifyType.WARNING, 'The new password must match the confirm password')
            return
        }
        api({ sendToken: true, type: TypeHTTP.PUT, path: `/users/update-password/${user?._id}`, body: { password, newPassword: newPassWord } })
            .then(res => {
                handler.notify(notifyType.SUCCESS, "Update Password Successfully")
                globalThis.localStorage.removeItem('accessToken')
                globalThis.localStorage.removeItem('refreshToken')
                globalThis.localStorage.removeItem('user_id')
                globalThis.localStorage.removeItem('admin')
                router.push('/')
                setTimeout(() => {
                    globalThis.window.location.reload()
                }, 1000);
            })
            .catch(error => {
                handler.notify(notifyType.FAIL, "Update Password Failed")
            })
    }



    return (
        <section className='overflow-y-auto h-screen pb-[2rem]'>
            <input ref={inputRef} onChange={handleFile} accept='image/*' type="file" className='hidden' />
            <div className='w-full relative flex items-center justify-center'>
                <img className='w-full' src='/background-avatar.png' />
                <div className='absolute flex left-[3rem] translate-y-[50%] bottom-0'>
                    <div className='h-[130px] w-[130px] relative'>
                        <img className='rounded-full h-[100%] w-[100%]' src={user?.avatar} />
                        <i onClick={() => inputRef.current.click()} className='bx bx-pencil text-[25px] absolute right-[-5px] cursor-pointer bottom-[-5px]'></i>
                    </div>
                    <div className='flex flex-col justify-end ml-5'>
                        <div><span className='text-[20px] font-semibold'>{data.user?.fullName}</span></div>
                        <span className='text-[14px] font-semibold'>{data.user?.friends.length} Friends</span>
                    </div>
                </div>
            </div>
            <div className='w-full flex justify-end px-[2rem] py-[1rem]'>
                <button onClick={() => handleSubmitInformation()} style={{ backgroundImage: 'url(/bg.webp)', backgroundSize: 'cover' }} className='rounded-md text-[white] font-poppins w-[100px] h-[35px] mt-[5px] shadow'>Change</button>
            </div>
            <div className='w-full px-[12rem] pt-[2rem]'>
                <h2 className='text-[21px] font-semibold font-poppins'>Information</h2>
                <div className='mt-[1rem] px-[2rem] grid grid-cols-2'>
                    <Input onChange={(e) => setUser({ ...user, fullName: e.target.value })} title={'FullName'} value={user?.fullName || ''} />
                    <Input onChange={(e) => setUser({ ...user, dateOfBirth: e.target.value })} type='date' title={'Date Of Birth'} value={user?.dateOfBirth ? new Date(user?.dateOfBirth).toISOString().split('T')[0] : ''} />
                    {data.user?.phone && <Input disabled={true} title={'Phone'} value={user?.phone} />}
                    {data.user?.email && <Input disabled={true} title={'Email'} value={data.user?.email} />}
                    <div className='flex flex-col mb-[10px]'>
                        <span className='mb-1 text-[15px] font-poppins'>Gender</span>
                        <select value={user?.gender} onChange={(e) => setUser({ ...user, gender: e.target.value })} className='focus:outline-0 px-[10px] border-[#999] border-[1px] bg-[white] w-[320px] h-[35px] rounded-[5px]'>
                            <option value={genders.none}>Choose Gender</option>
                            <option value={genders.Male}>Male</option>
                            <option value={genders.Female}>Female</option>
                        </select>
                    </div>
                    <div className='flex flex-col mb-[10px]'>
                        <span className='mb-1 text-[15px] font-poppins'>Bio</span>
                        <textarea onChange={(e) => setUser({ ...user, bio: e.target.value })} className='p-[10px] w-[320px] h-[200px] focus:outline-0 border-[#999] border-[1px] rounded-md' value={user?.bio || ''} />
                    </div>
                </div>
            </div>
            {data.user?.phone &&
                <div className='w-full px-[12rem] pt-[2rem]'>
                    <h2 className='text-[21px] font-semibold font-poppins'>Change Password</h2>
                    <div className='mt-[1rem] px-[2rem] grid grid-cols-2'>
                        <Input title={'Current Password'} type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                        <Input type='password' onChange={(e) => setNewPassWord(e.target.value)} title={'New Password'} value={newPassWord} />
                        <div></div>
                        <Input className='right-[150%]' type='password' onChange={(e) => setConfirmPassWord(e.target.value)} title={'Confirm New Password'} value={confirmPassWord} />
                        <button onClick={() => handleSubmitPassword()} type='submit' style={{ backgroundImage: 'url(/bg.webp)', backgroundSize: 'cover' }} className='rounded-md text-[white] font-poppins w-[100px] h-[35px] text-[15px] mt-[5px] shadow'>Change</button>
                    </div>
                </div>
            }

        </section>
    )
}

export default EditingProfile