import React from 'react'
import { Text, View } from 'react-native'
import UserIcon from './userIcon'
import { useNavigation } from '@react-navigation/native'
import { TouchableOpacity } from 'react-native'
const UserSearchGroup = () => {

    const navigation = useNavigation();
    return (
        <TouchableOpacity style={{ flexDirection: 'row', position: 'relative', alignItems: 'center', marginVertical: 2 }}>
            <UserIcon />
            <View style={{ flexDirection: 'column', marginLeft: 10 }}>
                <Text style={{ fontWeight: '700', fontSize: 16 }}>Vu Tien Duc</Text>

            </View>
            <Text style={{ position: 'absolute', right: 0, top: 19, fontSize: 13, fontWeight: 700 }}>5 participants</Text>

        </TouchableOpacity>
    )
}

export default UserSearchGroup