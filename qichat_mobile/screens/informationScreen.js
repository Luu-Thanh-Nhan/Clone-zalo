import React, { useContext, useEffect, useState } from 'react';
import { Image, ImageBackground, Text, TextInput, TouchableOpacity, View, Platform } from 'react-native';
import bg from '../assets/bg-dung.jpg';
import banner from '../assets/banner.png';
import Logo from '../components/logo';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import Spinner from '../components/spinner';
import maleIcon from '../assets/male.png'
import femaleIcon from '../assets/female.png'
import { TypeHTTP, api } from '../utils/api';
import { globalContext } from '../context/globalContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';



const InformationScreens = () => {
    const navigation = useNavigation()
    const [gender, setGender] = useState()
    const [fullName, setFullName] = useState()
    const [bio, setBio] = useState()
    const [dateOfBirth, setDateOfBirth] = useState(new Date());
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false)
    const { data, handler } = useContext(globalContext)

    const route = useRoute()
    useEffect(() => {
        handler.checkToken(route.name)
            .then(goal => {
                if (goal !== null)
                    navigation.navigate(goal)
            })
    }, [])

    const handleSubmit = () => {
        if (!/^[A-ZÀ-Ỹ][a-zà-ỹ]+(\s[A-ZÀ-Ỹ][a-zà-ỹ]+)+$/.test(fullName)) {
            handler.showAlert("Warning", "Invalid full name")
            return;
        }

        if (gender !== 'Male' && gender !== 'Female') {
            handler.showAlert("Warning", "Invalid Gender")
            return;
        }

        if (!dateOfBirth || new Date().getFullYear() - new Date(dateOfBirth).getFullYear() - (new Date().getMonth() < new Date(dateOfBirth).getMonth() || (new Date().getMonth() === new Date(dateOfBirth).getMonth() && new Date().getDate() < new Date(dateOfBirth).getDate())) < 12) {
            handler.showAlert("Warning", "Age must be at least 12")
            return;
        }

        api({ type: TypeHTTP.PUT, body: { fullName, dateOfBirth, bio, gender, statusSignUp: 'Complete Sign Up' }, path: `/users/${data.user?._id}`, sendToken: false })
            .then(res => {
                if (res) {
                    api({ type: TypeHTTP.POST, path: '/generate-tokens', body: { user_id: res?._id, admin: res?.admin }, sendToken: false })
                        .then(async (tokens) => {
                            await AsyncStorage.setItem('accessToken', tokens.accessToken)
                            await AsyncStorage.setItem('refreshToken', tokens.refreshToken)
                            await AsyncStorage.setItem('user_id', res?._id)
                            await AsyncStorage.setItem('admin', res?.admin + "")
                            handler.setUser(res)
                            navigation.navigate('MessageScreen')
                        })
                }
            })
    }

    return (
        <ImageBackground
            style={{ height: '100%', width: '100%', position: 'relative', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
            source={bg}
        >
            {(showPicker || showSpinner) && (
                <TouchableOpacity onPress={() => { setShowPicker(false); setShowSpinner(false) }} style={{ height: '100%', width: '100%', position: 'absolute', zIndex: 10, backgroundColor: '#b2b2b263' }} />
            )}
            {showSpinner && (<Spinner setValue={setGender} setShow={setShowSpinner} data={[{ name: 'Male', icon: maleIcon }, { name: 'Female', icon: femaleIcon }]} />)}
            {showPicker && (
                <View style={{ flexDirection: 'column', alignItems: 'center', position: 'absolute', backgroundColor: 'white', left: 50, zIndex: 50, borderRadius: 30 }}>
                    <DateTimePicker
                        mode="date"
                        display="spinner"
                        value={date}
                        onChange={({ type }, selectedDate) => {
                            if (type === "set") {
                                setDateOfBirth(selectedDate)
                                if (Platform.OS === 'android') {
                                    setDateOfBirth(selectedDate)
                                    setShowPicker(false)
                                    setShowPicker(false)
                                }
                            } else {
                                setShowPicker(false)
                            }
                        }}
                    />
                    {Platform.OS === 'ios' && (
                        <View style={{ paddingVertical: 10, flexDirection: 'column', justifyContent: 'flex-end' }}>
                            <TouchableOpacity onPress={() => setShowPicker(false)}>
                                <Text style={{ fontSize: 17, fontWeight: 'bold' }}>OK</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            )}

            <View style={{ position: 'absolute', top: 40, left: 20 }}>
                <Logo />
            </View>
            <Image
                style={{ width: 300, height: 230 }}
                source={banner} />
            <Text style={{ color: 'white', fontSize: 20, paddingHorizontal: 30, textAlign: 'center', marginVertical: 10 }}>{`Complete Your Profile`}</Text>
            <TextInput
                onChangeText={e => setFullName(e)}
                style={{ marginTop: 20, paddingHorizontal: 15, fontSize: 16, backgroundColor: 'white', borderRadius: 10, width: 300, borderColor: 'white', height: 45, borderWidth: 2 }}
                placeholder='FullName' value={fullName} />
            <TouchableOpacity style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, fontSize: 16, backgroundColor: 'white', borderRadius: 10, width: 300, borderColor: 'white', height: 45, borderWidth: 2 }} onPress={() => setShowPicker(true)}>
                <Text style={{ color: '#999' }}>
                    {dateOfBirth.getDate() + "/" + (dateOfBirth.getMonth() + 1) + "/" + dateOfBirth.getFullYear()}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, fontSize: 16, backgroundColor: 'white', borderRadius: 10, width: 300, borderColor: 'white', height: 45, borderWidth: 2 }} onPress={() => setShowSpinner(true)}>
                <Text style={{ color: '#999' }}>
                    {gender ? gender : 'Choose Gender'}
                </Text>
            </TouchableOpacity>
            <TextInput
                style={{ marginTop: 10, paddingHorizontal: 15, fontSize: 16, backgroundColor: 'white', borderRadius: 10, width: 300, borderColor: 'white', height: 45, borderWidth: 2 }}
                placeholder='Bio' onChangeText={e => setBio(e)} value={bio} />

            <TouchableOpacity onPress={() => handleSubmit()} style={{ marginTop: 10 }}>
                <View style={{ paddingVertical: 7, borderRadius: 10, width: 300, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FF6E6E' }}>
                    <Text style={{ fontSize: 16, fontFamily: 'Poppins', color: 'white' }}>Submit</Text>
                </View>
            </TouchableOpacity>
        </ImageBackground >
    );
};

export default InformationScreens;
