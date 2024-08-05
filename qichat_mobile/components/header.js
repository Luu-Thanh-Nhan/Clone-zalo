import { useNavigation } from '@react-navigation/native'
import React, { useContext } from 'react'
import { TouchableOpacity } from 'react-native'
import { Image, Text, View } from 'react-native'
import message from '../assets/icon-message.png'
import adding from '../assets/icon-adding.png'
import { globalContext } from '../context/globalContext'

const Header = ({ screen }) => {
    const { data } = useContext(globalContext)
    const navigation = useNavigation()

    const screens = [
        { name: "Messages", icon: message },
        { name: "Adding", icon: adding },
        { name: "Search", icon: adding },
    ]

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={screens[screen].icon} style={{ width: 45, height: 45, marginRight: 10 }} />
                <Text style={{ fontSize: 26, fontWeight: 'bold' }}>{screens[screen].name}</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('EditingProfile')}>
                <Image source={{ uri: data.user?.avatar }} style={{ borderRadius: 55, width: 55, height: 55 }} />
            </TouchableOpacity>
        </View>
    )
}

export default Header