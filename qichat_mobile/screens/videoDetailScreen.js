import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import VideoPlayer from '../components/videoPlayer';
const VideoDetailScreen = () => {
    const route = useRoute()
    const url = route.params.url
    const navigation = useNavigation();
    // onPress={() => navigation.navigate("ImageDetail", { url: item.url })}
    return (
        <View style={{ width: '100%', height: '100%', position: 'relative' }}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: 'absolute', top: 35, left: 15, zIndex: 1 }}>
                <Icon name='arrow-left' style={{ color: 'black', fontSize: 30, marginRight: 10 }} />
            </TouchableOpacity>
            <VideoPlayer url={url} style={{ width: "100%", height: '100%' }} />
        </View>
    )
}

export default VideoDetailScreen