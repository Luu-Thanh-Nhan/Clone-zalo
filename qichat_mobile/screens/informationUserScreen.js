import React, { useContext, useEffect, useState } from 'react'
import { Image, ImageBackground, Text, TextInput, TouchableOpacity, View, Platform, Alert, ScrollView } from 'react-native';
import avatar from '../assets/avatar.jpg'
import bg from '../assets/bg-dung.jpg';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native'
import { messageContext } from '../context/messageContext';
import { globalContext } from '../context/globalContext';
import { formatDateOfBirth } from '../utils/time';
import { launchImageLibrary } from 'react-native-image-picker';
import Spinner from '../components/spinner';
import DateTimePicker from '@react-native-community/datetimepicker';
import maleIcon from '../assets/male.png'
import femaleIcon from '../assets/female.png'
import { TypeHTTP, api, baseURL } from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { base64ToArrayBuffer } from '../utils/media';


const InformationUserScreen = () => {
    const [user, setUser] = useState()
    const { data, handler } = useContext(globalContext)
    const navigation = useNavigation();
    const [imageUri, setImageUri] = useState(data.user?.avatar);
    const [image, setImage] = useState()
    const [dateOfBirth, setDateOfBirth] = useState(new Date());
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false)
    const [gender, setGender] = useState()
    const [password, setPassword] = useState('')
    const [newPassWord, setNewPassWord] = useState('')
    const [confirmPassWord, setConfirmPassWord] = useState('')

    useEffect(() => {
        setUser(data.user)
        setDate(new Date(data.user?.dateOfBirth))
        setDateOfBirth(new Date(data.user?.dateOfBirth))
        setGender(data.user?.gender)
    }, [data.user])

    useEffect(() => {
        if (user)
            setUser({ ...user, gender: gender })
    }, [gender])
    useEffect(() => {
        if (user)
            setUser({ ...user, dateOfBirth: dateOfBirth })
    }, [dateOfBirth])

    const openGallery = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
                base64: true,
            });

            if (!result.cancelled) {
                setImage({
                    base64: result.assets[0].base64,
                    originalname: result.assets[0].fileName,
                    uri: result.assets[0].uri,
                    mimetype: result.assets[0].mimeType,
                    size: result.assets[0].fileSize
                })
                setImageUri(result.assets[0].uri)
            }
        } catch (error) {
            console.error('Lỗi khi mở thư viện ảnh:', error);
        }
    };


    const handleSubmitInformation = () => {
        try {
            if (!/^[A-ZÀ-Ỹ][a-zà-ỹ]+(\s[A-ZÀ-Ỹ][a-zà-ỹ]+)+$/.test(user?.fullName)) {
                handler.showAlert("Fail", "Invalid FullName")
                return;
            }

            if (!user?.dateOfBirth || new Date().getFullYear() - new Date(user?.dateOfBirth).getFullYear() - (new Date().getMonth() < new Date(user?.dateOfBirth).getMonth() || (new Date().getMonth() === new Date(user?.dateOfBirth).getMonth() && new Date().getDate() < new Date(user?.dateOfBirth).getDate())) < 12) {
                handler.showAlert("Warning", "Age must be at least 12")
                return;
            }
            user.avatar = image
            api({ type: TypeHTTP.PUT, path: `/users/update-information-mobile/${user._id}`, sendToken: true, body: user })
                .then(res => {
                    handler.showAlert("Success", "Update Information Successfully")
                    handler.setUser(res)
                })
                .catch(error => {
                    console.log(error)
                })
        } catch (error) {
            console.log(error)
        }
    }

    const handleSubmitPassword = () => {

        if (password.length < 6) {
            handler.showAlert("Warning", "Password must be at least 6 characters")
            return
        }
        if (newPassWord.length < 6) {
            handler.showAlert("Warning", "New Password must be at least 6 characters")
            return
        }

        if (newPassWord === password) {
            handler.showAlert("Warning", 'New password must be different from password')
            return
        }

        if (confirmPassWord !== newPassWord) {
            handler.showAlert("Warning", 'The new password must match the confirm password')
            return
        }
        api({ sendToken: true, type: TypeHTTP.PUT, path: `/users/update-password/${user?._id}`, body: { password, newPassword: newPassWord } })
            .then(async res => {
                await AsyncStorage.removeItem('accessToken')
                await AsyncStorage.removeItem('refreshToken')
                navigation.navigate('PublicScreen')
            })
            .catch(error => {
                console.log(error)
            })
    }



    return (
        <View style={{ position: 'relative', width: '100%', backgroundColor: 'white', height: '100%', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
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
            <ScrollView style={{ flexDirection: 'column', paddingHorizontal: 20, paddingVertical: 30, width: '100%', height: '100%' }}>
                <View style={{ alignItems: 'flex-start' }}>
                    <TouchableOpacity onPress={() => navigation.navigate('MessageScreen')}>
                        <Icon name='arrow-left' style={{ color: 'black', fontSize: 30, marginRight: 10 }} />
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                    <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 9, width: '100%' }}>
                        <View>
                            <View>
                                <Image source={{ uri: imageUri }} style={{ borderRadius: 55, width: 120, height: 120 }} />
                                <TouchableOpacity onPress={openGallery} style={{ position: 'absolute', top: 0, right: -10 }}>
                                    <Icon name='pencil' style={{ color: '#999', fontSize: 19 }} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ fontSize: 25, fontWeight: '600' }}>{user?.fullName}</Text>
                        </View>
                    </View>
                </View>
                <View style={{ marginTop: 10 }}>
                    <Text style={{ fontSize: 18, fontWeight: '600' }}>FullName</Text>
                    <TextInput onChangeText={e => setUser({ ...user, fullName: e })} value={user?.fullName} style={{ borderWidth: 1, borderColor: '#999', borderRadius: 8, paddingLeft: 10, paddingRight: 40, fontSize: 15, height: 45, marginTop: 7, width: '100%' }} />
                </View>
                <View style={{ marginTop: 10 }}>
                    <Text style={{ fontSize: 18, fontWeight: '600' }}>Date of Birth</Text>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, fontSize: 16, borderRadius: 8, backgroundColor: 'white', width: '100%', marginTop: 7, borderWidth: 1, borderColor: '#999', height: 45 }} onPress={() => setShowPicker(true)}>
                        <Text style={{ color: '#999' }}>
                            {dateOfBirth.getDate() + "/" + (dateOfBirth.getMonth() + 1) + "/" + dateOfBirth.getFullYear()}
                        </Text>
                    </TouchableOpacity>
                </View>

                {
                    user?.phone &&
                    <View style={{ marginTop: 10 }}>
                        <Text style={{ fontSize: 18, fontWeight: '600' }}>Phone</Text>
                        <TextInput disableFullscreenUI value={user?.phone} style={{ borderWidth: 1, borderColor: '#999', borderRadius: 8, paddingLeft: 10, paddingRight: 40, fontSize: 15, height: 45, marginTop: 7, width: '100%' }} />
                    </View>
                }
                {
                    user?.email &&
                    <View style={{ marginTop: 10 }}>
                        <Text style={{ fontSize: 18, fontWeight: '600' }}>Email</Text>
                        <TextInput value={user?.email} style={{ borderWidth: 1, borderColor: '#999', borderRadius: 8, paddingLeft: 10, paddingRight: 40, fontSize: 15, height: 45, marginTop: 7, width: '100%' }} />
                    </View>
                }

                <View style={{ marginTop: 10 }}>
                    <Text style={{ fontSize: 18, fontWeight: '600' }}>Gender</Text>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, fontSize: 16, borderRadius: 8, backgroundColor: 'white', width: '100%', marginTop: 7, borderColor: '#999', height: 45, borderWidth: 1 }} onPress={() => setShowSpinner(true)}>
                        <Text style={{ color: '#999' }}>
                            {gender ? gender : 'Choose Gender'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={{ marginTop: 10 }}>
                    <Text style={{ fontSize: 18, fontWeight: '600' }}>Bio</Text>
                    <TextInput onChangeText={e => setUser({ ...user, bio: e })} value={user?.bio} style={{ borderWidth: 1, borderColor: '#999', borderRadius: 8, paddingLeft: 10, paddingRight: 40, fontSize: 15, height: 45, marginTop: 7, width: '100%' }} />
                </View>

                <TouchableOpacity onPress={() => handleSubmitInformation()} style={{ marginTop: 20, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', borderRadius: 10, backgroundColor: '#FF6E6E', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 18, color: 'white' }}>Change</Text>
                </TouchableOpacity>

                {user?.phone && (
                    <>
                        <View style={{ height: 50 }}></View>

                        <View style={{ marginTop: 10 }}>
                            <Text style={{ fontSize: 18, fontWeight: '600' }}>Current Password</Text>
                            <TextInput secureTextEntry={true} onChangeText={e => setPassword(e)} value={password} style={{ borderWidth: 1, borderColor: '#999', borderRadius: 8, paddingHorizontal: 10, fontSize: 15, height: 45, marginTop: 7, width: '100%' }} />
                        </View>

                        <View style={{ marginTop: 10 }}>
                            <Text style={{ fontSize: 18, fontWeight: '600' }}>New Password</Text>
                            <TextInput secureTextEntry={true} onChangeText={e => setNewPassWord(e)} value={newPassWord} style={{ borderWidth: 1, borderColor: '#999', borderRadius: 8, paddingHorizontal: 10, fontSize: 15, height: 45, marginTop: 7, width: '100%' }} />
                        </View>

                        <View style={{ marginTop: 10 }}>
                            <Text style={{ fontSize: 18, fontWeight: '600' }}>Confirm New Password</Text>
                            <TextInput secureTextEntry={true} onChangeText={e => setConfirmPassWord(e)} value={confirmPassWord} style={{ borderWidth: 1, borderColor: '#999', borderRadius: 8, paddingHorizontal: 10, fontSize: 15, height: 45, marginTop: 7, width: '100%' }} />
                        </View>

                        <TouchableOpacity onPress={() => handleSubmitPassword()} style={{ marginTop: 20, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', borderRadius: 10, backgroundColor: '#FF6E6E', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 18, color: 'white' }}>Change</Text>
                        </TouchableOpacity>
                        <View style={{ height: 50 }}></View>
                    </>
                )}
            </ScrollView>
        </View >
    )
}

export default InformationUserScreen

