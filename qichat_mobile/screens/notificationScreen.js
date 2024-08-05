import React, { useContext, useEffect, useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import Menu from '../components/menu'
import { globalContext } from '../context/globalContext'
import { formatTime } from '../utils/time'

const NotificationScreen = () => {

    const { data } = useContext(globalContext)
    const [notifications, setNotifications] = useState([])

    useEffect(() => {
        if (data.user) {
            setNotifications(data.user.notifications)
        }
    }, [data.user])

    return (
        <View style={{ backgroundColor: 'white', height: '100%', paddingVertical: 10 }}>
            <ScrollView style={{ paddingHorizontal: 15, paddingVertical: 30, height: '91%' }}>
                {notifications.map((notification, index) => (
                    <View key={index} style={{ borderWidth: 1, borderColor: '#999', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 10, marginVertical: 5 }}>
                        <Text style={{ fontWeight: '600' }}>Message from Admin</Text>
                        <Text>{notification.title}: {notification.body}</Text>
                        <Text style={{ fontSize: 12, marginTop: 10, textAlign: 'right', fontWeight: '600' }}>{formatTime(notification.time)}</Text>
                    </View>
                ))}
            </ScrollView>
            <Menu />
        </View>
    )
}

export default NotificationScreen