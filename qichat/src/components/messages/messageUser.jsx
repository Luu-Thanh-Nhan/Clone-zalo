import React, { useContext, useEffect, useState } from 'react'
import UserIcon from '../userIcon'
import { MessagesContext } from './context'
import { ThemeContext, notifyType } from '@/app/context'
import { returnID, returnImage, returnName, returnRemainingObject } from '@/utils/room'
import { formatTime } from '@/utils/time'
import { systemID } from '@/utils/api'

const MessageUser = ({ currentRoom }) => {

    const { listHandler, listData } = useContext(MessagesContext)
    const { data, handler } = useContext(ThemeContext)
    const [seen, setSeen] = useState(true)

    useEffect(() => {
        if (currentRoom.lastMessage._id === null) {
            setSeen(true);
        } else {
            if (data.user?._id === currentRoom.lastMessage.user_id) {
                setSeen(true)
            } else {
                const currentUser = currentRoom.users.find(user => user._id === data.user?._id);
                if (currentUser?.seen === currentRoom.lastMessage._id) {
                    setSeen(true);
                } else {
                    setSeen(false);
                }
            }
        }
    }, [currentRoom, data.user]);

    return (
        <div onClick={() => { listHandler.setCurrentRoom(currentRoom) }} className='relative flex items-center w-full cursor-pointer my-[6px]'>
            <UserIcon isStranger={data.user.friends.map(item => item._id).includes(returnID(currentRoom, data.user)) ? false : true} show={(currentRoom.users.length === 2) ? true : false} operating={currentRoom.users.length === 2 && returnRemainingObject(currentRoom, data.user).operating} avatar={returnImage(currentRoom, data.user)} />
            <div className='flex flex-col ml-2'>
                <span className='text-[14px] font-semibold'>{returnName(currentRoom, data.user)}</span>
                <span style={{ fontWeight: seen ? 400 : 600 }} className='text-[12px] w-full'>
                    {`${(currentRoom.lastMessage.user_id === systemID) ? '' : data.user?._id === currentRoom.lastMessage.user_id ? 'You: ' : currentRoom.users.filter(user => user._id === currentRoom.lastMessage.user_id)[0]?.fullName.split(' ')[currentRoom.users.filter(user => user._id === currentRoom.lastMessage.user_id)[0].fullName.split(' ').length - 1] + ':'
                        } ${currentRoom.lastMessage.information?.substring(0, 30)}${currentRoom.lastMessage.information?.length >= 30 ? '...' : ''}`}
                </span>
            </div>
            <span className='absolute bg-red text-[9px] right-0 top-1'>{formatTime(currentRoom.lastMessage.time)}</span>
            {!seen && <div className='bg-[black] h-[10px] rounded-full absolute bottom-1 right-0 w-[10px]' />}
        </div>
    )
}

export default MessageUser