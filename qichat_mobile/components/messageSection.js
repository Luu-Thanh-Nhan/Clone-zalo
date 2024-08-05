import React, { useContext, useRef, useState } from 'react'
import { Animated, Image, Pressable, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome6';
import Icon1 from 'react-native-vector-icons/MaterialCommunityIcons';
import docx from '../assets/docx.png'
import xlsx from '../assets/xlsx.png'
import file from '../assets/file.png'
import rar from '../assets/rar.png'
import pdf from '../assets/pdf.png'
import pptx from '../assets/pptx.png'
import text from '../assets/text.png'
import { Video } from 'expo-av'
import VideoPlayer from './videoPlayer'
import AudioPlayer from './audioPlayer'
import { useNavigation, useRoute } from '@react-navigation/native'
import { emoji, emojiStatus } from '../utils/emoji';
import { io } from 'socket.io-client';
import { baseURL } from '../utils/api';
import { messageContext } from '../context/messageContext';
import { globalContext } from '../context/globalContext';
const socket = io.connect(baseURL)
export const fileTypes = {
    docx: docx,
    xlsx,
    file,
    pdf,
    rar,
    pptx,
    text
}

const MessageSection = ({ id, message, style, information, avatar, disabled, setDisplayEmoji, displayEmoji }) => {

    const { messageHandler } = useContext(messageContext)
    const navigation = useNavigation()
    const height = useRef(new Animated.Value(0)).current;
    const emojiRef = useRef()
    const { data } = useContext(globalContext)
    const { messageData } = useContext(messageContext)

    const handleTouchHover = () => {
        setDisplayEmoji(id)
        Animated.timing(height, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }

    const handleSendEmoji = (status) => {
        const emoji = {
            status,
            user: {
                _id: message.user._id,
                fullName: message.user.fullName,
                avatar: message.user.avatar
            }
        }
        const messageSend = { ...message, emojis: [...message.emojis, emoji] }
        socket.emit('send_emoji_or_disable', messageSend)
        setDisplayEmoji("")
    }

    const handleSendDisable = () => {
        setDisplayEmoji("")
        const messageSend = { ...message, disabled: true }
        socket.emit('send_emoji_or_disable', messageSend)
    }

    const messageItem = () => {
        if (disabled) {
            return <View style={{ flexDirection: 'row', gap: 8, marginVertical: 5, alignItems: 'center' }}>
                {style === 'flex-start' && <Image source={{ uri: avatar }} style={{ borderRadius: 40, width: 40, height: 40 }} />}
                <View style={{ width: '100%', flexDirection: 'row', justifyContent: style }}>
                    <View style={{ backgroundColor: '#f5f5f5c3', maxWidth: '45%', minHeight: 38, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', paddingHorizontal: 15, borderRadius: 10 }}>
                        <Icon name='delete-left' style={{ color: '#999', fontSize: 17, marginRight: 10 }} />
                        <Text>Has been revoked</Text>
                    </View>
                </View>
            </View>
        } else {
            if (message.typeMessage === 'loading') {
                return (
                    <View style={{ width: '100%', flexDirection: 'row', justifyContent: style }}>
                        <View style={{ width: 150, aspectRatio: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5c3', borderRadius: 10 }}>
                            <ActivityIndicator size={50} color={"#999"} />
                        </View>
                    </View>
                )
            }
            if (!information[0].url) {
                return (
                    <Pressable onLongPress={() => handleTouchHover()} style={{ flexDirection: 'row', gap: 8, marginVertical: 10, alignItems: 'center' }}>
                        {style === 'flex-start' && <Image source={{ uri: avatar }} style={{ borderRadius: 40, width: 40, height: 40 }} />}
                        <View style={{ width: '100%', flexDirection: 'row', justifyContent: style }}>
                            <View style={{ backgroundColor: '#f5f5f5c3', maxWidth: '65%', minHeight: 35, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 10 }}>
                                <Text style={{ lineHeight: 22, fontSize: 16 }}>{information + ""}</Text>
                            </View>
                        </View>
                    </Pressable>
                )
            }
            return (
                <View style={{ flexDirection: 'row', gap: 8, marginVertical: 10, alignItems: 'center' }}>
                    {style === 'flex-start' && <Image source={{ uri: avatar }} style={{ borderRadius: 40, width: 40, height: 40 }} />}
                    <View style={{ width: '100%', flexDirection: 'row', justifyContent: style }}>
                        <View style={{ backgroundColor: '#f5f5f5c3', maxWidth: '45%', overflow: 'hidden', minHeight: 38, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, justifyContent: 'center', borderRadius: 10 }}>
                            {information.map((item, index) => {
                                if (item.url.includes('/image___')) {
                                    return <TouchableOpacity onLongPress={() => handleTouchHover()} key={index} onPress={() => navigation.navigate("ImageDetail", { url: item.url })} style={{ position: 'relative' }}>
                                        <View style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}></View>
                                        <Image
                                            key={index}
                                            style={{
                                                width: information.length === 1 ? '100%' : information.length === 2 ? '50%' : '33.33%',
                                                aspectRatio: 1,
                                                borderRadius: 10,
                                                margin: 5,
                                            }}
                                            source={{ uri: item.url }}
                                        />
                                    </TouchableOpacity>

                                } else if (item.url.includes('/video___')) {
                                    return <TouchableOpacity onLongPress={() => handleTouchHover()} key={index} onPress={() => navigation.navigate("VideoDetail", { url: item.url })} style={{ position: 'relative' }}>
                                        <View style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}></View>
                                        <VideoPlayer key={index} url={item.url} style={{ width: 300, height: 300 }} />
                                    </TouchableOpacity>
                                } else if (item.url.includes('/audio___')) {
                                    return <TouchableOpacity key={index} onLongPress={() => handleTouchHover()}>
                                        <AudioPlayer key={index} url={item.url} />
                                    </TouchableOpacity>
                                } else {
                                    const type = item.url.split('___')[0].split('/')[item.url.split('___')[0].split('/').length - 1]
                                    return <TouchableOpacity onPress={() => navigation.navigate("Read", { url: item.url })} onLongPress={() => handleTouchHover()} key={index} style={{ flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 10, width: '100%' }}>
                                        <Image source={fileTypes[type]} style={{ width: 50, aspectRatio: 1 }} />
                                        <View style={{ flexDirection: 'column', width: 300, gap: 1 }}>
                                            <Text style={{ lineHeight: 18, fontSize: 13, fontWeight: '700' }}>{`${item.name}.${type}`.length >= 13 ? `${item.name}.${type}`.substring(0, 13) + "..." : `${item.name}.${type}`}</Text>
                                            <Text style={{ fontSize: 10, fontWeight: '600' }}>{`${item.size >= 1024 ? `${(item.size / 1024).toFixed(2)} MB` : `${item.size} KB`}`}</Text>
                                        </View>
                                    </TouchableOpacity>
                                }
                            })}
                        </View>
                    </View>
                </View>
            )

        }
    }
    if (message.typeMessage === 'notify')
        return (
            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'center', paddingVertical: 10 }}>
                <Text style={{ width: '80%', textAlign: 'center' }}>{message.information}</Text>
            </View>
        )
    else
        return (
            <View style={{}}>
                {(message.reply?._id && message.disabled === false) && (
                    <View style={{ overflowWrap: 'break-word', top: 10, flexDirection: 'row', justifyContent: style, left: style === 'flex-start' ? 45 : 0 }}>
                        <Text style={{ backgroundColor: '#f5f5f5c3', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5 }}><Icon name='reply' style={{ color: '#999', fontSize: 17, marginRight: 5 }} /> {message.reply.information}</Text>
                    </View>
                )}
                {(message.transfer === true && message.disabled === false) && (
                    <View style={{ overflowWrap: 'break-word', top: 10, flexDirection: 'row', justifyContent: style, left: style === 'flex-start' ? 45 : 0 }}>
                        <Text style={{ backgroundColor: '#f5f5f5c3', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5 }}><Icon1 name='chart-line-variant' style={{ color: '#999', fontSize: 17, marginRight: 5 }} /> {message.user_id === data.user._id ? 'You forwarded 1 message' : `${messageData.currentRoom.users.filter(user => user._id === message.user_id)[0]?.fullName.split(' ')[messageData.currentRoom.users.filter(user => user._id === message.user_id)[0].fullName.split(' ').length - 1]} forwarded 1 message`}</Text>
                    </View>
                )}
                {messageItem()}
                <View>
                    {!disabled && message.emojis?.length > 0 &&
                        <View style={{ left: style === 'flex-start' ? 50 : 0, marginTop: -20, flexDirection: 'row', justifyContent: style }}>
                            {message.emojis.map((e, index) => {
                                if (index <= 3)
                                    return <View key={index} style={{ backgroundColor: '#f5f5f5c3', padding: 3, borderRadius: 15 }}>
                                        <Text key={index} style={{ fontSize: 10 }}>{emoji(e.status)}</Text>
                                    </View>
                            })}
                        </View>
                    }
                    <Animated.View ref={emojiRef} style={{ width: '100%', height: displayEmoji === id ? 'auto' : 0, opacity: height, overflow: 'hidden', flexDirection: 'row', justifyContent: style, top: -7 }}>
                        {style === 'flex-start' && <View style={{ width: 40 }}></View>}
                        <View style={{ backgroundColor: '#f5f5f5c3', borderRadius: 15, paddingVertical: 5, flexDirection: 'column', justifyContent: 'center' }}>
                            <View style={{ flexDirection: 'row', width: 'auto', gap: 5, paddingHorizontal: 10 }}>
                                <TouchableOpacity onPress={() => handleSendEmoji('likelike')} >
                                    <Text style={{ fontSize: 19 }}>{emojiStatus.likelike}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleSendEmoji('like')} >
                                    <Text style={{ fontSize: 19 }}>{emojiStatus.like}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleSendEmoji('smile')} >
                                    <Text style={{ fontSize: 19 }}>{emojiStatus.smile}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleSendEmoji('wow')} >
                                    <Text style={{ fontSize: 19 }}>{emojiStatus.wow}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleSendEmoji('sad')} >
                                    <Text style={{ fontSize: 19 }}>{emojiStatus.sad}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleSendEmoji('angry')} >
                                    <Text style={{ fontSize: 19 }}>{emojiStatus.angry}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: 'row', width: 'auto', gap: 5, paddingHorizontal: 10, borderRadius: 15, paddingVertical: 5 }}>
                                <TouchableOpacity onPress={() => handleSendDisable()} >
                                    <Icon name='delete-left' style={{ color: '#999', fontSize: 17, marginRight: 5 }} />
                                </TouchableOpacity>
                                {message.typeMessage === 'text' && (
                                    <TouchableOpacity onPress={() => {
                                        messageHandler.setReply(message);
                                        setDisplayEmoji("")
                                    }} >
                                        <Icon name='reply' style={{ color: '#999', fontSize: 17, marginRight: 5 }} />
                                    </TouchableOpacity>
                                )}
                                <TouchableOpacity onPress={() => navigation.navigate('TransferMessageScreen', { message })}>
                                    <Icon1 name='chart-line-variant' style={{ color: '#999', fontSize: 20, marginRight: 5 }} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Animated.View>
                </View>
                <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'flex-end' }}>
                    {messageData.usersSeen?.filter(item => (item._id !== data.user?._id && item.seen === message._id)).map((user, index) =>
                        <Image key={index} source={{ uri: user.avatar }} style={{ height: 15, width: 15, borderRadius: 15 }} />
                    )}
                </View>
            </View >
        )
}

export default MessageSection