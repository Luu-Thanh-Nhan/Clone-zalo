import React, { useContext } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import UserIcon from '../components/userIcon'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { messageContext } from '../context/messageContext';
import UserMessage from '../components/userMessage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { globalContext } from '../context/globalContext';
import { io } from 'socket.io-client';
import { baseURL } from '../utils/api';
const socket = io.connect(baseURL)

const TransferMessageScreen = () => {
    const { data } = useContext(globalContext)
    const { messageData } = useContext(messageContext)
    const navigation = useNavigation()
    const route = useRoute()
    const message = route.params.message;

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
        navigation.goBack()
    }

    return (
        <View style={{ width: '100%', height: '100%', backgroundColor: 'white', paddingVertical: 30, paddingHorizontal: 10 }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon name='arrow-left' style={{ color: 'black', fontSize: 30, marginRight: 10 }} />
            </TouchableOpacity>
            <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 5, marginHorizontal: 5 }}>
                {messageData.rooms.map((room, index) => {
                    if (room._id !== messageData.currentRoom._id) {
                        return <UserMessage handleTransfer={handleTransfer} key={index} room={room} transfer={true} />
                    }
                })}
            </ScrollView>
        </View>
    )
}

export default TransferMessageScreen