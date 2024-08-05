import { Audio } from 'expo-av';
import React, { useEffect, useState } from 'react'
import { Animated, Text, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const AudioPlayer = ({ url, style }) => {

    const [playing, setPlaying] = useState(false)
    const [sound, setSound] = useState();
    const [playIconColor, setPlayIconColor] = useState('#3498DB'); // Màu mặc định cho biểu tượng play
    const [equalizerIconColor, setEqualizerIconColor] = useState('rgba(153, 153, 153, 0.6)'); // 
    const spinValue = new Animated.Value(0);
    useEffect(() => {
        Audio.Sound.createAsync({ uri: url })
            .then(res => {
                setSound(res.sound)
            })
    }, [url])

    const onPlaybackStatusUpdate = (status) => {
        if (status.didJustFinish) {
            sound.replayAsync(); // Lặp lại audio khi phát hết
        }
    };


    const play = async () => {
        if (sound) {
            sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
            await sound?.playAsync()
            setPlaying(true)
            setEqualizerIconColor('#3498DB');
            startEqualizerAnimation();

        }
    }

    const pause = async () => {
        if (sound) {
            await sound?.pauseAsync()
            setPlaying(false)
            setPlayIconColor('#3498DB'); // Thay đổi màu của biểu tượng play khi tạm dừng
            setEqualizerIconColor('rgba(153, 153, 153, 0.6)'); //
            stopEqualizerAnimation();
        }
    }
    const startEqualizerAnimation = () => {
        Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 1000, // Thời gian một vòng xoay
                useNativeDriver: true
            })
        ).start();
    };

    const stopEqualizerAnimation = () => {
        spinValue.stopAnimation();
    };

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });


    return (
        <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center', paddingVertical: 5 }}>


            <TouchableOpacity onPress={() => playing ? pause() : play()} style={{}}>
                <Icon name={playing ? 'pause' : 'play'} style={{ color: '#999', fontSize: 35 }} />
            </TouchableOpacity>
            <View style={{ flexDirection: 'row' }}>
                {[1, 2, 3, 4].map((_, index) => (
                    <Animated.View key={index} style={{ transform: [{ rotate: (playing && spinValue !== 0) ? spin : '0deg' }] }}>
                        <Animated.Image
                            key={index}
                            source={require('../assets/rename.webp')}
                            style={{
                                transform: [{ rotate: (playing && spinValue !== 0) ? spin : '0deg' }],
                                width: 28,
                                height: 28,
                                marginRight: -6
                            }}
                        />
                    </Animated.View>
                ))}
            </View>


        </View>
    )
}

export default AudioPlayer