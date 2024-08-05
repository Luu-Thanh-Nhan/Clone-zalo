import React, { useContext, useEffect, useRef, useState } from 'react'
import { MessagesContext } from './context'
import { returnImage, returnName, returnRemainingObject } from '@/utils/room'
import { ThemeContext, notifyType } from '@/app/context'
import { tinhSoPhutCham } from '@/utils/time'
import { TypeHTTP, api, baseURL, systemID } from '@/utils/api'
import UserIcon from '../userIcon'
import { shuffleArray } from '@/utils/other'
import { io } from 'socket.io-client'
const socket = io.connect(baseURL)

const InformationArea = () => {

    const { listData, listHandler } = useContext(MessagesContext)
    const { data, handler } = useContext(ThemeContext)
    const [medias, setMedias] = useState([])
    const [files, setFiles] = useState([])
    const [groupName, setGroupName] = useState('')
    const imageRef = useRef()

    useEffect(() => {
        if (listData.displayInfo === true) {
            api({ type: TypeHTTP.GET, sendToken: true, path: `/messages/media/${listData.currentRoom?._id}` })
                .then(media => {
                    setMedias(media)
                })
            api({ type: TypeHTTP.GET, sendToken: true, path: `/messages/files/${listData.currentRoom?._id}` })
                .then(files => {
                    setFiles(files)
                })
        }
    }, [listData.displayInfo, listData.currentRoom])

    const handleLeaveRoom = () => {
        const room = listData.currentRoom
        if (room) {
            room.users = room.users.filter(user => user._id !== data.user?._id)
            if (!room.users.map(item => item._id).includes(room.creator)) {
                if (room.deputies?.length > 0) {
                    room.creator = room.deputies[0]
                    room.deputies = room.deputies.filter((item, index) => index !== 0)
                } else
                    room.creator = room.users[room.users?.length - 1]._id
            }
            api({ type: TypeHTTP.PUT, path: `/rooms/${data.user?._id}`, sendToken: true, body: room })
                .then(rooms => {
                    listHandler.setCurrentRoom(undefined)
                    listHandler.setDisplayInfo(false)
                    listHandler.setRooms(rooms)
                    handler.notify(notifyType.SUCCESS, 'Leave Room Successfully!!!')
                    const body = {
                        room_id: listData.currentRoom._id,
                        reply: null,
                        information: `${data.user?.fullName} had left this room`,
                        typeMessage: 'notify',
                        user_id: systemID,
                        users: listData.currentRoom?.users.map(item => item._id)
                    }
                    socket.emit('send_message', body)
                })
        }
    }

    const handleUpdateGroupName = () => {
        if (groupName === '')
            return
        const room = listData.currentRoom
        if (room) {
            room.name = groupName
            api({ type: TypeHTTP.PUT, path: `/rooms/${data.user?._id}`, sendToken: true, body: room })
                .then(rooms => {
                    listHandler.setCurrentRoom(rooms.filter(item => item._id === listData.currentRoom._id)[0])
                    listHandler.setDisplayInfo(false)
                    listHandler.setRooms(rooms)
                    const body = {
                        room_id: listData.currentRoom._id,
                        reply: null,
                        information: `${data.user?.fullName} has renamed the group "${groupName}"`,
                        typeMessage: 'notify',
                        user_id: systemID,
                        users: listData.currentRoom?.users.map(item => item._id)
                    }
                    socket.emit('send_message', body)
                    setGroupName('')
                })
        }
    }

    const handleDisbandRoom = () => {
        api({ sendToken: true, type: TypeHTTP.DELETE, path: `rooms/${listData.currentRoom?._id}` })
            .then(res => {
                listHandler.setCurrentRoom(undefined)
                listHandler.setDisplayInfo(false)
                listHandler.setRooms(prev => prev.filter(item => item._id !== listData.currentRoom?._id))
                const body = {
                    room_id: listData.currentRoom._id,
                    reply: null,
                    information: ``,
                    typeMessage: 'notify',
                    user_id: systemID,
                    users: listData.currentRoom?.users.map(item => item._id)
                }
                socket.emit('send_message', body)
                socket.emit('update-room', listData.currentRoom.users.map(item => {
                    if (item._id !== data.user?._id) {
                        return item._id
                    }
                }))
                setGroupName('')
            })
    }

    const handleUpdateImageGroup = (e) => {
        const file = e.target.files[0]
        const formData = new FormData()
        formData.append('image', file)
        api({ type: TypeHTTP.PUT, sendToken: true, path: `/rooms/update-image/${listData.currentRoom?._id}`, body: formData })
            .then(res => {
                listHandler.setCurrentRoom({ ...listData.currentRoom, image: res.image })
                e.target.value = ""
                const body = {
                    room_id: listData.currentRoom._id,
                    reply: null,
                    information: `${data.user?.fullName} changed image the group`,
                    typeMessage: 'notify',
                    user_id: systemID,
                    users: listData.currentRoom?.users.map(item => item._id)
                }
                socket.emit('send_message', body)
            })
    }

    return (
        <div style={{ width: `${(listData.displayInfo && listData.currentRoom !== undefined) ? '450' : '0'}px`, paddingLeft: (listData.displayInfo && listData.currentRoom !== undefined) && '1rem', paddingRight: (listData.displayInfo && listData.currentRoom !== undefined) && '1rem' }} className='transition-all relative overflow-y-auto h-screen flex flex-col py-[1rem]'>
            <input ref={imageRef} onChange={(e) => handleUpdateImageGroup(e)} type='file' className='hidden' />
            <i onClick={() => listHandler.setDisplayInfo(false)} className='text-[#424242] bx bx-x text-[30px] absolute top-2 cursor-pointer right-2'></i>
            <div className='w-full flex flex-col items-center gap-2'>
                <div className='relative'>
                    <img src={returnImage(listData.currentRoom, data.user)} className='rounded-full w-[100px] h-[100px]' />
                    {listData.currentRoom?.type === 'Group' && <i onClick={() => imageRef.current.click()} className='cursor-pointer bx bx-pencil absolute top-0 right-[-15px] text-[22px] text-[#5f5f5f]' ></i>}
                </div>
                <div className='flex flex-col items-center'>
                    {groupName === '' ?
                        <span className='text-[19px] font-semibold'>
                            {returnName(listData.currentRoom, data.user)}
                            {listData.currentRoom?.type === 'Group' && <i onClick={() => setGroupName(returnName(listData.currentRoom, data.user))} className='cursor-pointer bx bx-pencil ml-2 text-[22px] text-[#5f5f5f]' ></i>}
                        </span>
                        :
                        <div className='flex items-center flex-col gap-1 my-2'>
                            <input value={groupName} onChange={e => setGroupName(e.target.value)} className='border-[#999] border-[2px] h-[32px] rounded-md focus:outline-0 text-[13px] px-2' />
                            <div className='flex gap-1'>
                                <button onClick={() => handleUpdateGroupName()} className='text-[12px] bg-[green] text-[white] px-2 py-1 rounded-md'>Save</button>
                                <button onClick={() => setGroupName('')} className='text-[12px] bg-[red] text-[white] px-2 py-1 rounded-md'>Quit</button>
                            </div>
                        </div>
                    }

                    {listData.currentRoom?.type === 'Group' ?
                        <span className='font-semibold text-[12px]'>{listData.currentRoom?.users.length} Participants</span>
                        :
                        <span className='font-semibold text-[12px]'>{returnRemainingObject(listData.currentRoom, data.user)?.operating.status ? <span className='text-[#3e9042] text-[12px]'>Active Now</span> : `Operated in ${tinhSoPhutCham(returnRemainingObject(listData.currentRoom, data.user)?.operating.time) ? tinhSoPhutCham(returnRemainingObject(listData.currentRoom, data.user).operating.time) : '0 second'} ago`}</span>
                    }
                </div>
            </div>
            {listData.currentRoom?.type === 'Group' && (
                <div className='my-[0.5rem] flex flex-col items-center'>
                    <h2 className='w-full font-semibold font-poppins text-[16px] flex items-center justify-between'>
                        <span>{listData.currentRoom?.users.length} Participants</span>
                        <i onClick={() => listHandler.setParticipants(listData.currentRoom?.users)} className='bx bx-user-plus text-[25px] cursor-pointer'></i>
                    </h2>
                    {listData.currentRoom?.users.map((user, index) => {
                        if (index <= 1) {
                            return <div key={index} className='flex w-full px-4 my-1 items-center '>
                                <UserIcon avatar={user.avatar} operating={user.operating} />
                                <div className='flex flex-col'>
                                    <span className='font-semibold px-[5px] text-[14px]'>{user.fullName}</span>
                                    <span className='font-medium px-[5px] text-[11px]'>{user._id === listData.currentRoom?.creator ? 'Admin' : listData.currentRoom?.deputies.includes(user._id) ? "Deputy" : "Member"}</span>
                                </div>
                            </div>
                        }
                    })}
                    <div onClick={() => {
                        listHandler.setParticipants(listData.currentRoom?.users);
                    }} className='cursor-pointer flex w-full px-4 my-1 items-center '>
                        <UserIcon avatar={'https://cdn3.iconfinder.com/data/icons/zeir-minimalism-1/25/more_dots_three_detail_show-256.png'} />
                        <span className='font-semibold px-[5px] text-[14px]'>{'See All...'}</span>
                    </div>
                </div>
            )
            }
            <div className='my-[5px] flex flex-col items-center'>
                <h2 className='w-full font-semibold font-poppins text-[16px]'>Attachments</h2>
                {files.map((file, index) => {
                    if (file.url.split('___')[0].split('/')[file.url.split('___')[0].split('/').length - 1] !== 'audio' && index >= files.length - 3) {
                        return <a target='_blank' href={file.url} key={index} className='w-full flex items-center gap-2 pl-[1rem] my-[2px]'>
                            <img className='w-[25px]' src={`/${file.url.split('___')[0].split('/')[file.url.split('___')[0].split('/').length - 1]}.png`} />
                            <span className='text-[14px] my-[4px]'>{`${file.name.substring(0, 25)}${file.name.length >= 26 ? '...' : `.${file.url.split('___')[0].split('/')[file.url.split('___')[0].split('/').length - 1]}`}`}</span>
                        </a>
                    }
                })}
                {files.length !== 0 ? <button onClick={() => {
                    listHandler.setFiles(files);
                }} style={{ backgroundImage: 'url(/bg.webp)' }} className='rounded-md text-[white] font-poppins w-[80%] h-[35px] mt-[5px] shadow'>See All</button>
                    :
                    <div className='w-full my-[1.5rem] px-[1rem] flex justify-center font-semibold font-poppins'>
                        No Files
                    </div>
                }
            </div>
            <div className='mt-[0.5rem] flex flex-col items-center'>
                <h2 className='w-full font-semibold font-poppins text-[16px]'>Pictures & Videos</h2>
                {medias.length === 0 ?
                    <div className='w-full my-[10px] px-[1rem] mt-[3rem] flex justify-center font-semibold font-poppins'>
                        No Pictures & Videos
                    </div>
                    :
                    <>
                        <div className='w-full grid grid-cols-4 my-[10px] gap-1 px-[1rem] justify-items-center'>
                            {medias.map((media, index) => {
                                if (index >= medias.length - 8) {
                                    if (media.url.includes('.amazonaws.com/image___')) {
                                        return <div onClick={() => handler.showImage(media.url)} key={index} style={{ backgroundImage: `url(${media.url})`, backgroundSize: 'cover' }} className='cursor-pointer aspect-square w-full rounded-md' />
                                    } else if (media.url.includes('.amazonaws.com/video___')) {
                                        return <div onClick={() => handler.showVideo(media.url)} key={index} style={{ backgroundImage: `url(/bg.webp)`, backgroundSize: 'cover' }} className='cursor-pointer relative overflow-hidden aspect-square w-full rounded-md' >
                                            <video className='w-[100%] translate-y-[-40%] rounded-md' src={media.url} />
                                            <i className='bx text-[40px] text-[white] shadow-2xl bx-play absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]'></i>
                                        </div>
                                    }
                                }
                            })}
                        </div>
                        <button onClick={() => {
                            listHandler.setPictureVideos(medias);
                        }} style={{ backgroundImage: 'url(/bg.webp)' }} className='rounded-md text-[white] font-poppins w-[80%] h-[35px] mt-[5px] shadow'>See All</button>
                    </>
                }
            </div>
            {
                listData.currentRoom?.type === 'Group' &&
                <div className='flex gap-2 mt-[2remxvb]'>
                    {listData.currentRoom?.creator === data.user?._id &&
                        <button onClick={() => handleDisbandRoom()} className='bg-[black] w-full py-2 text-[13px] rounded-md my-3 text-[white]'>
                            Disband the group
                        </button>
                    }
                    <button onClick={() => handleLeaveRoom()} className='bg-[#ff4848] w-full py-2 text-[13px] rounded-md my-3 text-[white]'>
                        Leave Group
                    </button>
                </div>
            }
        </div >
    )
}

export default InformationArea