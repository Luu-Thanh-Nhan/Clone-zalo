import React, { useContext, useEffect, useState } from 'react'
import { createContext } from "react";
import { globalContext } from './globalContext';
import { TypeHTTP, api, baseURL } from '../utils/api';
import { io } from 'socket.io-client';
const socket = io.connect(baseURL)

export const messageContext = createContext()

const MessageContext = ({ children }) => {
    const [currentRoom, setCurrentRoom] = useState()
    const [messages, setMessages] = useState([])
    const [reply, setReply] = useState()
    const [rooms, setRooms] = useState([])
    const [usersSeen, setUsersSeen] = useState([])
    const { data } = useContext(globalContext)

    const messageData = {
        currentRoom,
        messages,
        reply,
        rooms,
        usersSeen
    }

    const messageHandler = {
        setCurrentRoom,
        setMessages,
        setReply,
        setRooms,
        setUsersSeen
    }

    useEffect(() => {
        if (!rooms.map(item => item._id).includes(currentRoom?._id)) {
            setCurrentRoom(undefined)
        }
    }, [rooms])

    useEffect(() => {
        socket.on(`update_seen_${currentRoom?._id}`, (data) => {
            setUsersSeen(data?.users)
        })
        return () => {
            socket.off(`update_seen_${currentRoom?._id}`)
        }
    }, [currentRoom])

    useEffect(() => {
        if (data.user?._id) {
            socket.on('update-operation-rooms', (body) => {
                if (body.friends_id?.includes(data.user?._id)) {
                    api({ type: TypeHTTP.GET, path: `/rooms/${data.user?._id}`, sendToken: true })
                        .then(rooms => {
                            setCurrentRoom(rooms.filter(item => item._id === currentRoom?._id)[0])
                            setRooms(rooms)
                        })
                }
            })
        }

        return () => {
            socket.off('update-operation-rooms')
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

    return (
        <messageContext.Provider value={{ messageData, messageHandler }}>
            {children}
        </messageContext.Provider>
    )
}

export default MessageContext