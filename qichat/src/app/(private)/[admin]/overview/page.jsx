'use client'
import { ThemeContext, notifyType } from '@/app/context'
import { TypeHTTP, api } from '@/utils/api'
import { usePathname, useRouter } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'

const Overview = () => {
    const { data, handler } = useContext(ThemeContext)
    const router = useRouter()
    const [users, setUsers] = useState([])
    const [reports, setReports] = useState([])

    useEffect(() => {
        if (data.adminVisible === false) {
            router.push("/messages")
        }
    }, [data.adminVisible])

    useEffect(() => {
        api({ sendToken: true, type: TypeHTTP.GET, path: "/users" })
            .then(users => setUsers(users))
        api({ sendToken: true, type: TypeHTTP.GET, path: "/reports" })
            .then(reports => setReports(reports))
    }, [])

    const handleReported = (reports) => {
        handler.showReported(reports)
    }

    const handleUnBlock = (id) => {
        api({ type: TypeHTTP.PUT, sendToken: true, path: `/users/unblock-all/${id}` })
            .then(res => {
                handler.notify(notifyType.SUCCESS, "Unlocked Account")
                setTimeout(() => {
                    globalThis.window.location.reload()
                }, 1000);
            })
    }

    return (
        <div className='w-full h-screen px-[2rem] py-[1.5rem]'>
            <h3 className='text-[20px] font-medium'>Users</h3>
            <div className='mt-[1rem] overflow-y-auto w-full h-[500px] flex justify-start items-start'>
                <table className='w-full'>
                    <thead className='rounded-xl overflow-hidden'>
                        <tr className='text-[14px] h-[45px] bg-[#e4e4e4] rounded-md'>
                            <th className='font-medium w-[70px]'>Num</th>
                            <th className='font-medium w-[80px]'>Image</th>
                            <th className='font-medium w-[200px]'>Name</th>
                            <th className='font-medium w-[170px]'>Phone Number</th>
                            <th className='font-medium w-[170px]'>Status SignUp</th>
                            <th className='font-medium w-[10%]'>Actions</th>
                        </tr>
                    </thead>
                    <tbody className=''>
                        {users.filter(item => item._id !== data.user?._id).map((user, index) => {
                            return <tr key={index} className='h-[70px]'>
                                <td className='text-center text-[13px]'>
                                    {index + 1}
                                </td>
                                <td className='text-center flex justify-center items-center'>
                                    <img src={user.avatar} width={'45px'} className='rounded-full translate-y-[25%]' />
                                </td>
                                <td className='text-center'>
                                    <span className='text-[13px] w-[200px] font-medium'>{user.fullName}</span>
                                </td>
                                <td className='text-center'>
                                    <span className='text-[13px] w-[170px] font-medium'>{user.phone}</span>
                                </td>
                                <td className='text-center'>
                                    <span className='text-[13px] w-[170px] font-medium'>{user.statusSignUp}</span>
                                </td>
                                <td className='flex justify-center items-center translate-y-[-7px]'>
                                    {user.disable === false ?
                                        <button onClick={() => handler.showBlockForm(user)} className='text-[13px] px-[10px] py-[4px] rounded-lg bg-[red] text-[white] font-medium ml-1'>Lock</button>
                                        :
                                        <button onClick={() => handleUnBlock(user._id)} className='text-[13px] px-[10px] py-[4px] rounded-lg bg-[green] text-[white] font-medium ml-1'>Unlock</button>
                                    }
                                    {reports.filter(item => item.watched === false).map(item => item.toUser._id).includes(user?._id) && <button onClick={() => handleReported(reports.filter(item => item.toUser._id === user._id))} className='text-[13px] px-[10px] py-[4px] rounded-lg bg-[#e5e52c] text-[white] font-medium ml-1'>{`Reported (${reports.filter(item => item.toUser._id === user._id).filter(item => item.watched === false).length})`}</button>}
                                </td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Overview