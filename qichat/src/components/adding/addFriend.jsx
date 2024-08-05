'use client'
import React, { useContext, useEffect, useRef, useState } from 'react'
import UserIcon from '../userIcon'
import debounce from 'lodash.debounce'
import { TypeHTTP, api } from '@/utils/api'
import { ThemeContext } from '@/app/context'
import { formatPhoneByFireBase } from '@/utils/call'
import QRCode from 'react-qr-code'

const inputs = {
    GMAIL_INPUT: 'email',
    PHONE_NUMBER_INPUT: 'phone',
    NAME_INPUT: 'name',
    NONE: 'c'
}

const AddFriendPage = () => {

    const [currentInput, setCurrentInput] = useState(inputs.NONE)
    const [query, setQuery] = useState('')
    const [users, setUsers] = useState([])
    const { data, handler } = useContext(ThemeContext)

    useEffect(() => setQuery(''), [currentInput])
    useEffect(debounce(() => {
        api({ type: TypeHTTP.GET, sendToken: true, path: `/users/find-by-${currentInput}/${query === '' ? 'none' : currentInput === inputs.PHONE_NUMBER_INPUT ? formatPhoneByFireBase(query) : query}` })
            .then(result => {
                setUsers(result.filter(user => {
                    if (user._id !== data.user._id && user.statusSignUp === "Complete Sign Up") {
                        return user
                    }
                }))
            })
    }, 300), [query])

    return (
        <div className='w-[78%] border-[#e5e5e5] border-r-[px]'>
            <div className='h-[10%] flex items-center w-full justify-start px-[25px] py-[17px] border-[#e5e5e5] border-b-[px]'>
                <img src='/icon-adding.png' width={'40px'} />
                <span className='font-poppins ml-2 text-[18px] font-bold'>Find Friends</span>
            </div>
            <div className='h-full w-[100%] border-[#e5e5e5] border-t-[1px] pt-[1.5rem] flex'>
                <div className='flex flex-col items-center w-[40%] px-[2rem]'>
                    <div className='w-[65%] flex flex-col gap-2 justify-center items-center aspect-square rounded-lg' style={{ backgroundSize: 'cover', backgroundImage: `url(/bg-vuong.png)` }}>
                        {data.user && <QRCode value={JSON.stringify(data.user?._id)} size={180} />}
                    </div>
                    <div className='mt-[1rem] flex flex-col'>
                        <button onClick={() => setCurrentInput(inputs.NAME_INPUT)} className='mt-2 text-[black] flex items-center gap-3 py-[0.5rem] border-[1px] rounded-lg border-[#8a8a8a] w-[280px] justify-start px-[1rem]'>
                            <i className="fa-solid fa-signature"></i>
                            <span className='font-medium font-poppins text-[15px]'>Add Friend By Name</span>
                        </button>
                        <input onChange={(e) => setQuery(e.target.value)} value={query} style={{ height: currentInput === inputs.NAME_INPUT ? '40px' : '0px', border: currentInput === inputs.NAME_INPUT ? '1px solid #d8d8d8' : '0', marginTop: currentInput === inputs.NAME_INPUT ? '12px' : '0' }} type="text" placeholder='Name' className='transition-all focus:outline-0 text-[15px] shadow-sm w-[280px] rounded-lg px-4' />
                        {/* <button onClick={() => setCurrentInput(inputs.GMAIL_INPUT)} className='mt-2 text-[black] flex items-center gap-3 py-[0.5rem] border-[1px] rounded-lg border-[#8a8a8a] w-[280px] justify-start px-[1rem]'>
                            <i className='bx bxl-gmail'></i>
                            <span className='font-medium font-poppins text-[15px]'>Add Friend By Gmail</span>
                        </button>
                        <input onChange={(e) => setQuery(e.target.value)} value={query} style={{ height: currentInput === inputs.GMAIL_INPUT ? '40px' : '0px', border: currentInput === inputs.GMAIL_INPUT ? '1px solid #d8d8d8' : '0', marginTop: currentInput === inputs.GMAIL_INPUT ? '12px' : '0' }} type="text" placeholder='Gmail' className='transition-all focus:outline-0 text-[15px] shadow-sm w-[280px] rounded-lg px-4' /> */}
                        <button onClick={() => setCurrentInput(inputs.PHONE_NUMBER_INPUT)} className='mt-2 text-[black] flex items-center gap-3 py-[0.5rem] border-[1px] rounded-lg border-[#8a8a8a] w-[280px] justify-start px-[1rem]'>
                            <i className='bx bxs-phone' ></i>
                            <span className='font-medium font-poppins text-[15px]'>Add Friend By Phone Number</span>
                        </button>
                        <input onChange={(e) => setQuery(e.target.value)} value={query} style={{ height: currentInput === inputs.PHONE_NUMBER_INPUT ? '40px' : '0px', border: currentInput === inputs.PHONE_NUMBER_INPUT ? '1px solid #d8d8d8' : '0', marginTop: currentInput === inputs.PHONE_NUMBER_INPUT ? '12px' : '0' }} type="text" placeholder='Phone Number' className='transition-all focus:outline-0 text-[15px] shadow-sm w-[280px] rounded-lg px-4' />
                    </div>
                </div>
                <div className='w-[60%]'>
                    <h2 className='text-[18px] font-poppins font-semibold'>Results</h2>
                    <div className=' relative px-[1rem] flex flex-wrap items-start content-start py-[1rem] gap-4 h-[450px] overflow-y-auto'>
                        {users.length !== 0 ?
                            users.map((user, index) => (
                                <div onClick={() => handler.showUserInformation(user)} key={index} className='flex items-center cursor-pointer '>
                                    <UserIcon avatar={user.avatar} operating={user.operating.status} />
                                    <span className='font-semibold text-[14px] pl-[8px] pr-[15px] '>{user.fullName}</span>
                                    {data.user.friends.map(item => item._id).includes(user._id) &&
                                        (<div className='text-[11px] font-bold px-1 cursor-auto py-1 text-[green] border-[green] border-[2px] rounded-lg'>Friend</div>)
                                    }
                                </div>
                            ))
                            :
                            <div className='font-poppins font-semibold text-[20px] text-[#999] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]'>Not Found Friends</div>
                        }
                    </div>
                </div>
            </div>
        </div >
    )
}

export default AddFriendPage