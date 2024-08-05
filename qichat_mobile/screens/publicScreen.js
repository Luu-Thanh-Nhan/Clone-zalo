import React, { useContext, useEffect } from 'react'
import { Image, ImageBackground, Text, TouchableOpacity, View } from 'react-native'
import bg from '../assets/bg-dung.jpg'
import banner from '../assets/banner.png'
import Logo from '../components/logo';
import { useNavigation, useRoute } from '@react-navigation/native';
import { globalContext } from '../context/globalContext';

const PublicScreen = () => {

    const navigation = useNavigation();
    const { handler } = useContext(globalContext)

    const route = useRoute()
    useEffect(() => {
        handler.checkToken(route.name)
            .then(goal => {
                if (goal !== null)
                    navigation.navigate(goal)
            })
    }, [])

    return (
        <ImageBackground
            style={{ height: '100%', width: '100%', position: 'relative', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
            source={bg}
        >
            <View style={{ position: 'absolute', top: 40, left: 20 }}>
                <Logo />
            </View>
            <Image
                style={{ width: 300, height: 230 }}
                source={banner} />
            <View style={{ marginTop: 20 }}>
                <Text style={{ fontFamily: 'Poppins', fontSize: 27, textAlign: 'center', color: 'white' }}>It's A Good Platform For Message Sharing</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('SignUpScreen')} style={{ marginTop: 20 }}>
                <View style={{ borderWidth: 2, borderColor: 'white', paddingVertical: 7, borderRadius: 10, paddingHorizontal: 100 }}>
                    <Text style={{ fontSize: 17, fontFamily: 'Poppins', color: 'white' }}>Sign Up</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('SignInScreen')} style={{ marginTop: 15 }}>
                <Text style={{ fontFamily: 'Poppins', fontSize: 16, textAlign: 'center', color: 'white' }}>I’m already using Qichat</Text>
            </TouchableOpacity>
        </ImageBackground>
    )
}

export default PublicScreen