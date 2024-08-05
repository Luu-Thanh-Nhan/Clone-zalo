import React from 'react'
import { Text, View } from 'react-native'
import UserIcon from './userIcon'
import { useNavigation } from '@react-navigation/native'
import { TouchableOpacity } from 'react-native'
const UserSearch = () => {

    const navigation = useNavigation();
    return (
        <TouchableOpacity style={{ flexDirection: 'row', position: 'relative', alignItems: 'center', marginVertical: 2 }}>
            <UserIcon />
            <View style={{ flexDirection: 'column', marginLeft: 10 }}>
                <Text style={{ fontWeight: '700', fontSize: 16 }}>Vu Tien Duc</Text>

            </View>

        </TouchableOpacity>
    )
}

export default UserSearch