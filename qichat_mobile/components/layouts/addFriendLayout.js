import React, { useContext, useEffect, useState } from 'react'
import { Image, ImageBackground, Text, TouchableOpacity, View, TextInput } from 'react-native'
import UserIcon from '../userIcon'
import bg from '../../assets/bg-vuong.png'
import avatar from '../../assets/avatar.jpg'
import debounce from 'lodash.debounce'
import { Picker } from '@react-native-picker/picker';
import { TypeHTTP, api } from '../../utils/api';
import { useNavigation } from '@react-navigation/native'
import { globalContext } from '../../context/globalContext';
import { formatPhoneByFireBase } from '../../utils/call';
import QRCode from 'react-native-qrcode-svg';

const AddFriendLayout = () => {

    const options = [
        { label: 'Name', value: 'name' },
        { label: 'Phone', value: 'phone' }
    ];
    const navigation = useNavigation()
    const { data } = useContext(globalContext)
    const [currentInput, setCurrentInput] = useState('name')
    const [query, setQuery] = useState('')
    const [users, setUsers] = useState([])

    const navigateToProfile = (user) => {
        navigation.navigate('UserProfile', { user: user });
    };

    useEffect(() => setQuery(''), [currentInput])
    useEffect(debounce(() => {
        if (query !== "") {
            api({ type: TypeHTTP.GET, sendToken: true, path: `/users/find-by-${currentInput}/${currentInput === 'phone' ? formatPhoneByFireBase(query) : query}` })
                .then(result => {
                    setUsers(result.filter(user => {
                        if (user._id !== data.user._id && user.statusSignUp === "Complete Sign Up") {
                            return user
                        }
                    }))
                })
        } else
            setUsers([])
    }, 300), [query])


    return (
        <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10, borderRadius: 10, overflow: 'hidden' }}>
                <ImageBackground source={bg} style={{ width: 200, height: 200, position: 'relative', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <QRCode value={JSON.stringify(data.user?._id)} size={170} />
                </ImageBackground>
            </View>

            <View style={{ borderWidth: 2, borderColor: '#E5E7E9', borderRadius: 10, height: 50, flexDirection: 'row', marginTop: 20, alignItems: 'center', justifyContent: 'space-between' }}>
                <Picker selectedValue={currentInput} style={{ fontSize: 13, fontWeight: '500', width: '35%', color: '#999' }}
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
                    placeholder={` Add Friend By ${currentInput ? currentInput.charAt(0).toUpperCase() + currentInput.slice(1) : 'Name'}${currentInput === 'name' ? '' : ''}`}
                    value={query}
                    onChangeText={e => setQuery(e)}
                />
            </View>
            <View>
                {users.length > 0 ?
                    users.map((user, index) => (
                        <TouchableOpacity key={index} onPress={() => navigateToProfile(user)}>
                            <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, marginLeft: 10 }}>
                                <UserIcon avatar={user.avatar} />
                                <Text style={{ fontSize: 15, fontWeight: '600', marginLeft: 10 }}>{user.fullName}</Text>
                            </View>
                        </TouchableOpacity>
                    ))
                    :
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: '60%' }}>
                        <Text style={{ fontFamily: 'Poppins', fontSize: 18 }}>Not Found</Text>
                    </View>
                }
            </View>
        </View>
    )
}

export default AddFriendLayout