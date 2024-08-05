'use client'
import dynamic from 'next/dynamic'
const VideoRoom = dynamic(() => import('@/components/call/videoRoom'), { ssr: false });
import { MessagesContext, ProviderContext } from '@/components/messages/context'
import LeftSection from '@/components/messages/leftSection'
import RightSection from '@/components/messages/rightSection'
import React, { useContext, useEffect } from 'react'
import { ThemeContext } from '@/app/context';
import { TypeHTTP, api } from '@/utils/api';

const MesagesPage = () => {

    const { listData, listHandler } = useContext(MessagesContext)
    useEffect(() => {
        const id = globalThis.localStorage.getItem('userForCurrentRoom')
        if (id) {
            const room = listData.rooms.filter(item => {
                if (item.type === 'Single') {
                    if (item.users.map(i => i._id).includes(id)) {
                        return item
                    }
                }
            })[0]
            if (room) {
                listHandler.setCurrentRoom(room)
                globalThis.localStorage.removeItem('room_id')
            }
        }
    }, [listData.rooms])


    return (
        <section className='flex h-full'>
            {!listData.joined ?
                (<>
                    <LeftSection />
                    <RightSection />
                </>)
                :
                (<VideoRoom />)
            }
        </section>
    )
}

export default MesagesPage