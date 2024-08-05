import React, { useContext, useEffect, useState } from 'react'
import { Image, TouchableOpacity, Text, View } from 'react-native'
import UserIcon from '../userIcon'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { globalContext } from '../../context/globalContext';
import { TypeHTTP, api } from '../../utils/api';

const FriendsRequestLayout = () => {

    const { data, handler } = useContext(globalContext)
    const [requests, setRequests] = useState([])

    useEffect(() => {
        api({ type: TypeHTTP.GET, sendToken: true, path: `/requests/${data.user?._id}` })
            .then(res => {
                setRequests(res)
            })
    }, [])

    const handleRefuseRequest = (id) => {
        api({ type: TypeHTTP.DELETE, sendToken: true, path: `/requests/${id}` })
            .then(res => {
                setRequests(res)
                // handler.notify(notifyType.SUCCESS, 'Refuse Request Successfully')
            })
            .catch(error => console.log(error))
    }

    const handleAcceptRequest = (request) => {
        api({ type: TypeHTTP.POST, sendToken: true, path: `/requests/accept-request`, body: { request } })
            .then(res => {
                handler.setUser(res.user)
                setRequests(res.requests)
                // handler.notify(notifyType.SUCCESS, 'Accept Request Successfully')
            })
            .catch(error => console.log(error))
    }

    return (
        <>
            <View>
                <Text style={{ fontWeight: '700', fontSize: 23, marginTop: 20 }}>Requests</Text>
            </View>

            <View>
                {requests.length > 0 ?
                    requests.map((request, index) => (
                        <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                <UserIcon avatar={request.fromUser.avatar} />
                                <Text style={{ fontSize: 18, fontWeight: '600', marginLeft: 10 }}>{request.fromUser.fullName}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                <TouchableOpacity onPress={() => handleAcceptRequest(request)}>
                                    <Icon name='check' style={{ color: 'black', fontSize: 25 }} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleRefuseRequest(request._id)}>
                                    <Icon name='close' style={{ color: 'black', fontSize: 25 }} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                    :
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: '80%' }}>
                        <Text style={{ fontFamily: 'Poppins', fontSize: 18 }}>No Friend Requests</Text>
                    </View>
                }
            </View>
        </>
    )
}

export default FriendsRequestLayout