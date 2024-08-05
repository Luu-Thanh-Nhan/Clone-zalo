import { useNavigation, useRoute } from '@react-navigation/native'
import React from 'react'
import { Image, TouchableOpacity, View } from 'react-native'
import VideoPlayer from '../components/videoPlayer'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const OverviewMedia = () => {
    const route = useRoute()
    const { type, data } = route.params
    const navigation = useNavigation();

    if (type === 'media') {
        return (
            <>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: 'absolute', top: 35, left: 15, zIndex: 1 }}>
                    <Icon name='arrow-left' style={{ color: 'black', fontSize: 30, marginRight: 10 }} />
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', justifyContent: 'start', paddingVertical: 70, paddingHorizontal: 10, gap: 5 }}>
                    {data.map((media, index) => {
                        if (media.url.includes("/image___")) {
                            return <TouchableOpacity onPress={() => navigation.navigate("ImageDetail", { url: media.url })}>
                                <Image key={index} source={{ uri: media.url }} style={{ width: 90, height: 90, borderRadius: 10 }} />
                            </TouchableOpacity>
                        }
                        if (media.url.includes("/video___")) {
                            return <TouchableOpacity onPress={() => navigation.navigate("VideoDetail", { url: media.url })} style={{ backgroundColor: '#999', borderRadius: 10, position: 'relative' }}>
                                <View style={{ height: '100%', width: '100%', position: 'absolute', zIndex: 3, }}></View>
                                <VideoPlayer key={index} url={media.url} style={{ width: 90, height: 90 }} />
                            </TouchableOpacity>
                        }
                    })}
                </View>
            </>
        )
    }
}

export default OverviewMedia