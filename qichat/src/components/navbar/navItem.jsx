'use client'
import { ThemeContext } from '@/app/context'
import { baseURL } from '@/utils/api'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import UserIcon from '../userIcon'
import { formatTime } from '@/utils/time'
const socket = io.connect(baseURL)

const NavItem = ({ icon, path, type, onClick, width, notify }) => {
    const pathname = usePathname()
    const router = useRouter()
    const { data, handler } = useContext(ThemeContext)
    const [visible, setVisible] = useState(false)

    const navigate = () => {
        if (type === 'sign-out') {
            socket.emit('close_operating', { _id: data.user._id, operating: { status: false, time: new Date() } })
            socket.emit('update-room')
            globalThis.localStorage.removeItem('accessToken')
            globalThis.localStorage.removeItem('refreshToken')
            globalThis.localStorage.removeItem('user_id')
            globalThis.localStorage.removeItem('admin')
            router.push('/')
        } else {
            router.push(`${path}`)
        }
    }

    const handleMouseEnter = () => {
        if (notify) {
            setVisible(true)
        }
    }

    const handleMouseLeave = () => {
        setVisible(false)
    }

    return (
        <div onMouseEnter={() => handleMouseEnter()} onMouseLeave={() => handleMouseLeave()} onClick={() => { onClick === false ? () => { } : onClick ? onClick() : navigate() }} style={{ backgroundImage: pathname === path ? 'url(/bg-vuong.png)' : '' }} className='relative cursor-pointer transition-all flex items-center justify-center rounded-full h-[40px] overflow-hidden w-[40px] my-[1px]'>
            <img src={icon} width={width ? width : '70%'} />
            <div style={visible ? { width: '400px', border: '1px solid #d8d8d8', padding: '15px' } : { padding: 0, width: 0, border: 0 }} className='transition-all shadow-2xl fixed left-[55px] top-[50%] flex flex-col translate-y-[-50%] h-[400px] rounded-lg bg-[white] gap-3 z-50 overflow-hidden overflow-y-auto'>
                {notify?.map((item, index) => (
                    <div key={index} className='p-[10px] relative flex flex-col justify-center border-[1px] border-[#e1e1e1] rounded-lg max-h-[200px]'>
                        <span className='font-semibold text-[14px]' >Message from Admin</span>
                        <span className='text-[14px]' key={index}>{item.title}: {item.body}</span>
                        <div style={{ justifyContent: 'start' }} className='gallery flex gap-1 justify-center flex-wrap mt-3 items-center max-h-[200px] overflow-hidden z-0 p-[4px] rounded-lg text-[14px]'>
                            {Array.isArray(item.message?.information) ? item.message?.information.map((item, index) => {
                                if (item.url?.includes('/image___')) {
                                    return <img onClick={() => handler.showImage(item.url)} key={index} src={item.url} className='h-[70%] rounded-xl cursor-pointer max-w-[100%]' />
                                } else if (item.url?.includes('/video___')) {
                                    return <video controls key={index} src={item.url} className='rounded-xl cursor-pointer h-[70%]' />
                                } else if (item.url?.includes('/audio___')) {
                                    return <audio controls key={index} src={item.url} className='rounded-xl cursor-pointer w-[200px] h-[20px]' />
                                } else {
                                    const type = item.url?.split('___')[0].split('/')[item.url?.split('___')[0].split('/').length - 1]
                                    return <a key={index} target='_blank' href={item.url}>
                                        <div className='max-w-[200px] flex justify-around items-center relative'>
                                            <img src={`/${type}.png`} className='w-[28%]' />
                                            <div className='flex flex-col w-[65%] '>
                                                <span className='leading-[22px] text-[13px] font-medium'>{`${item.name}.${type}`.substring(0, 20)}{`${item.name}.${type}`.length > 20 ? '...' : ''}</span>
                                                <span className='leading-[22px] text-[12px] font-semibold'>{`${item.size >= 1024 ? `${(item.size / 1024).toFixed(2)} MB` : `${item.size} KB`}`}</span>
                                            </div>
                                        </div>
                                    </a>
                                }
                            })
                                :
                                <span className='text-[14px]'>{item.message?.information}</span>
                            }
                        </div>
                        <div className='text-[12px] font-medium text-end'>{formatTime(item.time)}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default NavItem