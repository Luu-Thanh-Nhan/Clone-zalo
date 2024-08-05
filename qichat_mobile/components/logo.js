import React from 'react'
import { Image, ImageBackground, Text, View } from 'react-native'
import logo from '../assets/logo.png'

const Logo = () => {
    return (
        <View style={{ zIndex: 1, flexDirection: 'row', fontFamily: 'Poppins', alignItems: 'center' }}>
            <Image source={logo} style={{ width: 60, height: 60 }} />
            <Text style={{ color: 'white', fontSize: 28, fontWeight: 'bold' }}>QiChat</Text>
        </View>
    )
}

export default Logo