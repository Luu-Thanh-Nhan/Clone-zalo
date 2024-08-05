import React, { useContext, useEffect, useState } from 'react'
import { Image, ImageBackground, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import bg from '../assets/bg.webp'
import Icon from 'react-native-vector-icons/Feather';
import Menu from '../components/menu'
import logo from '../assets/friends.png'
import logo1 from '../assets/groups.png'
import { globalContext } from '../context/globalContext'
import { useNavigation } from '@react-navigation/native'
import { useRoute } from '@react-navigation/native';
import UserIcon from '../components/userIcon';
import { TypeHTTP, api } from '../utils/api';
import Header from '../components/header';

const options = {
    FRIEND: 'a',
    GROUP: 'b'
}

const SearchScreen = () => {

    const { data, handler } = useContext(globalContext)
    const [currentOption, setCurrentOption] = useState(options.FRIEND)
    const [friends, setFriends] = useState([])
    const [groups, setGroups] = useState([])
    const [nameFilter, setNameFilter] = useState('')
    const navigation = useNavigation()
    const navigateToProfile = (user) => {
        navigation.navigate('UserProfile', { user: user });
    };

    useEffect(() => {
        if (data.user)
            setFriends(data.user.friends)
    }, [data.user])
    useEffect(() => {
        api({ type: TypeHTTP.GET, path: `/groups/${data.user?._id}`, sendToken: true })
            .then(rooms => {
                setGroups(rooms)
            })
            .catch(error => {
                console.log(error)
            })
    }, [])




    const returnOption = () => {
        if (currentOption === options.FRIEND)
            return 'flex-start'

        if (currentOption === options.GROUP)
            return 'flex-end'
    }


    const route = useRoute()
    useEffect(() => {
        handler.checkToken(route.name)
            .then(goal => {
                if (goal !== null)
                    navigation.navigate(goal)
            })
    }, [])




    return (
        <View style={{ backgroundColor: 'white', height: '100%' }}>
            <View style={{ paddingHorizontal: 15, paddingTop: 50, height: '91%' }}>
                <Header screen={2} />
                <View style={{ position: 'relative', marginTop: 15, flexDirection: 'row', justifyContent: 'center', backgroundColor: '#F0F3F4', borderRadius: 25, height: 50 }}>
                    <View style={{ position: 'absolute', flexDirection: 'row', width: '100%', height: '100%', justifyContent: returnOption(), top: 0, left: 0, borderRadius: 25, overflow: 'hidden' }}>
                        <Image source={bg} style={{ width: '50%', height: '100%', borderRadius: 25 }} />
                    </View>
                    <TouchableOpacity onPress={() => setCurrentOption(options.FRIEND)} style={{ width: '50%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={logo} style={{ width: 20, height: 35, marginRight: 5 }}></Image>
                        <Text style={{ color: 'white', fontWeight: 700, fontSize: 16, color: currentOption === options.FRIEND ? 'white' : 'black' }}>Friends</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setCurrentOption(options.GROUP)} style={{ width: '50%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={logo1} style={{ width: 35, height: 35, marginRight: 5 }}></Image>
                        <Text style={{ fontWeight: 800, fontSize: 16, color: currentOption === options.GROUP ? 'white' : 'black' }}>Groups </Text>
                    </TouchableOpacity>

                </View>
                <View style={{ borderWidth: 1, borderColor: '#999', borderRadius: 25, marginTop: 20, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name='search' style={{ position: 'absolute', left: 15, zIndex: 1, color: '#999', fontSize: 26, marginRight: 5 }} />
                    <TextInput onChangeText={text => setNameFilter(text)} value={nameFilter} placeholder='Type your message...' style={{ paddingLeft: 40, paddingRight: 40, fontSize: 15, height: 50, width: '98%', borderRadius: 25 }} />
                </View>
                {currentOption === options.FRIEND ?
                    <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 20, marginHorizontal: 5, paddingBottom: 20, flexDirection: 'row' }}>
                        <View style={{ marginVertical: 2 }}>

                            <View style={{ flexDirection: 'column', gap: 10 }}>
                                {friends.map((friend, index) => {
                                    if (nameFilter === '' || friend.fullName.toLowerCase().includes(nameFilter.toLowerCase()))
                                        return <TouchableOpacity onPress={() => navigateToProfile(friend)} style={{ fontSize: 18, alignItems: 'center', flexDirection: 'row', gap: 10 }} key={index} >
                                            <UserIcon size={50} avatar={friend.avatar} />
                                            <Text style={{ fontWeight: 600, fontSize: 16 }}>{friend.fullName}</Text>
                                        </TouchableOpacity>
                                })
                                }

                            </View>

                        </View>
                    </ScrollView>
                    :
                    <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 20, marginHorizontal: 5 }}>
                        <View style={{ flexDirection: 'column', gap: 10, alignItems: 'center', marginVertical: 2, flexDirection: 'column', width: '100%' }}>
                            {groups.map((group, index) => {
                                if (nameFilter === '' || group.name.toLowerCase().includes(nameFilter.toLowerCase()))
                                    return <TouchableOpacity onClick={() => handleUserProfile(friend_id)} key={index} style={{ width: '100%', fontSize: 18, alignItems: 'center', flexDirection: 'row', gap: 10, justifyContent: 'space-between' }} >
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                            <UserIcon size={50} type={'Group'} avatar={group.image} />
                                            <Text style={{ fontWeight: 600, fontSize: 16 }}>{group.name}</Text>
                                        </View>
                                        <Text style={{ fontWeight: 600, fontSize: 13 }}>
                                            {`${group.users.length} participants`}
                                        </Text>
                                    </TouchableOpacity>
                            })}

                        </View >
                    </ScrollView>
                }
            </View >
            <Menu />
        </View>

    )
}

export default SearchScreen