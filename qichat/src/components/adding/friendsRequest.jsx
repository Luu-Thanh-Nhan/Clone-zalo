import React, { useContext, useEffect, useState } from 'react'
import UserIcon from '../userIcon'
import axios from 'axios'
import { TypeHTTP, api } from '@/utils/api'
import { ThemeContext } from '@/app/context'

const FriendsRequestPage = () => {

    const { data, handler } = useContext(ThemeContext)
    const [requests, setRequests] = useState([])

    useEffect(() => {
        api({ type: TypeHTTP.GET, sendToken: true, path: `/requests/${data.user?._id}` })
            .then(res => {
                setRequests(res)
            })
    }, [])

    const handleRefuseRequest = (id) => {
        api({ type: TypeHTTP.DELETE, sendToken: true, path: `/requests/${id}` })
            .then(res => {
                setRequests(res)
                handler.notify(notifyType.SUCCESS, 'Refuse Request Successfully')
            })
            .catch(error => console.log(error))
    }

    const handleAcceptRequest = (request) => {
        api({ type: TypeHTTP.POST, sendToken: true, path: `/requests/accept-request`, body: { request } })
            .then(res => {
                handler.setUser(res.user)
                setRequests(res.requests)
                handler.notify(notifyType.SUCCESS, 'Accept Request Successfully')
            })
            .catch(error => console.log(error))
    }

    return (
        <div className='w-[78%] h-screen border-[#e5e5e5] border-r-[1px]'>
            <div className='h-[10%] flex items-center w-full justify-start px-[25px] py-[17px] border-[#e5e5e5] border-b-[px]'>
                <img src='/icon-friend.png' width={'40px'} />
                <span className='font-poppins ml-2 text-[18px] font-bold'>Friends Request</span>
            </div>

            <div className=' h-full relative border-[#e5e5e5] border-t-[1px] py-4'>
                {requests.length !== 0 ?
                    (<>
                        <span className='font-bold text-[20px] font-poppins px-8 '>
                            Requests
                        </span>
                        <div className='flex mt-[20px] w-[100%] flex-wrap overflow-y-auto h-[450px] content-start gap-[1.5rem] px-[2rem]'>
                            {requests.map((item, index) => (
                                <div key={index} className='flex items-center'>
                                    {console.log(item)}
                                    <UserIcon avatar={item.fromUser.avatar} />
                                    <span className='font-semibold text-[13px] px-[7px] '>{item.fromUser.fullName}</span>
                                    <button onClick={() => handleAcceptRequest(item)} className='text-[10px] mr-1 bg-[green] font-poppins py-[6px] px-2 text-[white] rounded-lg font-semibold'>Accept</button>
                                    <button onClick={() => handleRefuseRequest(item._id)} className='text-[10px] bg-[red] font-poppins py-[6px] px-2 text-[white] rounded-lg font-semibold'>Refuse</button>
                                </div>
                            ))}
                        </div>
                    </>)
                    :
                    (<div className='font-poppins font-semibold text-[20px] text-[#999] absolute top-[40%] left-[50%] translate-x-[-50%] translate-y-[-50%]'>No Friend Requests</div>)
                }
            </div>
        </div>
    )
}

export default FriendsRequestPage