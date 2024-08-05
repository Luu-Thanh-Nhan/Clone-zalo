import React, { useContext, useEffect, useState } from 'react'
import { Image, ImageBackground, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import bgav from '../assets/background-avatar.png'
import avatar from '../assets/avatar.jpg'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { globalContext } from '../context/globalContext';
import { TypeHTTP, api } from '../utils/api'
import { useNavigation, useRoute } from '@react-navigation/native'
import { formatDateOfBirth } from '../utils/time'


const UserProfileScreen = () => {
    const route = useRoute()
    const [user, setUser] = useState()
    const { handler, data } = useContext(globalContext)
    const [request, setRequest] = useState()
    const navigation = useNavigation();
    const userInfo = route.params.user
    const pathName = route.params.pathName


    useEffect(() => {
        setUser(userInfo)
        if (userInfo)
            api({ type: TypeHTTP.POST, sendToken: true, path: '/requests/get-by-2-user', body: { user_id1: userInfo?._id, user_id2: data.user?._id } })
                .then(req => setRequest(req))
    }, [userInfo])

    useEffect(() => {
        if (route.params.user._id) {
            api({
                type: TypeHTTP.GET,
                path: `/users/${route.params.user._id}`,
                sendToken: true
            })
                .then(response => {
                    setUser(response);
                })
        }
    }, [route.params.user._id]);

    const goBack = () => {
        setRequest(undefined)
        if (pathName) {
            navigation.navigate(pathName)
        } else
            navigation.goBack();
    };
    const handleRefuseRequest = (id) => {
        api({ type: TypeHTTP.DELETE, sendToken: true, path: `/requests/${id}` })
            .then(res => {
                setRequest(undefined)
                // handler.notify(notifyType.SUCCESS, 'Refuse Request Successfully')
            })
            .catch(error => console.log(error))
    }

    const handleAcceptRequest = (request) => {
        api({ type: TypeHTTP.POST, sendToken: true, path: `/requests/accept-request`, body: { request } })
            .then(res => {
                handler.setUser(res.user)
                setRequest(undefined)
                // handler.notify(notifyType.SUCCESS, 'Accept Request Successfully')
            })
            .catch(error => console.log(error))
    }

    const handleCreateRequest = (toUser) => {
        const fromUser = {
            _id: data.user._id,
            fullName: data.user.fullName,
            avatar: data.user.avatar
        }
        api({ type: TypeHTTP.POST, body: { toUser, fromUser }, path: '/requests', sendToken: true })
            .then(result => {
                console.log(result)
                setRequest(result)
                handler.notify(notifyType.SUCCESS, `Sended Request To ${user?.fullName} successfully`)
            })
            .catch(error => {
                console.log(error)
            })
    }



    const handleUnfriend = (id1, id2) => {
        const body = {
            user_id_1: id1,
            user_id_2: id2,
        }
        api({ path: '/users/unfriend', body: body, type: TypeHTTP.POST, sendToken: true })
            .then(users => {
                setUser(users[user._id])
                handler.setUser(users[data.user?._id])
                // handler.notify(notifyType.SUCCESS, `Successfully unfriended ${user.fullName}`)
            })
            .catch(error => console.log(error))
    }

    const handleBlock = (id1, id2) => {
        const body = {
            user_block: id1,
            user_id: id2,
        }
        // handler.notify(notifyType.LOADING, `Blocking ${user.fullName}`)
        api({ path: '/users/block', body: body, type: TypeHTTP.POST, sendToken: true })
            .then(user => {
                handler.setUser(user)
                // handler.notify(notifyType.SUCCESS, `Successfully blocked ${user.fullName}`)
            })
            .catch(error => console.log(error))
    }

    const handleUnblock = (id1, id2) => {
        const body = {
            user_block: id1,
            user_id: id2,
        }
        // handler.notify(notifyType.LOADING, `Unblocking ${user.fullName}`)
        api({ path: '/users/unblock', body: body, type: TypeHTTP.POST, sendToken: true })
            .then(user => {
                handler.setUser(user)
                // handler.notify(notifyType.SUCCESS, `Successfully unblocked ${user.fullName}`)
            })
            .catch(error => console.log(error))
    }
    return (
        <View style={{ gap: 15, overflow: 'hidden', width: '100%', height: 'auto', paddingBottom: 20, zIndex: 20, position: 'absolute', borderRadius: 10 }} >

            <View style={{ position: 'relative' }}>
                <Image source={bgav} style={{ width: '100%', height: 120 }} />
                <Image source={{ uri: user?.avatar }} style={{ position: 'absolute', left: 20, borderRadius: 100, transform: [{ translateY: 80 }], width: 100, height: 100, shadowColor: '#000', backgroundColor: 'white' }}></Image>
            </View>
            <View style={{ paddingLeft: 130, flexDirection: 'row', position: 'relative', top: -2 }}>
                {data.user?.friends.map(item => item._id).includes(user?._id) ?
                    <View style={{ paddingVertical: 2, paddingHorizontal: 5, borderColor: 'green', borderWidth: 2, borderRadius: 7, color: 'green' }}>
                        <Text style={{ fontSize: 15, fontFamily: 'Poppins', fontWeight: '800', color: 'green' }}>Friend</Text>
                    </View>
                    :
                    request ?
                        request.fromUser._id === data.user._id ?
                            <View style={{ fontSize: 12, fontFamily: 'Poppins', backgroundColor: 'green', paddingVertical: 6, paddingHorizontal: 12, color: 'white', borderRadius: 10, paddingVertical: 10 }}>
                                <Text style={{ color: 'white', fontWeight: 600 }}>Friend request sent</Text>
                            </View>
                            :
                            <View style={{ flexDirection: 'row', gap: 5 }}>
                                <TouchableOpacity onPress={() => handleAcceptRequest(request)} style={{ fontSize: 12, fontFamily: 'Poppins', backgroundColor: 'green', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 10 }}>
                                    <Text style={{ color: 'white', fontWeight: 600 }}>Accept</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleRefuseRequest(request._id)} style={{ fontSize: 12, fontFamily: 'Poppins', backgroundColor: 'red', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 10 }}>
                                    <Text style={{ color: 'white', fontWeight: 600 }}>Refuse</Text>
                                </TouchableOpacity>
                            </View>
                        :
                        <TouchableOpacity onPress={() => handleCreateRequest({ _id: user._id, fullName: user.fullName, avatar: user.avatar })} style={{ fontSize: 12, fontFamily: 'Poppins', backgroundColor: 'green', paddingVertical: 6, paddingHorizontal: 12, color: 'white', borderRadius: 10, paddingVertical: 10 }} >
                            <Text style={{ color: 'white', fontWeight: 600 }}>Add Friend</Text>
                        </TouchableOpacity>
                }
            </View>

            <View style={{ height: 10 }} />
            <View style={{ flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 5 }}>
                <Text style={{ paddingRight: 10, fontSize: 17, width: 'auto', fontWeight: 'bold' }}>Full Name:</Text>
                <Text style={{ fontSize: 17 }}>{user?.fullName}</Text>
            </View>
            <View style={{ flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 5 }}>
                <Text style={{ paddingRight: 10, fontSize: 17, width: 'auto', fontWeight: 'bold' }}>{user?.email ? 'Email:' : 'Phone:'}</Text>
                <Text style={{ fontSize: 17 }}>{user?.email ? user?.email : user?.phone}</Text>
            </View>
            <View style={{ flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 5 }}>
                <Text style={{ paddingRight: 10, fontSize: 17, width: 'auto', fontWeight: 'bold' }}>Date Of Birth:</Text>
                <Text style={{ fontSize: 17 }}>{formatDateOfBirth(user?.dateOfBirth)}</Text>
            </View>
            <View style={{ flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 5 }}>
                <Text style={{ paddingRight: 10, fontSize: 17, width: 'auto', fontWeight: 'bold' }}>Gender:</Text>
                <Text style={{ fontSize: 17 }}>{user?.gender}</Text>
            </View>
            <View style={{ flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 5 }}>
                <Text style={{ paddingRight: 10, fontSize: 17, width: 'auto', fontWeight: 'bold' }}>Bio:</Text>
                <Text style={{ fontSize: 17 }}>{user?.bio}</Text>
            </View>
            {
                data.user?.friends.map(item => item._id).includes(user?._id) &&
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8, paddingHorizontal: 15, gap: 5 }} >
                    {data.user?.friends.filter(item => item._id === user?._id)[0].block ?
                        <TouchableOpacity onPress={() => handleUnblock(data.user?._id, user?._id)} style={{ fontSize: 18, fontFamily: 'Poppins', paddingVertical: 6, paddingHorizontal: 12, color: 'white', backgroundColor: 'brown', borderRadius: 10, paddingVertical: 8 }}>
                            <Text style={{ color: 'white', fontWeight: 500, fontSize: 16 }}>UnBlock</Text>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity onPress={() => handleBlock(data.user?._id, user?._id)} style={{ fontSize: 18, fontFamily: 'Poppins', paddingVertical: 6, paddingHorizontal: 12, color: 'white', backgroundColor: 'red', borderRadius: 10, paddingVertical: 8 }}>
                            <Text style={{ color: 'white', fontWeight: 500, fontSize: 16 }}>Block</Text>
                        </TouchableOpacity>
                    }
                    <TouchableOpacity onPress={() => handleUnfriend(data.user?._id, user?._id)} style={{ fontSize: 18, fontFamily: 'Poppins', paddingVertical: 6, paddingHorizontal: 12, color: 'white', backgroundColor: 'black', borderRadius: 10, paddingVertical: 8 }}>
                        <Text style={{ color: 'white', fontWeight: 500, fontSize: 16 }}>
                            UnFriend
                        </Text>
                    </TouchableOpacity>
                </View>
            }
            <TouchableOpacity onPress={goBack} style={{ position: 'absolute', top: 30, left: 10, zIndex: 22 }} >
                <Icon name='arrow-left' style={{ color: 'white', fontSize: 30, marginRight: 10 }} />
            </TouchableOpacity>

        </View >
    )
}

export default UserProfileScreen