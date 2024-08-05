import { Video } from 'expo-av'
import React, { useEffect, useRef, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const VideoPlayer = ({ url, style }) => {

    const videoRef = useRef()
    const [playing, setPlaying] = useState(false)

    useEffect(() => {
        playing === true ? videoRef.current.playAsync() : videoRef.current.pauseAsync()
    }, [playing])

    return (
        <View style={{ position: 'relative', borderRadius: 30, overflow: 'hidden' }}>
            <Video
                ref={videoRef}
                source={{ uri: url }}
                style={style}
                resizeMode="contain"
                isLooping
            />
            <TouchableOpacity onPress={() => {
                setPlaying(!playing)
            }} style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Icon name={playing ? 'pause-circle-outline' : 'play-circle-outline'} style={{ color: 'white', fontSize: 50 }} />
            </TouchableOpacity>
        </View>
    )
}

export default VideoPlayer