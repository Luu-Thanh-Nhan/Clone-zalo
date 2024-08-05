import { ThemeContext } from '@/app/context'
import React, { useContext, useEffect, useState } from 'react'
import { MessagesContext } from './messages/context'
import { returnImage, returnName } from '@/utils/room'
import { io } from 'socket.io-client'
import { baseURL } from '@/utils/api'
const socket = io.connect(baseURL)

const FormTransfer = ({ transfer }) => {

    const { data, handler } = useContext(ThemeContext)
    const [rooms, setRooms] = useState([])
    const [message, setMessage] = useState()
    useEffect(() => {
        if (transfer) {
            const { message, rooms } = transfer
            setMessage(message)
            setRooms(rooms)
        }
    }, [transfer])

    const handleTransfer = (room) => {
        const body = {
            room_id: room._id,
            reply: {
                _id: null,
                information: null
            },
            information: message.information,
            typeMessage: message.typeMessage,
            user_id: data.user._id,
            transfer: true,
            users: room.users.map(item => item._id)
        }
        socket.emit('send_message', body)
        setRooms([])
        setMessage(undefined)
        handler.hiddenTransfer()
    }

    return (
        <div style={transfer ? { width: '400px', padding: 20 } : { width: 0, padding: 0 }} className='overflow-hidden transition-all flex flex-col gap-[10px] px-[20px] py-[20px] z-10 fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] min-h-[400px] max-h-[500px] bg-[white] rounded-lg'>
            <h3 className='font-semibold'>Transfer this message to: </h3>
            {rooms.length > 1 ? (
                rooms?.map((room, index) => {
                    if (room._id !== message.room_id) {
                        return (
                            <div key={index} className='flex items-center justify-between gap-[10px] w-full'>
                                <div className='flex items-center gap-[10px]'>
                                    <img src={returnImage(room, data.user)} className='h-[40px] w-[40px] rounded-full' />
                                    <span className='text-[14px]'>{returnName(room, data.user)}</span>
                                </div>
                                <button onClick={() => handleTransfer(room)} className='text-[12px] bg-[green] text-[white] px-[5px] py-[3px] rounded-md'>Send</button>
                            </div>
                        )
                    }
                })
            ) : (
                <span className='font-medium absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]'>Not Found Room</span>
            )}
        </div>
    )
}

export default FormTransfer