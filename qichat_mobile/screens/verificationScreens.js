import React, { useContext, useEffect, useRef, useState } from 'react'
import { Image, ImageBackground, Text, TextInput, TouchableOpacity, View } from 'react-native'
import bg from '../assets/bg-dung.jpg'
import banner from '../assets/banner.png'
import Logo from '../components/logo'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { globalContext } from '../context/globalContext'
import { RecaptchaVerifier, reauthenticateWithCredential, signInWithPhoneNumber } from 'firebase/auth'
import { useNavigation, useRoute } from '@react-navigation/native'
import { TypeHTTP, api } from '../utils/api'
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha'
import firebase from 'firebase/compat/app'
import { firebaseConfig } from '../components/firebase/firebase'



const VerificationScreens = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [otp, setOtp] = useState('')
    const { data, handler } = useContext(globalContext)
    const [verification, setVerification] = useState()
    const recaptchaRef = useRef()

    useEffect(() => {
        if (data.user?.email) {
            setEmail(data.user?.email)
        } else if (data.user?.phone) {
            setPhone(data.user?.phone)
        }
    }, [data.user])

    const route = useRoute()
    useEffect(() => {
        handler.checkToken(route.name)
            .then(goal => {
                if (goal !== null)
                    navigation.navigate(goal)
            })
    }, [])

    useEffect(() => {
        if (route.name === "VerificationScreen") {
            if (data.user?.phone) {
                setPhone(data.user.phone);
                const phoneProvider = new firebase.auth.PhoneAuthProvider()
                phoneProvider
                    .verifyPhoneNumber(data.user.phone, recaptchaRef.current)
                    .then(confirmation => setVerification(confirmation))
            } else if (data.user?.email) {
                api({ sendToken: false, path: `/send-verify-code/${data.user.email}`, type: TypeHTTP.POST })
            }
        }
    }, [data.user]);

    const handleSubmitOTPWithPhoneNumber = () => {
        if (otp === '')
            return

        const credential = firebase.auth.PhoneAuthProvider.credential(
            verification, otp
        )
        firebase.auth().signInWithCredential(credential)
            .then(() => {
                api({ type: TypeHTTP.PUT, body: { statusSignUp: 'Complete Step 2' }, path: `/users/${data.user._id}`, sendToken: false })
                    .then(res => {
                        if (res) {
                            handler.setUser(res)
                            navigation.navigate('InformationScreen')
                        }
                    })
            })
    }


    const handleSubmitOTPWithGmail = () => {
        if (otp === '') {
            console.log("Please Enter OTP code")
            return
        }

        api({ type: TypeHTTP.POST, sendToken: false, path: '/verify-gmail', body: { code: otp, email } })
            .then(res => {
                api({ type: TypeHTTP.PUT, body: { statusSignUp: 'Complete Step 2' }, path: `/users/${data.user?._id}`, sendToken: false })
                    .then(res => {
                        if (res) {
                            navigation.navigate('InformationScreen')
                        }
                    })
            })
    }

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
            <Text style={{ color: 'white', fontSize: 20, paddingHorizontal: 30, textAlign: 'center', marginVertical: 10 }}>{`We sent you an authentication code using your ${email ? 'email' : 'phone number'} (${email ? email : phone})`}</Text>
            <FirebaseRecaptchaVerifierModal
                ref={recaptchaRef}
                firebaseConfig={firebaseConfig}
            />
            <TextInput
                value={otp}
                onChangeText={e => setOtp(e)}
                style={{ marginTop: 20, paddingHorizontal: 15, fontSize: 16, backgroundColor: 'white', borderRadius: 10, width: 300, borderColor: 'white', height: 45, borderWidth: 2 }}
                placeholder='Verify Code' />
            <TouchableOpacity onPress={() => { phone ? handleSubmitOTPWithPhoneNumber() : handleSubmitOTPWithGmail() }} style={{ marginTop: 10 }}>
                <View style={{ paddingVertical: 7, borderRadius: 10, width: 300, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FF6E6E' }}>
                    <Text style={{ fontSize: 16, fontFamily: 'Poppins', color: 'white' }}>Submit</Text>
                </View>
            </TouchableOpacity>
        </ImageBackground>
    )
}

export default VerificationScreens