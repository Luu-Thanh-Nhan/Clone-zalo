import React, { useContext, useEffect, useState } from 'react'
import { Alert, Image, ImageBackground, Text, TextInput, TouchableOpacity, View } from 'react-native'
import bg from '../assets/bg-dung.jpg'
import banner from '../assets/banner.png'
import Logo from '../components/logo'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native'
import { TypeHTTP, api } from '../utils/api'
import { formatPhoneByFireBase } from '../utils/call'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { globalContext } from '../context/globalContext'
import { signWithGoogle } from '../components/firebase/firebase'
import { useRoute } from '@react-navigation/native';
import authContext from '../context/authContext'

const SignInScreen = () => {

    const navigation = useNavigation();
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const { handler } = useContext(globalContext)

    const route = useRoute()
    useEffect(() => {
        handler.checkToken(route.name)
            .then(goal => {
                if (goal !== null)
                    navigation.navigate(goal)
            })
    }, [])

    const handleSignInWithPhoneNumber = async () => {
        if (!/^\d{10}$/.test(phone)) {
            handler.showAlert('Warning', 'Invalid Phone', () => { }, () => { })
            return
        }
        if (password.length < 6) {
            console.log("Password must be getter than 6 characters")
            return
        }
        api({ body: { phone: formatPhoneByFireBase(phone), password }, path: '/sign-in', type: TypeHTTP.POST, sendToken: false })
            .then(async (res) => {
                if (res.user.statusSignUp === 'Complete Step 1') {
                    handler.setUser(res.user)
                    navigation.navigate('VerificationScreen')
                } else if (res.user.statusSignUp === 'Complete Step 2') {
                    handler.setUser(res.user)
                    navigation.navigate('InformationScreen')
                } else if (res.user.statusSignUp === 'Complete Sign Up') {
                    await AsyncStorage.setItem('accessToken', res.tokens.accessToken)
                    await AsyncStorage.setItem('refreshToken', res.tokens.refreshToken)
                    await AsyncStorage.setItem('user_id', res.user._id)
                    await AsyncStorage.setItem('admin', res.user.admin + '')
                    handler.setUser(res.user)
                    if (res.user.disable === true) {
                        handler.showAlert("Fail", 'This account has been locked')
                        navigation.navigate('Lock')
                    } else {
                        navigation.navigate('MessageScreen')
                    }
                }
            })
            .catch(error => {
                handler.showAlert('Fail', "Invalid Information")
                console.log(error)
            })
    }



    // const handleSignInWithGoogle = () => {
    //     signWithGoogle('sign-in')
    //         .then(async res => {
    //             if (res.user.statusSignUp === 'Complete Step 1') {
    //                 handler.setUser(res.user)
    //                 navigation.navigate('VerificationScreen')
    //             } else if (res.user.statusSignUp === 'Complete Step 2') {
    //                 handler.setUser(res.user)
    //                 navigation.navigate('InformationScreen')
    //             } else if (res.user.statusSignUp === 'Complete Sign Up') {
    //                 await AsyncStorage.setItem('accessToken', res.tokens.accessToken)
    //                 await AsyncStorage.setItem('refreshToken', res.tokens.refreshToken)
    //                 await AsyncStorage.setItem('user_id', res.user._id)
    //                 await AsyncStorage.setItem('admin', res.user.admin + '')
    //                 handler.setUser(res.user)
    //                 navigation.navigate('MessageScreen')
    //             }
    //         })
    // }

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
            <TextInput
                value={phone}
                onChangeText={e => setPhone(e)}
                style={{ marginTop: 20, paddingHorizontal: 15, fontSize: 16, backgroundColor: 'white', borderRadius: 10, width: 300, borderColor: 'white', height: 45, borderWidth: 2 }}
                placeholder='Phone Number' />
            <TextInput
                value={password}
                secureTextEntry={true}
                onChangeText={e => setPassword(e)}
                style={{ marginTop: 7, paddingHorizontal: 15, fontSize: 16, backgroundColor: 'white', borderRadius: 10, width: 300, borderColor: 'white', height: 45, borderWidth: 2 }}
                placeholder='Password' />
            <TouchableOpacity onPress={() => handleSignInWithPhoneNumber()} style={{ marginTop: 10 }}>
                <View style={{ paddingVertical: 7, borderRadius: 10, width: 300, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FF6E6E' }}>
                    <Text style={{ fontSize: 16, fontFamily: 'Poppins', color: 'white' }}>Sign In</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginTop: 15 }} onPress={() => navigation.navigate('ForgetPhone')}>
                <Text style={{ fontFamily: 'Poppins', fontSize: 16, textAlign: 'center', color: 'white' }}>Forgot Password?</Text>
            </TouchableOpacity>
            {/* <View style={{ marginTop: 15 }}>
                <Text style={{ color: 'white', fontSize: 17, fontFamily: 'Poppins' }}>Or</Text>
            </View>
            <TouchableOpacity onPress={() => handleSignInWithGoogle()} style={{ marginTop: 15 }}>
                <View style={{ borderWidth: 2, borderColor: 'white', paddingVertical: 7, borderRadius: 10, width: 300, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <Icon name='gmail' style={{ color: 'white', fontSize: 25, transform: [{ translateY: -1 }], marginRight: 5 }} />
                    <Text style={{ fontSize: 16, fontFamily: 'Poppins', color: 'white' }}>Sign in with Gmail</Text>
                </View>
            </TouchableOpacity> */}
            <TouchableOpacity style={{ marginTop: 5 }} onPress={() => navigation.navigate('SignUpScreen')}>
                <Text style={{ fontFamily: 'Poppins', fontSize: 16, textAlign: 'center', color: 'white' }}>I don't have account</Text>
            </TouchableOpacity>
        </ImageBackground>
    )
}

export default SignInScreen