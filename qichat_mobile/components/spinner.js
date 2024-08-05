import React from 'react'
import { Image, ImageBackground, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import bg from '../assets/bg-vuong.png'

const Spinner = ({ data, setValue, setShow }) => {

    return (
        <View style={{ flexDirection: 'row', borderRadius: 10, gap: 20, padding: 20, justifyContent: 'center', alignItems: 'center', zIndex: 50, backgroundColor: 'white', position: 'absolute' }}>
            {data.map((item, index) =>
                <TouchableOpacity key={index} style={{ borderRadius: 10, overflow: 'hidden' }} onPress={() => { setValue(item.name); setShow(false) }}>
                    <ImageBackground source={bg} style={{ padding: 12, borderRadius: 10, flexDirection: 'row', alignItems: 'center', gap: 5, width: 130 }}>
                        <Image style={{ height: 40, width: 40 }} source={item.icon} />
                        <Text style={{ fontSize: 18, color: 'white', textAlign: 'center', fontWeight: '700' }}>{item.name}</Text>
                    </ImageBackground>
                </TouchableOpacity>
            )}
        </View>
    )
}

export default Spinner