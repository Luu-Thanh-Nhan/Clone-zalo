import { ThemeContext, notifyType } from '@/app/context'
import { TypeHTTP, api, baseURL } from '@/utils/api'
import { formatDateOfBirth } from '@/utils/time'
import { useRouter } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
const socket = io.connect(baseURL)

const FormInformation = ({ userInfo }) => {
    const [user, setUser] = useState()
    const { handler, data } = useContext(ThemeContext)
    const [request, setRequest] = useState()

    useEffect(() => {
        setUser(userInfo)
        if (userInfo)
            api({ type: TypeHTTP.POST, sendToken: true, path: '/requests/get-by-2-user', body: { user_id1: userInfo?._id, user_id2: data.user?._id } })
                .then(req => setRequest(req))
    }, [userInfo])


    const handleCreateRequest = (toUser) => {
        const fromUser = {
            _id: data.user._id,
            fullName: data.user.fullName,
            avatar: data.user.avatar
        }
        api({ type: TypeHTTP.POST, body: { toUser, fromUser }, path: '/requests', sendToken: true })
            .then(result => {
                setRequest(result)
                handler.notify(notifyType.SUCCESS, `Sended Request To ${user?.fullName} successfully`)
            })
            .catch(error => {
                console.log(error)
            })
    }

    const handleRefuseRequest = (id) => {
        api({ type: TypeHTTP.DELETE, sendToken: true, path: `/requests/${id}` })
            .then(res => {
                setRequest(undefined)
                handler.notify(notifyType.SUCCESS, 'Refuse Request Successfully')
            })
            .catch(error => console.log(error))
    }

    const handleAcceptRequest = (request) => {
        api({ type: TypeHTTP.POST, sendToken: true, path: `/requests/accept-request`, body: { request } })
            .then(res => {
                handler.setUser(res.user)
                setRequest(undefined)
                handler.notify(notifyType.SUCCESS, 'Accept Request Successfully')
            })
            .catch(error => console.log(error))
    }

    const handleUnfriend = (id1, id2) => {
        const body = {
            user_id_1: id1,
            user_id_2: id2,
        }
        api({ path: '/users/unfriend', body: body, type: TypeHTTP.POST, sendToken: true })
            .then(users => {
                setUser(users[user._id])
                socket.emit("update-room", [id2])
                handler.setUser(users[data.user?._id])
                handler.notify(notifyType.SUCCESS, `Successfully unfriended ${user.fullName}`)
            })
            .catch(error => console.log(error))
    }

    const handleBlock = (id1, id2) => {
        const body = {
            user_block: id1,
            user_id: id2,
        }
        handler.notify(notifyType.LOADING, `Blocking ${user.fullName}`)
        api({ path: '/users/block', body: body, type: TypeHTTP.POST, sendToken: true })
            .then(user => {
                handler.setUser(user)
                socket.emit("update-room", [id2])
                handler.notify(notifyType.SUCCESS, `Successfully blocked ${user.fullName}`)
            })
            .catch(error => console.log(error))
    }

    const handleUnblock = (id1, id2) => {
        const body = {
            user_block: id1,
            user_id: id2,
        }
        handler.notify(notifyType.LOADING, `Unblocking ${user.fullName}`)
        api({ path: '/users/unblock', body: body, type: TypeHTTP.POST, sendToken: true })
            .then(user => {
                handler.setUser(user)
                socket.emit("update-room", [id2])
                handler.notify(notifyType.SUCCESS, `Successfully unblocked ${user.fullName}`)
            })
            .catch(error => console.log(error))
    }

    return (
        <div style={{ width: user ? '400px' : '0', height: user ? 'auto' : '0', paddingBottom: user ? '20px' : 0 }} className='flex flex-col gap-2 overflow-hidden transition-all z-20 fixed top-[50%] bg-[white] rounded-lg shadow-md left-[50%] translate-x-[-50%] translate-y-[-50%]'>
            <div className='relative'>
                <img src='/background-avatar.png' width={'100%'} />
                <img src={user?.avatar} className='left-[20px] translate-y-[-50%] rounded-full absolute' width={'80px'} />
            </div>
            <div className='pl-[110px] flex gap-1'>
                {data.user?.friends.map(item => item._id).includes(user?._id) ?
                    <button className='text-[13px] font-poppins py-[2px] font-semibold px-2 border-[green] border-[2px] rounded-lg text-[green]'>Friend</button>
                    :
                    request ?
                        request.fromUser._id === data.user._id ?
                            <button className='text-[12px] bg-[green] font-poppins py-[6px] px-3 text-[white] rounded-lg font-semibold'>Friend request sent</button>
                            :
                            <div className='flex gap-1'>
                                <button onClick={() => handleAcceptRequest(request)} className='text-[12px] bg-[green] font-poppins py-[6px] px-3 text-[white] rounded-lg font-semibold'>Accept</button>
                                <button onClick={() => handleRefuseRequest(request._id)} className='text-[12px] bg-[red] font-poppins py-[6px] px-3 text-[white] rounded-lg font-semibold'>Refuse</button>
                            </div>
                        :
                        <button onClick={() => handleCreateRequest({ _id: user._id, fullName: user.fullName, avatar: user.avatar })} style={{ backgroundImage: 'url(/bg.webp)' }} className='text-[12px] font-poppins py-[6px] w-[100px] text-[white] rounded-lg font-semibold'>Add Friend</button>
                }
            </div>
            <div className='h-3' />
            <div className='text-[14px] flex px-6'>
                <div className='w-[100px] font-semibold'>Full Name:</div>
                <span className='text-[14px]'>{user?.fullName}</span>
            </div>
            <div className='text-[14px] flex px-6'>
                <div className='w-[100px] font-semibold'>{user?.email ? 'Email:' : 'Phone:'}</div>
                <span className='text-[14px]'>{user?.email ? user?.email : user?.phone}</span>
            </div>
            <div className='text-[14px] flex px-6'>
                <div className='w-[100px] font-semibold'>Date Of Birth:</div>
                <span className='text-[14px]'>{formatDateOfBirth(user?.dateOfBirth)}</span>
            </div>
            <div className='text-[14px] flex px-6'>
                <div className='w-[100px] font-semibold'>Gender:</div>
                <span className='text-[14px]'>{user?.gender}</span>
            </div>
            <div className='text-[14px] flex px-6'>
                <div className='w-[100px] font-semibold'>Bio:</div>
                <span className='text-[14px]'>{user?.bio}</span>
            </div>
            {data.user?.friends.map(item => item._id).includes(user?._id) &&
                <div className='text-[14px] justify-end mt-2 flex px-6 gap-1'>
                    {data.user?.friends.filter(item => item._id === user?._id)[0].block ?
                        <button onClick={() => handleUnblock(data.user?._id, user?._id)} className='text-[13px] font-poppins py-[6px] px-3 text-[white] bg-[#c60707] rounded-lg font-semibold'>Blocked</button>
                        :
                        <button onClick={() => handleBlock(data.user?._id, user?._id)} className='text-[13px] font-poppins py-[6px] px-3 text-[white] bg-[red] rounded-lg font-semibold'>Block</button>
                    }
                    <button onClick={() => handleUnfriend(data.user?._id, user?._id)} className='text-[13px] font-poppins py-[6px] px-3 text-[white] bg-[black] rounded-lg font-semibold'>UnFriend</button>
                </div>
            }
            <i onClick={() => handler.hiddenUserInformation()} className='bx bx-x text-[30px] text-[white] absolute top-1 right-1 cursor-pointer'></i>
        </div>
    )
}

export default FormInformation