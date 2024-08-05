import React from 'react'
import { Image, TouchableOpacity, View } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const ImageDetailScreen = () => {
    const route = useRoute()
    const url = route.params.url
    const navigation = useNavigation();
    return (
        <View style={{ width: '100%', height: '100%', position: 'relative' }}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: 'absolute', top: 35, left: 15, zIndex: 1 }}>
                <Icon name='arrow-left' style={{ color: 'black', fontSize: 30, marginRight: 10 }} />
            </TouchableOpacity>
            <Image source={{ uri: url }} style={{ width: "100%", height: '100%', borderRadius: 10 }} />
        </View>
    )
}

export default ImageDetailScreen