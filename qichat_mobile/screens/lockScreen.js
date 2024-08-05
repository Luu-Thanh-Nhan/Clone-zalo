import React from 'react'
import { Image, Text, View } from 'react-native'
import lock from '../assets/lock.png'
import Menu from '../components/menu'

const LockScreen = () => {
    return (
        <View style={{ backgroundColor: 'white', height: '100%' }}>
            <View style={{ paddingHorizontal: 15, paddingTop: 30, height: '91%' }}></View>
            <View style={{ width: '100%', position: 'absolute', top: '35%' }}>
                <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <Image source={lock} style={{ width: 150, height: 150 }} />
                    <Text style={{ fontSize: 18 }}>Your account has been locked !!!</Text>
                </View>
            </View>
            <Menu />
        </View>
    )
}

export default LockScreen