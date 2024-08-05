import React, { createContext, useEffect, useState } from 'react'
import { TypeHTTP, api, baseURL } from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, AppState } from 'react-native';
import { io } from 'socket.io-client'
const socket = io.connect(baseURL)

export const globalContext = createContext()

const GlobalContext = ({ children }) => {
    const [user, setUser] = useState()

    const showAlert = (title, message, onCancel, onOK) => {
        Alert.alert(
            title,
            message,
            [
                {
                    text: 'Cancel',
                    onPress: onCancel,
                    style: 'cancel'
                },
                {
                    text: 'OK',
                    onPress: onOK
                }
            ],
            { cancelable: false }
        );
    };

    useEffect(() => {
        const handleAppStateChange = (nextAppState) => {
            if (nextAppState === 'background') {
                socket.emit('close_operating', { _id: user?._id, operating: { status: false, time: new Date() } })
            } else if (nextAppState === 'active') {
                if (user?._id) {
                    const userUpdate = user
                    userUpdate.operating = {
                        status: true,
                        time: new Date()
                    }
                    api({ type: TypeHTTP.PUT, sendToken: false, path: `/users/${userUpdate?._id}`, body: userUpdate })
                        .then(res => {
                            const friends_id = res.friends.map(item => item?._id)
                            friends_id.push(res._id)
                            socket.emit('update-room', friends_id)
                        })
                }
            }
        };
        AppState.addEventListener('change', handleAppStateChange);

        // return () => {
        //     AppState.removeEventListener('change', handleAppStateChange);
        // };
    }, [user]);

    const checkToken = (pathname) => new Promise(async (resolve, reject) => {
        const publics = ['SignInScreen', 'SignUpScreen', 'VerificationScreen', 'InformationScreen', 'PublicScreen']
        const accessToken = await AsyncStorage.getItem('accessToken')
        const refreshToken = await AsyncStorage.getItem('refreshToken')
        if (!accessToken)
            if (!refreshToken)
                if (!publics.includes(pathname))
                    resolve('SignInScreen')
        if (!publics.includes(pathname)) {
            api({ type: TypeHTTP.GET, sendToken: true, path: '/get-user-by-tokens' })
                .then(user => {
                    setUser(user)
                    if (user.disable === true) {
                        handler.showAlert("Fail", "This account has been locked")
                        resolve('Lock')
                    } else {
                        user.operating = {
                            status: true,
                            time: new Date()
                        }
                        api({ type: TypeHTTP.PUT, sendToken: false, path: `/users/${user._id}`, body: user })
                            .then(res => {
                                const friends_id = res.friends.map(item => item._id)
                                friends_id.push(res._id)
                                socket.emit('update-room', friends_id)

                            })
                    }
                })
                .catch(async (error) => {
                    await AsyncStorage.removeItem('accessToken')
                    await AsyncStorage.removeItem('refreshToken')
                    resolve('PublicScreen')
                })
        } else {
            api({ type: TypeHTTP.GET, sendToken: true, path: '/get-user-by-tokens' })
                .then(user => {
                    setUser(user)
                    resolve('MessageScreen')
                })
        }
    })


    const data = {
        user
    }

    const handler = {
        setUser,
        checkToken,
        showAlert
    }

    return (
        <globalContext.Provider value={{ data, handler }}>
            {children}
        </globalContext.Provider>
    )
}

export default GlobalContext