import React, { useState } from 'react'
import { Image, ImageBackground, Text, TextInput, TouchableOpacity, View } from 'react-native'
import bg from '../assets/bg-dung.jpg'
import banner from '../assets/banner.png'
import Logo from '../components/logo'
import { formatPhoneByFireBase } from '../utils/call'
import { TypeHTTP, api } from '../utils/api';
import { steps } from './forgetPhoneScreen'

const EnterPhoneScreen = ({ setCurrentStep, setUser }) => {

    const [phone, setPhone] = useState('')
    const handleSubmitPhone = () => {
        if (!/^\d{10}$/.test(phone)) {
            console.log('Invalid Phone')
            // handler.showAlert('Warning', 'Invalid Phone', () => { }, () => { })
            return
        }
        api({ type: TypeHTTP.GET, path: `/users/find-by-phone-no-token/${formatPhoneByFireBase(phone)}` })
            .then(res => {
                if (res.data[0]) {
                    console.log(res.data[0])
                    setUser(res.data[0])
                    setCurrentStep(steps.VERIFICATIONPHONE)
                } else {
                    // handler.notify(notifyType.FAIL, "Not Found User")
                }
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
            <TextInput
                value={phone}
                onChangeText={e => setPhone(e)}
                style={{ marginTop: 20, paddingHorizontal: 15, fontSize: 16, backgroundColor: 'white', borderRadius: 10, width: 300, borderColor: 'white', height: 45, borderWidth: 2 }}
                placeholder='Enter Phone Number' />
            <TouchableOpacity onPress={() => handleSubmitPhone()} style={{ marginTop: 10 }}>
                <View style={{ paddingVertical: 7, borderRadius: 10, width: 300, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FF6E6E' }}>
                    <Text style={{ fontSize: 16, fontFamily: 'Poppins', color: 'white' }}>Submit</Text>
                </View>
            </TouchableOpacity>
        </ImageBackground>
    )
}

export default EnterPhoneScreen