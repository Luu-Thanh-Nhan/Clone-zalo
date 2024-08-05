'use client'
import { ThemeContext } from "@/app/context";
import { TypeHTTP, api, baseURL } from "@/utils/api";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from 'socket.io-client'
import ParticipantForm from "./forms/participantForm";
import PictureVideo from "./forms/picturevideo";
import Files from "./forms/files";
import { usePathname } from "next/navigation";
const socket = io.connect(baseURL)
export const MessagesContext = createContext();

export const MessageProvider = ({ children }) => {
    const wrapperRef = useRef()
    const [joined, setJoined] = useState(false)
    const [rooms, setRooms] = useState([])
    const [friendsOperation, setFriendsOperation] = useState([])
    const [currentRoom, setCurrentRoom] = useState(undefined)
    const [displayInfo, setDisplayInfo] = useState(false)
    const [messages, setMessages] = useState([])
    const [usersSeen, setUsersSeen] = useState([])
    const { data, handler } = useContext(ThemeContext)
    const [participants, setParticipants] = useState([])
    const [pictureVideos, setPictureVideos] = useState([])
    const [files, setFiles] = useState([])
    const [reply, setReply] = useState()
    const pathName = usePathname()

    useEffect(() => {
        socket.on(`update_seen_${currentRoom?._id}`, (data) => {
            setUsersSeen(data?.users)
        })
        return () => {
            socket.off(`update_seen_${currentRoom?._id}`)
        }
    }, [currentRoom])

    useEffect(() => {
        socket.on(data.user?._id, (data) => {
            setRooms(data)
        })
        return () => {
            socket.off(data.user?._id)
        }
    }, [data.user?._id])

    useEffect(() => {
        if (!rooms.map(item => item._id).includes(currentRoom?._id)) {
            setCurrentRoom(undefined)
        }
    }, [rooms])

    useEffect(() => {
        if (data.user?._id) {
            api({ type: TypeHTTP.GET, sendToken: true, path: `/friends-operating/${data.user?._id}` })
                .then(users => {
                    setFriendsOperation(users)
                })
            socket.on('update-operation-rooms', (body) => {
                if (body.friends_id?.includes(data.user?._id)) {
                    api({ type: TypeHTTP.GET, path: `/rooms/${data.user?._id}`, sendToken: true })
                        .then(rooms => {
                            setCurrentRoom(rooms.filter(item => item._id === currentRoom?._id)[0])
                            setRooms(rooms)
                        })
                }
            })
            socket.on('update-operation-friends', (body) => {
                if (body.friends_id?.includes(data.user?._id)) {
                    api({ type: TypeHTTP.GET, sendToken: true, path: `/friends-operating/${data.user?._id}` })
                        .then(users => setFriendsOperation(users))
                }
            })
        }

        return () => {
            socket.off('update-operation-rooms')
            socket.off('update-operation-friends')
        }
    }, [data.user?._id, currentRoom])

    useEffect(() => {
        if (currentRoom?._id)
            api({ type: TypeHTTP.GET, path: `/get-messages-by-room/${currentRoom?._id}`, sendToken: true })
                .then(messages => {
                    setMessages(messages)
                })
                .catch(error => console.log(error))
    }, [currentRoom, data.user?._id])

    useEffect(() => {
        if (participants.length === 0) {
            wrapperRef.current.style.display = 'none'
        } else {
            wrapperRef.current.style.display = 'block'
        }
    }, [participants])

    useEffect(() => {
        if (pictureVideos.length === 0) {
            wrapperRef.current.style.display = 'none'
        } else {
            wrapperRef.current.style.display = 'block'
        }
    }, [pictureVideos])

    useEffect(() => {
        if (files.length === 0) {
            wrapperRef.current.style.display = 'none'
        } else {
            wrapperRef.current.style.display = 'block'
        }
    }, [files])

    const listData = {
        joined,
        displayInfo,
        rooms,
        currentRoom,
        messages,
        friendsOperation,
        participants,
        pictureVideos,
        reply,
        usersSeen,
        files
    }

    const listHandler = {
        setUsersSeen,
        setJoined,
        setDisplayInfo,
        setRooms,
        setCurrentRoom,
        setMessages,
        setFriendsOperation,
        setParticipants,
        setPictureVideos,
        setReply,
        setFiles
    }

    return (
        <MessagesContext.Provider value={{ listData, listHandler }}>
            <div ref={wrapperRef} onClick={() => { setParticipants([]); setPictureVideos([]), setFiles([]) }} className="wrapper fixed top-0 left-0 hidden w-screen h-screen z-40" />
            <ParticipantForm participants={participants} />
            <PictureVideo pictureVideos={pictureVideos} />
            <Files files={files} />
            {children}
        </MessagesContext.Provider>
    )
}