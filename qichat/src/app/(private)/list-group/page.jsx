'use client'
import { ThemeContext } from '@/app/context'
import { layouts } from '@/components/adding/context'
import UserIcon from '@/components/userIcon'
import { TypeHTTP, api } from '@/utils/api'
import { useRouter } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'
const ListGroupPage = () => {
    const router = useRouter()
    const [groups, setGroups] = useState([])
    const [rooms, setRooms] = useState([])
    const { data } = useContext(ThemeContext)
    const [nameFilter, setNameFilter] = useState('')
    useEffect(() => {
        api({ type: TypeHTTP.GET, path: `/groups/${data.user?._id}`, sendToken: true })
            .then(rooms => {
                setGroups(rooms)
                setRooms(rooms)
            })
            .catch(error => {
                console.log(error)
            })
    }, [])

    return (
        <section>
            <div className='h-[10%] flex items-center w-full justify-between px-[2rem] py-2 border-[#e5e5e5] border-b-[1px]'>
                <div className='h-full flex items-center'>
                    <span className='font-bold text-[22px] font-poppins mr-[0.5rem]'>List Group</span>
                    <img src='/icon-friends.png' width={'30px'} />
                </div>
                <i onClick={() => {
                    globalThis.localStorage.setItem('adding', layouts.CREATE_GROUP)
                    router.push('/adding')
                }} className='text-[25px] cursor-pointer bx bx-plus text-[#999]' ></i>
            </div>
            <div className='grid grid-cols-4 justify-items-start mt-[40px] w-[100%] gap-[1rem] px-[2rem]'>
                {groups.length === 0 ?
                    <div className='absolute flex gap-1 items-center flex-col top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]'>
                        <span>{"You haven't joined a group yet"}</span>
                        <button onClick={() => {
                            globalThis.localStorage.setItem('adding', layouts.CREATE_GROUP)
                            router.push('/adding')
                        }} style={{ backgroundImage: 'url(/bg.webp)' }} className='w-[150px] text-[white] py-1 px-2 text-[13px] rounded-lg'>Join Now</button>
                    </div>
                    :
                    groups.map((group, index) => {
                        if (nameFilter === '' || group.name.toLowerCase().includes(nameFilter.toLowerCase()))
                            return <div key={index} className='relative flex items-center cursor-pointer my-[6px]'>
                                <UserIcon type={'Group'} avatar={group.image} />
                                <div className='flex flex-col ml-2'>
                                    <span className='text-[14px] font-semibold'>{group.name}</span>
                                    <span className='text-[12px] w-full'>
                                        {`${group.users.length} participants`}
                                    </span>
                                </div>
                            </div>
                    })
                }
            </div>
        </section>
    )
}

export default ListGroupPage