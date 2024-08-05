import React from 'react'
import { Image, View } from 'react-native'
import avatar from '../assets/avatar.jpg'

const UserIcon = ({ size, avatar, online = false }) => {
    return (
        <View>
            <Image source={{ uri: avatar }} style={{ borderRadius: 55, width: size ? size : 55, height: size ? size : 55, position: 'relative' }} />
            {online === true && <View style={{ height: 15, width: 15, borderRadius: 15, backgroundColor: 'green', position: 'absolute', bottom: 0, right: 0 }}></View>}
        </View>
    )
}

export default UserIcon