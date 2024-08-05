import React, { useContext, useEffect, useState } from 'react'
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import UserIcon from '../userIcon'
import Icon from 'react-native-vector-icons/Octicons';
import avatar from '../../assets/avatar.jpg'
import * as FilePicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { useNavigation } from '@react-navigation/native';
import Icon1 from 'react-native-vector-icons/MaterialCommunityIcons';
import { Picker } from '@react-native-picker/picker';
import debounce from 'lodash.debounce'
import { TypeHTTP, api, baseURL } from '../../utils/api'
import { globalContext } from '../../context/globalContext';
import { io } from 'socket.io-client';
const socket = io.connect(baseURL)

const CreateGroupLayout = () => {
    const [image, setImage] = useState()
    const [name, setName] = useState('')
    const [currentInput, setCurrentInput] = useState('name')
    const [query, setQuery] = useState('')
    const [usersFound, setUsersFound] = useState([])
    const [participants, setParticipants] = useState([])
    const [displayFind, setDisplayFind] = useState(false)
    const { data } = useContext(globalContext)

    useEffect(() => {
        setParticipants([data.user])
    }, [data.user])

    const pickFile = async () => {

        let result = await FilePicker.getDocumentAsync({
            // multiple: true,
            copyToCacheDirectory: true,
            type: 'image/*'
        })
        if (!result.canceled) {
            const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, {
                encoding: FileSystem.EncodingType.Base64,
            });
            setImage({
                base64,
                originalname: result.assets[0].name,
                uri: result.assets[0].uri,
                mimetype: result.assets[0].mimeType,
                size: result.assets[0].size
            })
        }
    };
    const options = [
        { label: 'Name', value: 'name' },
        { label: 'Phone', value: 'phone' }
    ];

    useEffect(() => setQuery(''), [currentInput])
    useEffect(debounce(() => {
        if (query !== "") {
            api({ type: TypeHTTP.GET, sendToken: true, path: `/users/find-by-${currentInput}/${currentInput === 'phone' ? formatPhoneByFireBase(query) : query}` })
                .then(result => {
                    setUsersFound(result.filter(user => {
                        if (user._id !== data.user._id && user.statusSignUp === "Complete Sign Up") {
                            return user
                        }
                    }))
                })
        } else
            setUsersFound([])
    }, 300), [query])


    const handleCreateGroup = () => {
        const body = {
            name,
            type: 'Group',
            image: image ? image : undefined,
            creator: data.user?._id,
            users: participants
        }
        api({ type: TypeHTTP.POST, path: '/rooms-mobile', sendToken: true, body: body })
            .then(room => {
                setName('')
                setImage()
                setParticipants([data.user])
                socket.emit('update-room', participants.map(item => {
                    if (item._id !== data.user?._id) {
                        return item._id
                    }
                }))
            })
            .catch(error => {
                console.log(error)
            })
    }

    if (displayFind === false)
        return <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
                <View style={{ position: 'relative' }}>
                    <Image source={image ? { uri: `data:image/jpeg;base64,${image.base64}` } : { uri: 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/file-uploads/themes/2152974972/settings_images/a05d7f7-f3b7-0102-a18b-52050e1111ad_noun-proactive-5427471-02_2.png' }} style={{ borderRadius: 70, width: 140, height: 140 }} />
                    <TouchableOpacity onPress={() => pickFile()} style={{ position: 'absolute', top: 0, right: -10 }}>
                        <Icon name='pencil' style={{ color: '#999', fontSize: 20 }} />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ borderWidth: 1, borderColor: '#999', borderRadius: 25, marginTop: 20, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name='pencil' style={{ position: 'absolute', left: 15, zIndex: 1, color: '#999', fontSize: 22, marginRight: 5 }} />
                <TextInput value={name} onChangeText={e => setName(e)} placeholder='Type your message...' style={{ paddingLeft: 40, paddingRight: 40, fontSize: 15, height: 50, width: '98%', borderRadius: 25 }} />
            </View>
            <View>
                <Text style={{ fontWeight: '700', fontSize: 20, marginTop: 30 }}>{`Participants (${participants.length})`}</Text>
            </View>
            <ScrollView style={{ paddingHorizontal: 10 }}>
                <TouchableOpacity onPress={() => setDisplayFind(true)} style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                        <Text style={{ fontSize: 35, fontWeight: '300', marginLeft: 10 }}>+</Text>
                        <Text style={{ fontSize: 16, fontWeight: '600', marginLeft: 10 }}>Add Participant</Text>
                    </View>
                </TouchableOpacity>
                {participants.map((user, index) => (
                    <View key={index} style={{ flexDirection: 'row', position: 'relative', alignItems: 'center', gap: 10, marginVertical: 5 }}>
                        <UserIcon avatar={user.avatar} size={50} />
                        <Text style={{ fontSize: 17, fontWeight: '600' }}>{user.fullName}</Text>
                        {participants.map(item => item._id).includes(user._id) ?
                            <TouchableOpacity onPress={() => setParticipants(participants.filter(item => item._id !== user._id))} style={{ borderWidth: 1, borderColor: '#ff4848', borderRadius: 10, position: 'absolute', right: 0 }}>
                                <Icon1 name='minus' style={{ fontSize: 20, color: '#ff4848' }} />
                            </TouchableOpacity>
                            :
                            <TouchableOpacity onPress={() => setParticipants([...participants, user])} style={{ borderWidth: 1, borderColor: 'green', borderRadius: 10, position: 'absolute', right: 0 }}>
                                <Icon1 name='plus' style={{ fontSize: 20, color: 'green' }} />
                            </TouchableOpacity>
                        }
                    </View>
                ))}
                {(name !== '' && participants.length >= 3) && <TouchableOpacity onPress={() => handleCreateGroup()} style={{ backgroundColor: 'green', marginBottom: 10, width: '100%', paddingVertical: 13, borderRadius: 10, marginTop: 10, flexDirection: 'row', justifyContent: 'center' }}>
                    <Text style={{ color: 'white', fontSize: 16 }}>Create Group</Text>
                </TouchableOpacity>}
            </ScrollView>
        </View >
    else
        return <View style={{ width: '100%', height: '100%', backgroundColor: 'white', position: 'relative', flexDirection: 'column', gap: 5, paddingTop: 10 }}>
            <Text style={{ fontSize: 21, marginTop: 10, fontFamily: 'Poppins' }}>Find Participant</Text>
            <View style={{ borderWidth: 2, borderColor: '#E5E7E9', borderRadius: 10, height: 50, flexDirection: 'row', marginTop: 5, alignItems: 'center', justifyContent: 'space-between' }}>
                <Picker selectedValue={currentInput} style={{ fontSize: 13, fontWeight: '500', width: '40%', color: '#999' }}
                    onValueChange={(itemValue, itemIndex) => {
                        setCurrentInput(itemValue)
                    }}
                >
                    {options.map(option => (
                        <Picker key={option.value} label={option.label} value={option.value} />
                    ))}
                </Picker>
                <TextInput
                    style={{ fontSize: 15, color: '#999', flex: 1, borderLeftWidth: 2, height: 30, paddingHorizontal: 10, borderColor: '#E5E7E9' }}
                    placeholder={`Find Participant By ${currentInput ? currentInput.charAt(0).toUpperCase() + currentInput.slice(1) : 'Name'}${currentInput === 'name' ? '' : ''}`}
                    value={query}
                    onChangeText={e => setQuery(e)}
                />
            </View>
            <View>
                <ScrollView style={{ marginVertical: 10, height: '60%' }}>
                    {usersFound.map((user, index) => (
                        <View key={index} style={{ flexDirection: 'row', position: 'relative', alignItems: 'center', gap: 10, marginVertical: 5 }}>
                            <UserIcon avatar={user.avatar} size={50} />
                            <Text style={{ fontSize: 17, fontWeight: '600' }}>{user.fullName}</Text>
                            {participants.map(item => item._id).includes(user._id) ?
                                <TouchableOpacity onPress={() => setParticipants(participants.filter(item => item._id !== user._id))} style={{ borderWidth: 1, borderColor: '#ff4848', borderRadius: 10, position: 'absolute', right: 0 }}>
                                    <Icon1 name='minus' style={{ fontSize: 20, color: '#ff4848' }} />
                                </TouchableOpacity>
                                :
                                <TouchableOpacity onPress={() => setParticipants([...participants, user])} style={{ borderWidth: 1, borderColor: 'green', borderRadius: 10, position: 'absolute', right: 0 }}>
                                    <Icon1 name='plus' style={{ fontSize: 20, color: 'green' }} />
                                </TouchableOpacity>
                            }
                        </View>
                    ))}
                </ScrollView>
            </View>
            <View style={{ height: 60, width: '100%', borderRadius: 10, borderWidth: 2, borderColor: '#E5E7E9', flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10 }}>
                {participants.map((user, index) => (
                    <Image key={index} source={{ uri: user.avatar }} style={{ borderRadius: 45, width: 45, height: 45 }} />
                ))}
            </View>
            <TouchableOpacity onPress={() => setDisplayFind(false)} style={{ backgroundColor: 'green', marginBottom: 10, width: '100%', paddingVertical: 13, borderRadius: 10, flexDirection: 'row', justifyContent: 'center' }}>
                <Text style={{ color: 'white', fontSize: 16 }}>Add Participants</Text>
            </TouchableOpacity>
        </View>

}

export default CreateGroupLayout