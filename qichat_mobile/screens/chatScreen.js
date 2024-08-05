import React, { useContext, useEffect, useRef, useState } from 'react'
import { Image, Pressable, ScrollView, Text, TextInput, TouchableOpacity } from 'react-native'
import { View } from 'react-native-animatable'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import UserIcon from '../components/userIcon';
import MessageSection from '../components/messageSection';
import { useNavigation, useRoute } from '@react-navigation/native'
import { messageContext } from '../context/messageContext';
import { globalContext } from '../context/globalContext';
import { returnID, returnImage, returnName, returnRemainingObject } from '../utils/room';
import { tinhSoPhutCham } from '../utils/time';
import * as FilePicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { io } from 'socket.io-client';
import { TypeHTTP, api, baseURL } from '../utils/api';
import Recorder from '../components/recorder';
const socket = io.connect(baseURL)

const types = {
    TEXT: 'text',
    FILE: 'file'
}

const ChatScreen = () => {
    const messageRef = useRef()
    const [information, setInformation] = useState('')
    const { messageData, messageHandler } = useContext(messageContext)
    const { data, handler } = useContext(globalContext)
    const [files, setFiles] = useState([])
    const navigation = useNavigation();
    const [record, setRecord] = useState(false)
    const [displayEmoji, setDisplayEmoji] = useState('')
    const [updateSeen, setUpdateSeen] = useState(false)
    const [sentFile, setSentFile] = useState(false)

    useEffect(() => {
        let updated = false
        if (messageData.currentRoom && messageData.messages.length > 1) {
            const user = messageData.currentRoom.users.filter(item => item._id === data.user?._id)[0]
            if (messageData.currentRoom._id === messageData.messages[0].room_id) {
                if (user.seen !== messageData.messages[messageData.messages.length - 1]._id) {
                    socket.emit('update_seen', {
                        room_id: messageData.currentRoom._id, user_id: data.user?._id, seen: messageData.messages[messageData.messages.length - 1]._id, users: messageData.currentRoom.users.map(item => {
                            if (item._id !== data.user?._id) {
                                return item._id
                            }
                        })
                    })
                } else {
                    messageHandler.setUsersSeen(messageData.currentRoom.users)
                }
            }
        }
        if (updated === false)
            messageHandler.setUsersSeen(messageData.currentRoom?.users)
    }, [messageData.messages, messageData.currentRoom, sentFile])


    const route = useRoute()
    useEffect(() => {
        handler.checkToken(route.name)
            .then(goal => {
                if (goal !== null)
                    navigation.navigate(goal)
            })
    }, [])

    useEffect(() => {
        if (files.length > 0) {
            if (!files.map(item => item.mimetype)[0].includes('mp3')) {
                sendMessage()
            }
        }
    }, [files.length])

    useEffect(() => {
        socket.on(messageData.currentRoom?._id, (messages) => {
            if (messageData.currentRoom?._id === messages[0].room_id) {
                messageHandler.setMessages(messages)
            }
        })
        return () => {
            socket.off(messageData.currentRoom?._id);
        }
    }, [socket, messageData.currentRoom])

    useEffect(() => {
        if (messageData.currentRoom === undefined) {
            navigation.navigate("MessageScreen")
        }
    }, [messageData.currentRoom])

    useEffect(() => {
        try {
            if (messageRef.current !== null) {
                setTimeout(() => {
                    messageRef.current.scrollToEnd({ animated: true });
                }, 500);
            }
        } catch (error) {

        }
    }, [messageData.messages?.length])


    const sendMessage = () => {
        if (files.length === 0) {
            if (information.trim() !== '') {
                const body = {
                    room_id: messageData.currentRoom._id,
                    reply: {
                        _id: messageData.reply ? messageData.reply?._id : null,
                        information: messageData.reply ? messageData.reply?.information : null
                    },
                    information,
                    typeMessage: 'text',
                    user_id: data.user._id,
                    users: messageData.currentRoom?.users.map(item => item._id)
                }
                socket.emit('send_message', body)
                messageHandler.setMessages([...messageData.messages, body])
                setInformation('')
                messageHandler.setReply(undefined)
            }
        } else {
            try {
                const body = {
                    room_id: messageData.currentRoom._id,
                    reply: {
                        _id: messageData.reply ? messageData.reply?._id : null,
                        information: messageData.reply ? messageData.reply?.information : null
                    },
                    information: files,
                    typeMessage: 'file',
                    user_id: data.user._id,
                    users: messageData.currentRoom?.users.map(item => item._id)
                }
                const load = { ...body, typeMessage: 'loading' }
                messageHandler.setMessages([...messageData.messages, load])
                api({ body: body, path: '/messages-mobile', type: TypeHTTP.POST, sendToken: true })
                    .then(res => {
                        socket.emit('update-message', { room_id: messageData.currentRoom._id, information: files.length, user_id: data.user?._id, users: messageData.currentRoom?.users.map(item => item._id), _id: res._id })
                        setInformation('')
                        setSentFile(!sentFile)
                        messageHandler.setReply(undefined)
                    })
            } catch (error) {
                console.log(error)
            }
        }
        setFiles([])
        setUpdateSeen(!updateSeen)
        setRecord(false)
    }

    const pickFile = async () => {
        let result = await FilePicker.getDocumentAsync({
            // multiple: true,
            copyToCacheDirectory: true,
            // type
        })
        if (!result.canceled) {
            const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, {
                encoding: FileSystem.EncodingType.Base64,
            });
            setFiles([...files, {
                base64,
                originalname: result.assets[0].name,
                uri: result.assets[0].uri,
                mimetype: result.assets[0].mimeType,
                size: result.assets[0].size
            }])
        }
    };
    const handleBackScreen = () => {
        api({ sendToken: true, type: TypeHTTP.GET, path: `/rooms/${data.user?._id}` })
            .then(rooms => {
                messageHandler.setRooms(rooms)
                navigation.navigate('MessageScreen')
            })
    }

    return (
        <Pressable onPress={() => setDisplayEmoji('')} style={{ paddingHorizontal: 15, width: '100%', paddingTop: 30, backgroundColor: 'white', height: '100%' }}>
            <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'space-between', height: '8%' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => handleBackScreen()}>
                        <Icon name='arrow-left' style={{ color: 'black', fontSize: 30, marginRight: 5 }} />
                    </TouchableOpacity>
                    <UserIcon online={returnRemainingObject(messageData.currentRoom, data.user)?.operating?.status} size={45} avatar={returnImage(messageData.currentRoom, data.user)} />
                    <View style={{ marginLeft: 5 }}>
                        <Text style={{ fontSize: 16, fontWeight: 600 }}>{returnName(messageData.currentRoom, data.user)}</Text>
                        <Text style={{ fontSize: 13, marginLeft: 3 }}>
                            {messageData.currentRoom?.type === 'Single' ?
                                data.user.friends.map(user => user._id).includes(returnID(messageData.currentRoom, data.user)) ?
                                    returnRemainingObject(messageData.currentRoom, data.user)?.operating?.status === true ?
                                        "Online"
                                        :
                                        `Operated in ${tinhSoPhutCham(returnRemainingObject(messageData.currentRoom, data.user)?.operating.time) ? tinhSoPhutCham(returnRemainingObject(messageData.currentRoom, data.user)?.operating.time) : '0 second'} ago`
                                    :
                                    "Stranger"
                                :
                                `${messageData.currentRoom?.users.length} Participants`
                            }
                        </Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {/* <Icon name='phone-outline' style={{ color: 'black', fontSize: 26, marginRight: 5 }} />
                    <Icon name='video-outline' style={{ color: 'black', fontSize: 33, marginRight: 5 }} /> */}
                    <TouchableOpacity onPress={() => navigation.navigate('MessageInformationScreen')}>
                        <Icon name='information-outline' style={{ color: 'black', fontSize: 30, marginRight: 5 }} />
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView ref={messageRef} showsVerticalScrollIndicator={false} style={{ height: '80%', }}>
                {messageData.messages.map((message, index) => {
                    return message.user_id === data.user._id ?
                        <MessageSection id={message._id} message={message} displayEmoji={displayEmoji} setDisplayEmoji={setDisplayEmoji} disabled={message.disabled} key={index} style={'flex-end'} information={message.information} />
                        :
                        <MessageSection id={message._id} message={message} displayEmoji={displayEmoji} setDisplayEmoji={setDisplayEmoji} disabled={message.disabled} key={index} avatar={message.user?.avatar} style={'flex-start'} information={message.information} />
                })}
            </ScrollView>
            {record === true ?
                <View style={{ marginTop: 5, zIndex: 1, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    {messageData.reply && <View style={{ position: 'absolute', flexDirection: 'row', zIndex: -1, alignItems: 'center', paddingHorizontal: 20, height: 30, backgroundColor: '#F4F4F4', top: -30, left: 0, borderRadius: 25 }}>
                        <Text>Reply: {messageData.reply.information}</Text>
                    </View>}
                    <Recorder files={files} sendMessage={sendMessage} setFiles={setFiles} setRecord={setRecord} />
                </View>
                :
                <View style={{ marginBottom: 15, marginTop: 5, zIndex: 1, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    {messageData.reply && <View style={{ position: 'absolute', flexDirection: 'row', zIndex: -1, alignItems: 'center', paddingHorizontal: 20, height: 30, backgroundColor: '#F4F4F4', top: -30, left: 0, borderRadius: 25 }}>
                        <Text>Reply: {messageData.reply.information}</Text>
                    </View>}
                    <TouchableOpacity onPress={() => setRecord(true)} style={{ position: 'absolute', left: 15, top: 10, zIndex: 1, marginRight: 5 }}>
                        <Icon name='microphone-outline' style={{ color: '#999', fontSize: 26 }} />
                    </TouchableOpacity>
                    <TextInput onChangeText={e => setInformation(e)} value={information} placeholder='Type your message...' style={{ paddingLeft: 40, paddingRight: 73, fontSize: 15, height: 45, width: '98%', backgroundColor: '#F4F4F4', borderRadius: 25 }} />
                    <View style={{ position: 'absolute', top: 10, right: 10, flexDirection: 'row' }}>
                        <TouchableOpacity onPress={pickFile}>
                            <Icon name='attachment' style={{ zIndex: 1, color: '#999', fontSize: 26, marginRight: 5, }} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => sendMessage()}>
                            <Icon name='send' style={{ zIndex: 1, color: '#999', fontSize: 26, marginRight: 5 }} />
                        </TouchableOpacity>
                    </View>
                </View>
            }
        </Pressable >
    )
}

export default ChatScreen