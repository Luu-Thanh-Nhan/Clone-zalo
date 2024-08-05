import React, { useContext, useEffect, useState } from 'react'
import { Image, ImageBackground, ScrollView, Text, TextInput, TouchableOpacity } from 'react-native'
import { View } from 'react-native-animatable'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import UserIcon from '../components/userIcon';
import { useNavigation, useRoute } from '@react-navigation/native'
import { messageContext } from '../context/messageContext';
import bg from '../assets/bg.webp'
import { globalContext } from '../context/globalContext';
import { returnID, returnImage, returnName, returnRemainingObject } from '../utils/room';
import { tinhSoPhutCham } from '../utils/time';
import { TypeHTTP, api, baseURL, systemID } from '../utils/api';
import { fileTypes } from '../components/messageSection';
import VideoPlayer from '../components/videoPlayer';
import { io } from 'socket.io-client';
import * as FilePicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { Picker } from '@react-native-picker/picker';
import debounce from 'lodash.debounce'
import admin from '../assets/admin.png'
import removeAdmin from '../assets/remove-admin.png'
const socket = io.connect(baseURL)

const MessageInformationScreen = () => {
    const navigation = useNavigation();
    const { data, handler } = useContext(globalContext)
    const { messageData, messageHandler } = useContext(messageContext)
    const [medias, setMedias] = useState([])
    const [files, setFiles] = useState([])
    const [displayFind, setDisplayFind] = useState(false)
    const [currentInput, setCurrentInput] = useState('name')
    const [usersFound, setUsersFound] = useState([])
    const [query, setQuery] = useState('')
    const [participants, setParticipants] = useState([])
    const [groupName, setGroupName] = useState('')
    const [editName, setEditName] = useState(false)

    useEffect(() => {
        if (messageData.currentRoom === undefined) {
            navigation.navigate("MessageScreen")
        }
        else {
            setParticipants(messageData.currentRoom?.users)
        }
    }, [messageData.currentRoom])


    const options = [
        { label: 'Name', value: 'name' },
        { label: 'Phone', value: 'phone' }
    ];

    useEffect(() => setQuery(''), [currentInput])
    useEffect(debounce(() => {
        if (query !== "") {
            api({ type: TypeHTTP.GET, sendToken: true, path: `/users/find-by-${currentInput}/${currentInput === 'phone' ? formatPhoneByFireBase(query) : query}` })
                .then(result => {
                    setUsersFound(result.filter(user => {
                        if (user._id !== data.user._id && user.statusSignUp === "Complete Sign Up") {
                            return user
                        }
                    }))
                })
        } else
            setUsersFound([])
    }, 300), [query])

    useEffect(() => {
        api({ type: TypeHTTP.GET, sendToken: true, path: `/messages/media/${messageData.currentRoom?._id}` })
            .then(media => {
                setMedias(media)
            })
        api({ type: TypeHTTP.GET, sendToken: true, path: `/messages/files/${messageData.currentRoom?._id}` })
            .then(files => {
                setFiles(files)
            })
    }, [messageData.currentRoom])

    const route = useRoute()
    useEffect(() => {
        handler.checkToken(route.name)
            .then(goal => {
                if (goal !== null)
                    navigation.navigate(goal)
            })
    }, [])

    const handleDisbandRoom = () => {
        api({ sendToken: true, type: TypeHTTP.DELETE, path: `rooms/${messageData.currentRoom?._id}` })
            .then(res => {
                messageHandler.setCurrentRoom(undefined)
                messageHandler.setRooms(prev => prev.filter(item => item._id !== messageData.currentRoom?._id))
                const body = {
                    room_id: messageData.currentRoom._id,
                    reply: null,
                    information: ``,
                    typeMessage: 'notify',
                    user_id: systemID,
                    users: messageData.currentRoom?.users.map(item => item._id)
                }
                socket.emit('send_message', body)
                setGroupName('')
                navigation.navigate('MessageScreen')
            })
    }

    const handleLeaveRoom = () => {
        const room = messageData.currentRoom
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
                    messageHandler.setCurrentRoom(undefined)
                    messageHandler.setRooms(rooms)
                    const body = {
                        room_id: messageData.currentRoom._id,
                        reply: null,
                        information: `${data.user?.fullName} had left this room`,
                        typeMessage: 'notify',
                        user_id: systemID,
                        users: messageData.currentRoom?.users.map(item => item._id)
                    }
                    socket.emit('send_message', body)
                    navigation.navigate('MessageScreen')
                })
        }
    }

    const handleSubmit = () => {
        const room = JSON.parse(JSON.stringify(messageData.currentRoom))
        room.users = participants
        api({ type: TypeHTTP.PUT, sendToken: true, path: `/rooms/${data.user?._id}`, body: room })
            .then(newRooms => {
                const currentRoom = newRooms.filter(item => item._id === room._id)[0]
                const usersJoinGroup = currentRoom.users.filter(item => !messageData.currentRoom?.users.map(i => i._id).includes(item._id))
                const leftUsers = messageData.currentRoom.users.filter(user => !currentRoom.users.map(item => item._id).includes(user._id))
                messageHandler.setCurrentRoom(currentRoom)
                messageHandler.setRooms(newRooms)
                setParticipants(currentRoom.users)
                if (usersJoinGroup.length > 0) {
                    const body = {
                        room_id: messageData.currentRoom._id,
                        reply: null,
                        information: `${data.user?.fullName} invited ${usersJoinGroup.map(item => item.fullName).join(', ')} to join the group`,
                        typeMessage: 'notify',
                        user_id: systemID
                    }
                    socket.emit('send_message', body)
                }
                if (leftUsers.length > 0) {
                    const body = {
                        room_id: messageData.currentRoom._id,
                        reply: null,
                        information: `${data.user?.fullName} invited ${leftUsers.map(item => item.fullName).join(', ')} out of the group`,
                        typeMessage: 'notify',
                        user_id: systemID
                    }
                    socket.emit('send_message', body)
                }
                const friendUpdate = [...usersJoinGroup.map(item => item._id), ...leftUsers.map(item => item._id)]
                socket.emit('update-room', friendUpdate)
                socket.emit('update-room', messageData.currentRoom.users.map(item => {
                    if (item._id !== data.user?._id) {
                        return item._id
                    }
                }))
                setDisplayFind(false)
            })
            .catch(error => {
                console.log(error)
            })
    }

    useEffect(() => {
        if (editName === true)
            setGroupName(returnName(messageData.currentRoom, data.user))
    }, [editName])

    const handleUpdateGroupName = () => {
        if (groupName === '')
            return
        const room = messageData.currentRoom
        if (room) {
            room.name = groupName
            api({ type: TypeHTTP.PUT, path: `/rooms/${data.user?._id}`, sendToken: true, body: room })
                .then(rooms => {
                    messageHandler.setCurrentRoom(rooms.filter(item => item._id === messageData.currentRoom._id)[0])
                    messageHandler.setRooms(rooms)
                    const body = {
                        room_id: messageData.currentRoom._id,
                        reply: null,
                        information: `${data.user?.fullName} has renamed the group "${groupName}"`,
                        typeMessage: 'notify',
                        user_id: systemID,
                        users: messageData.currentRoom?.users.map(item => item._id)
                    }
                    socket.emit('send_message', body)
                    socket.emit('update-room', messageData.currentRoom.users.map(item => {
                        if (item._id !== data.user?._id) {
                            return item._id
                        }
                    }))
                    setGroupName('')
                    setEditName(false)
                })
        }
    }

    const pickFile = async () => {

        let result = await FilePicker.getDocumentAsync({
            // multiple: true,
            copyToCacheDirectory: true,
            type: 'image/*'
        })
        if (!result.canceled) {
            const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, {
                encoding: FileSystem.EncodingType.Base64,
            });
            const body = {
                image: {
                    base64,
                    originalname: result.assets[0].name,
                    uri: result.assets[0].uri,
                    mimetype: result.assets[0].mimeType,
                    size: result.assets[0].size
                },
            }
            api({ type: TypeHTTP.PUT, sendToken: true, path: `/rooms/update-image-mobile/${messageData.currentRoom?._id}`, body: body })
                .then(res => {
                    messageHandler.setCurrentRoom({ ...messageData.currentRoom, image: res.image })
                })
        }
    };

    const addDeputy = (user_id, userName) => {
        api({ body: { room_id: messageData.currentRoom._id, user_id }, path: '/rooms/add-deputy', type: TypeHTTP.POST, sendToken: true })
            .then(newRoom => {
                messageHandler.setCurrentRoom(newRoom)
                const body = {
                    room_id: messageData.currentRoom._id,
                    reply: null,
                    information: `${userName} has been appointed deputy head`,
                    typeMessage: 'notify',
                    user_id: systemID
                }
                socket.emit('send_message', body)
                socket.emit('update-room', messageData.currentRoom.users.map(item => {
                    if (item._id !== data.user?._id) {
                        return item._id
                    }
                }))
            })
    }

    const removeDeputy = (user_id, userName) => {
        api({ body: { room_id: messageData.currentRoom._id, user_id }, path: '/rooms/remove-deputy', type: TypeHTTP.POST, sendToken: true })
            .then(newRoom => {
                messageHandler.setCurrentRoom(newRoom)
                const body = {
                    room_id: messageData.currentRoom._id,
                    reply: null,
                    information: `${userName} is no longer deputy manager`,
                    typeMessage: 'notify',
                    user_id: systemID
                }
                socket.emit('send_message', body)
                socket.emit('update-room', messageData.currentRoom.users.map(item => {
                    if (item._id !== data.user?._id) {
                        return item._id
                    }
                }))
            })
    }

    if (displayFind === false)
        return (
            <ScrollView style={{ paddingHorizontal: 15, width: '100%', paddingTop: 30, backgroundColor: 'white', height: '100%' }}>
                <View style={{ position: 'absolute', top: 20, left: 0, zIndex: 10 }}>
                    <TouchableOpacity onPress={() => navigation.navigate('ChatScreen')}>
                        <Icon name='arrow-left' style={{ color: 'black', fontSize: 30, marginRight: 10 }} />
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 9, width: '100%' }}>
                        <View style={{ top: 35 }}>
                            <View style={{ flexDirection: 'column', gap: 5, alignItems: 'center' }}  >
                                <View style={{ position: 'relative' }}>
                                    <UserIcon size={110} avatar={returnImage(messageData.currentRoom, data.user)} />
                                    {messageData.currentRoom?.type === 'Group' && <TouchableOpacity onPress={() => pickFile()} style={{ position: 'absolute', top: 0, right: -10 }}>
                                        <Icon name='pencil' style={{ color: '#999', fontSize: 20 }} />
                                    </TouchableOpacity>}
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                                    {editName ?
                                        <>
                                            <TextInput onChangeText={e => setGroupName(e)} value={groupName} style={{ borderWidth: 1, width: 100, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 10, borderColor: '#999', fontSize: 15 }} />
                                            <TouchableOpacity onPress={() => handleUpdateGroupName()} style={{ backgroundColor: 'green', height: 30, borderRadius: 10, alignItems: 'center', width: 30, flexDirection: 'row', justifyContent: 'center' }}>
                                                <Text style={{ color: 'white', fontSize: 16 }}>
                                                    Save
                                                </Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => setEditName(false)} style={{ backgroundColor: '#ff4848', height: 30, borderRadius: 10, alignItems: 'center', width: 30, flexDirection: 'row', justifyContent: 'center' }}>
                                                <Text style={{ color: 'white', fontSize: 16 }}>
                                                    Quit
                                                </Text>
                                            </TouchableOpacity>
                                        </>
                                        :
                                        <>
                                            <Text style={{ fontSize: 22, fontWeight: 600 }}>{returnName(messageData.currentRoom, data.user)}</Text>
                                            {messageData.currentRoom?.type === 'Group' && <TouchableOpacity onPress={() => setEditName(true)} style={{}}>
                                                <Icon name='pencil' style={{ color: '#999', fontSize: 20 }} />
                                            </TouchableOpacity>}
                                        </>
                                    }
                                </View>
                                <Text style={{ fontSize: 15, fontWeight: '600' }}>{
                                    messageData.currentRoom?.type === 'Single' ?
                                        data.user.friends.map(user => user._id).includes(returnID(messageData.currentRoom, data.user)) ?
                                            returnRemainingObject(messageData.currentRoom, data.user).operating.status === true ?
                                                "Online"
                                                :
                                                `Operated in ${tinhSoPhutCham(returnRemainingObject(messageData.currentRoom, data.user).operating.time) ? tinhSoPhutCham(returnRemainingObject(messageData.currentRoom, data.user).operating.time) : '0 second'} ago`
                                            :
                                            "Stranger"
                                        :
                                        `${messageData.currentRoom?.users.length} Participants`
                                }</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{ marginTop: 35 }}></View>
                {messageData.currentRoom?.type === 'Group' && <View style={{ marginTop: 15 }}>
                    <Text style={{ fontSize: 21, fontWeight: '600' }}>{`Participants (${participants.length})`}</Text>
                    <View style={{ paddingLeft: 10 }}>
                        {participants.map((user, index) => {
                            if (index <= 1) {
                                return <View key={index} style={{ marginVertical: 5, flexDirection: 'row', alignItems: 'center', gap: 7 }}>
                                    <Image source={{ uri: user.avatar }} style={{ height: 50, width: 50, borderRadius: 50 }} />
                                    <View>
                                        <Text style={{ fontSize: 17, fontWeight: 600 }}>{user.fullName}</Text>
                                        <Text>{user._id === messageData.currentRoom?.creator ? 'Admin' : 'Member'}</Text>
                                    </View>
                                </View>
                            }
                        })}
                        <TouchableOpacity style={{ marginVertical: 5, flexDirection: 'row', alignItems: 'center', gap: 7 }}>
                            <Image source={{ uri: '' }} style={{ height: 50, width: 50, borderRadius: 50 }} />
                            <TouchableOpacity onPress={() => setDisplayFind(true)}>
                                <Text style={{ fontSize: 17, fontWeight: 600 }}>{'See All...'}</Text>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    </View>
                </View>}
                <View style={{ marginTop: 15 }}>
                    <Text style={{ fontSize: 22, fontWeight: '600' }}>Attachments</Text>
                    <View style={{ paddingLeft: 10 }}>
                        {files.length === 0 ?
                            <View style={{ flexDirection: 'row', paddingVertical: 20, justifyContent: 'center', width: '100%' }}>
                                <Text style={{ fontSize: 19, fontFamily: 'Poppins' }}>No Files</Text>
                            </View>
                            :
                            files.map((file, index) => {
                                if (file.url.split('___')[0].split('/')[file.url.split('___')[0].split('/').length - 1] !== 'audio' && index >= files.length - 2) {
                                    return <TouchableOpacity onPress={() => navigation.navigate("Read", { url: file.url })} key={index} style={{ flexDirection: 'row', marginTop: 12, alignItems: 'center', gap: 10 }}>
                                        <Image style={{ width: 35, aspectRatio: 1 }} source={fileTypes[file.url.split('___')[0].split('/')[file.url.split('___')[0].split('/').length - 1]]} />
                                        <Text style={{ fontSize: 16, fontWeight: '600' }}>{`${file.name.substring(0, 25)}${file.name.length >= 25 ? '...' : `.${file.url.split('___')[0].split('/')[file.url.split('___')[0].split('/').length - 1]}`}`}</Text>
                                    </TouchableOpacity>
                                }
                            })
                        }
                    </View>
                </View>


                <View style={{ marginTop: 15 }}>
                    <Text style={{ fontSize: 22, fontWeight: '600' }}>Pictures & Videos</Text>
                    <View style={{ flexDirection: 'row', width: '100%', gap: 10, paddingVertical: 10, justifyContent: 'start', flexWrap: 'wrap' }}>
                        {medias.length === 0 ?
                            <View style={{ flexDirection: 'row', paddingVertical: 20, justifyContent: 'center', width: '100%' }}>
                                <Text style={{ fontSize: 19, fontFamily: 'Poppins' }}>No Pictures & Videos</Text>
                            </View>
                            :
                            medias.map((media, index) => {
                                if (index >= medias.length - 4) {
                                    if (media.url.includes("/image___")) {
                                        return <TouchableOpacity onPress={() => navigation.navigate('OverviewMedia', { type: 'media', data: medias })}>
                                            <Image key={index} source={{ uri: media.url }} style={{ width: 90, height: 90, borderRadius: 10 }} />
                                        </TouchableOpacity>
                                    }
                                    if (media.url.includes("/video___")) {
                                        return <TouchableOpacity onPress={() => navigation.navigate('OverviewMedia', { type: 'media', data: medias })} style={{ backgroundColor: '#999', borderRadius: 10, position: 'relative' }}>
                                            <View style={{ height: '100%', width: '100%', position: 'absolute', zIndex: 3 }}></View>
                                            <VideoPlayer key={index} url={media.url} style={{ width: 90, height: 90 }} />
                                        </TouchableOpacity>
                                    }
                                }
                            })
                        }
                    </View>
                </View>
                <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 20 }}>
                    {messageData.currentRoom?.creator === data.user?._id &&
                        <TouchableOpacity onPress={() => handleDisbandRoom()} style={{ backgroundColor: 'black', width: '45%', paddingVertical: 13, borderRadius: 10, flexDirection: 'row', justifyContent: 'center' }}>
                            <Text style={{ color: 'white', fontSize: 16 }}>Disband the group</Text>
                        </TouchableOpacity>
                    }
                    {messageData.currentRoom?.type === 'Group' && (
                        <TouchableOpacity onPress={() => handleLeaveRoom()} style={{ backgroundColor: '#ff4848', width: '45%', paddingVertical: 13, borderRadius: 10, flexDirection: 'row', justifyContent: 'center' }}>
                            <Text style={{ color: 'white', fontSize: 16 }}>Leave Group</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView >

        )
    else
        return (
            <View style={{ width: '100%', height: '100%', backgroundColor: 'white', position: 'relative', flexDirection: 'column', gap: 5, paddingTop: 30, paddingHorizontal: 30 }}>
                <Text style={{ fontSize: 21, marginTop: 10, fontFamily: 'Poppins' }}>Participants</Text>
                {participants.map((user, index) => (
                    <View key={index} style={{ flexDirection: 'row', position: 'relative', alignItems: 'center', gap: 10, marginVertical: 5 }}>
                        <UserIcon avatar={user.avatar} size={50} />
                        <View>
                            <Text style={{ fontSize: 17, fontWeight: '600' }}>{user.fullName}</Text>
                            <Text style={{ fontSize: 14, fontWeight: '400' }}>{user._id === messageData.currentRoom?.creator ? 'Admin' : messageData.currentRoom?.deputies.includes(user._id) ? "Deputy" : "Member"}</Text>
                        </View>
                        <View style={{ position: 'absolute', right: 0, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                            {user._id !== data.user?._id && (participants.map(item => item._id).includes(user._id) ?
                                messageData.currentRoom?.creator === data.user?._id ? (
                                    <>
                                        {(messageData.currentRoom.deputies.includes(user._id)) ?
                                            (
                                                <TouchableOpacity onPress={() => removeDeputy(user._id, user.fullName)}>
                                                    <Image source={removeAdmin} style={{ height: 35, width: 35 }} />
                                                </TouchableOpacity>
                                            )
                                            :
                                            (
                                                <TouchableOpacity onPress={() => addDeputy(user._id, user.fullName)}>
                                                    <Image source={admin} style={{ height: 35, width: 35 }} />
                                                </TouchableOpacity>
                                            )
                                        }
                                        {(messageData.currentRoom?.creator === data.user?._id || (messageData.currentRoom?.deputies.includes(data.user?._id) && !messageData.currentRoom?.deputies.includes(user._id))) && (
                                            <TouchableOpacity onPress={() => setParticipants(participants.filter(item => item._id !== user._id))} style={{ borderWidth: 1, borderColor: '#ff4848', borderRadius: 10 }}>
                                                <Icon name='minus' style={{ fontSize: 20, color: '#ff4848' }} />
                                            </TouchableOpacity>
                                        )}
                                    </>
                                )
                                    :
                                    (<>
                                        {(messageData.currentRoom?.deputies.includes(data.user?._id) && !messageData.currentRoom?.deputies.includes(user._id) && messageData.currentRoom?.creator !== user._id) && (
                                            <TouchableOpacity onPress={() => setParticipants(participants.filter(item => item._id !== user._id))} style={{ borderWidth: 1, borderColor: '#ff4848', borderRadius: 10 }}>
                                                <Icon name='minus' style={{ fontSize: 20, color: '#ff4848' }} />
                                            </TouchableOpacity>
                                        )}
                                    </>)
                                :
                                <TouchableOpacity onPress={() => setParticipants([...participants, user])} style={{ borderWidth: 1, borderColor: 'green', borderRadius: 10, position: 'absolute', right: 0 }}>
                                    <Icon name='plus' style={{ fontSize: 20, color: 'green' }} />
                                </TouchableOpacity>)
                            }
                        </View>
                    </View>
                ))}
                <TouchableOpacity onPress={() => handleSubmit()} style={{ backgroundColor: 'green', marginBottom: 10, width: '100%', paddingVertical: 13, borderRadius: 10, flexDirection: 'row', justifyContent: 'center' }}>
                    <Text style={{ color: 'white', fontSize: 16 }}>Submit</Text>
                </TouchableOpacity>
                <View style={{ borderWidth: 2, borderColor: '#E5E7E9', borderRadius: 10, height: 50, flexDirection: 'row', marginTop: 5, alignItems: 'center', justifyContent: 'space-between' }}>
                    <Picker selectedValue={currentInput} style={{ fontSize: 13, fontWeight: '500', width: '40%', color: '#999' }}
                        onValueChange={(itemValue, itemIndex) => {
                            setCurrentInput(itemValue)
                        }}
                    >
                        {options.map(option => (
                            <Picker key={option.value} label={option.label} value={option.value} />
                        ))}
                    </Picker>
                    <TextInput
                        style={{ fontSize: 15, color: '#999', flex: 1, borderLeftWidth: 2, height: 30, paddingHorizontal: 10, borderColor: '#E5E7E9' }}
                        placeholder={`Find Participant By ${currentInput ? currentInput.charAt(0).toUpperCase() + currentInput.slice(1) : 'Name'}${currentInput === 'name' ? '' : ''}`}
                        value={query}
                        onChangeText={e => setQuery(e)}
                    />
                </View>
                <ScrollView style={{ marginTop: 10 }}>
                    {usersFound.map((user, index) => (
                        <View key={index} style={{ flexDirection: 'row', position: 'relative', alignItems: 'center', gap: 10, marginVertical: 5 }}>
                            <UserIcon avatar={user.avatar} size={50} />
                            <Text style={{ fontSize: 17, fontWeight: '600' }}>{user.fullName}</Text>
                            {user._id !== data.user?._id && (participants.map(item => item._id).includes(user._id) ?
                                messageData.currentRoom?.creator === data.user?._id ?
                                    <TouchableOpacity onPress={() => setParticipants(participants.filter(item => item._id !== user._id))} style={{ borderWidth: 1, borderColor: '#ff4848', borderRadius: 10, position: 'absolute', right: 0 }}>
                                        <Icon name='minus' style={{ fontSize: 20, color: '#ff4848' }} />
                                    </TouchableOpacity>
                                    :
                                    <View style={{ backgroundColor: 'green', position: 'absolute', right: 0, paddingHorizontal: 7, paddingVertical: 4, borderRadius: 5 }}>
                                        <Text style={{ color: 'white', fontSize: 13 }}>Added</Text>
                                    </View>
                                :
                                <TouchableOpacity onPress={() => setParticipants([...participants, user])} style={{ borderWidth: 1, borderColor: 'green', borderRadius: 10, position: 'absolute', right: 0 }}>
                                    <Icon name='plus' style={{ fontSize: 20, color: 'green' }} />
                                </TouchableOpacity>
                            )}
                        </View>
                    ))}
                </ScrollView>
            </View>
        )
}

export default MessageInformationScreen