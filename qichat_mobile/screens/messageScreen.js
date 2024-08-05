import React, { useContext, useEffect, useState } from 'react'
import { Image, ImageBackground, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import bg from '../assets/bg.webp'
import UserMessage from '../components/userMessage'
import Menu from '../components/menu'
import message from '../assets/icon-message.png'
import { globalContext } from '../context/globalContext'
import { TypeHTTP, api, baseURL } from '../utils/api'
import { useNavigation, useRoute } from '@react-navigation/native'
import { messageContext } from '../context/messageContext'
import { io } from 'socket.io-client';
import UserIcon from '../components/userIcon'
import Header from '../components/header'
const socket = io.connect(baseURL)

export const options = {
    CHATS: 'a',
    GROUPS: 'b',
    ONLINE: 'c'
}

const MessageScreen = () => {
    const navigation = useNavigation()
    const [currentOption, setCurrentOption] = useState(options.CHATS)
    const { data, handler } = useContext(globalContext)
    const [groups, setGroups] = useState([])
    const [friendsOperation, setFriendsOperation] = useState([])
    const { messageHandler, messageData } = useContext(messageContext)

    const route = useRoute()
    useEffect(() => {
        handler.checkToken(route.name)
            .then(goal => {
                if (goal !== null)
                    navigation.navigate(goal)
            })
    }, [])

    useEffect(() => {
        if (currentOption === options.GROUPS) {
            api({ type: TypeHTTP.GET, path: `/groups/${data.user?._id}`, sendToken: true })
                .then(rooms => {
                    setGroups(rooms)
                })
                .catch(error => {
                    console.log(error)
                })
        }
        else if (currentOption === options.ONLINE) {
            api({ type: TypeHTTP.GET, sendToken: true, path: `/friends-operating/${data.user?._id}` })
                .then(users => setFriendsOperation(users))
        }
    }, [currentOption])

    useEffect(() => {
        api({ sendToken: true, type: TypeHTTP.GET, path: `/rooms/${data.user?._id}` })
            .then(rooms => {
                messageHandler.setRooms(rooms)
            })
    }, [])

    useEffect(() => {
        socket.on('update-operation-rooms', (body) => {
            if (body.friends_id?.includes(data.user?._id)) {
                api({ type: TypeHTTP.GET, path: `/rooms/${data.user?._id}`, sendToken: true })
                    .then(rooms => {
                        messageHandler.setRooms(rooms)
                    })
            }
        })
        return () => {
            socket.off('update-operation-rooms')
        }
    }, [data.user?._id])

    const returnOption = () => {
        if (currentOption === options.CHATS)
            return 'flex-start'
        if (currentOption === options.GROUPS)
            return 'center'
        if (currentOption === options.ONLINE)
            return 'flex-end'
    }

    const navigateToProfile = (user) => {
        navigation.navigate('UserProfile', { user: user });
    };

    return (
        <View style={{ backgroundColor: 'white', height: '100%' }}>
            <View style={{ paddingHorizontal: 15, paddingTop: 30, height: '91%' }}>

                <Header screen={0} />

                <View style={{ position: 'relative', marginTop: 15, flexDirection: 'row', justifyContent: 'center', backgroundColor: '#F0F3F4', borderRadius: 25, height: 50 }}>
                    <View style={{ position: 'absolute', flexDirection: 'row', justifyContent: returnOption(), width: '100%', height: '100%', top: 0, left: 0, borderRadius: 25, overflow: 'hidden' }}>
                        <Image source={bg} style={{ width: '33%', height: '100%', borderRadius: 25 }} />
                    </View>
                    <TouchableOpacity onPress={() => setCurrentOption(options.CHATS)} style={{ width: '33%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontWeight: '700', fontSize: 16, color: currentOption === options.CHATS ? 'white' : 'black' }}>All Chats</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setCurrentOption(options.GROUPS)} style={{ width: '33%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontWeight: '700', fontSize: 16, color: currentOption === options.GROUPS ? 'white' : 'black' }}>Groups</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setCurrentOption(options.ONLINE)} style={{ width: '33%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontWeight: '700', fontSize: 16, color: currentOption === options.ONLINE ? 'white' : 'black' }}>Online</Text>
                    </TouchableOpacity>
                </View>
                {currentOption === options.CHATS ?
                    <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 15, marginHorizontal: 5 }}>
                        {messageData.rooms.length > 0 ?
                            messageData.rooms.map((room, index) => {
                                return <UserMessage key={index} room={room} />
                            })
                            :
                            <Text style={{ width: '100%', fontSize: 15, textAlign: 'center', marginTop: 300 }}>There are no friends yet. Make friends to chat together!</Text>
                        }
                    </ScrollView>
                    :
                    currentOption === options.GROUPS ?
                        <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 15, marginHorizontal: 5 }}>
                            {messageData.rooms.map((group, index) => {
                                if (group.type === 'Group') {
                                    return <TouchableOpacity onPress={() => {
                                        messageHandler.setCurrentRoom(group);
                                        navigation.navigate('ChatScreen')
                                    }} key={index} style={{ width: '100%', fontSize: 18, alignItems: 'center', flexDirection: 'row', gap: 10, justifyContent: 'space-between' }} >
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                            <UserIcon style={{}} type={'Group'} avatar={group.image} />
                                            <Text style={{ fontWeight: 700, fontSize: 18 }} >{group.name}</Text>
                                        </View>
                                        <Text style={{ fontWeight: 650 }}>
                                            {`${group.users.length} participants`}
                                        </Text>
                                    </TouchableOpacity>
                                }

                            })}
                        </ScrollView>
                        :
                        <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 15, marginHorizontal: 5 }}>
                            {friendsOperation.length > 0 ? friendsOperation.map((friend, index) => {
                                return <TouchableOpacity onPress={() => navigateToProfile(friend)} key={index} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginVertical: 3 }}>
                                    <UserIcon avatar={friend.avatar} size={50} online={true} />
                                    <View>
                                        <Text style={{ fontSize: 16, fontWeight: 600 }}>{friend.fullName}</Text>
                                        <Text>{'Online'}</Text>
                                    </View>
                                </TouchableOpacity>
                            })
                                :
                                <Text style={{ width: '100%', fontSize: 15, textAlign: 'center', marginTop: 300 }}>No One Online</Text>
                            }
                        </ScrollView>
                }
            </View >
            <Menu />
        </View>
    )
}

export default MessageScreen