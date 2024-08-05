import React, { useEffect, useRef, useState } from 'react'
import { Image, ImageBackground, Text, TextInput, TouchableOpacity, View } from 'react-native'
import bg from '../assets/bg-dung.jpg'
import banner from '../assets/banner.png'
import Logo from '../components/logo'
import { firebaseConfig } from '../components/firebase/firebase'
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha'
import firebase from 'firebase/compat/app'
import { steps } from './forgetPhoneScreen'

const VerificationPhone = ({ setCurrentStep, user }) => {

    const [verification, setVerification] = useState()
    const [otp, setOtp] = useState('')
    const recaptchaRef = useRef()

    useEffect(() => {
        const phoneProvider = new firebase.auth.PhoneAuthProvider()
        phoneProvider
            .verifyPhoneNumber(user.phone, recaptchaRef.current)
            .then(confirmation => setVerification(confirmation))
    }, [user]);

    const handleSubmitOTPWithPhoneNumber = () => {
        if (otp === '') {
            console.log("Please Enter OTP")
            return
        }

        const credential = firebase.auth.PhoneAuthProvider.credential(
            verification, otp
        )
        firebase.auth().signInWithCredential(credential)
            .then(() => {
                setCurrentStep(steps.UPDATINGPASSWORD)
            })
            .catch(() => {

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
            <FirebaseRecaptchaVerifierModal
                ref={recaptchaRef}
                firebaseConfig={firebaseConfig}
            />
            <TextInput
                value={otp}
                onChangeText={e => setOtp(e)}
                style={{ marginTop: 20, paddingHorizontal: 15, fontSize: 16, backgroundColor: 'white', borderRadius: 10, width: 300, borderColor: 'white', height: 45, borderWidth: 2 }}
                placeholder='Code' />
            <TouchableOpacity onPress={() => handleSubmitOTPWithPhoneNumber()} style={{ marginTop: 10 }}>
                <View style={{ paddingVertical: 7, borderRadius: 10, width: 300, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FF6E6E' }}>
                    <Text style={{ fontSize: 16, fontFamily: 'Poppins', color: 'white' }}>Submit</Text>
                </View>
            </TouchableOpacity>

        </ImageBackground>
    )
}

export default VerificationPhone 