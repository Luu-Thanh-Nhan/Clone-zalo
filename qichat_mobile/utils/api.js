import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
// export const baseURL = 'http://localhost:8080'
export const systemID = '5f4a3e1b2c3d4e5f67890abc'
export const baseURL = 'http://192.168.1.5:8080'
// export const baseURL = 'https://shoeshop-backend.online'
axios.defaults.baseURL = `${baseURL}/v1/api`

export const TypeHTTP = {
    GET: 'get',
    POST: 'post',
    PUT: 'put',
    DELETE: 'delete'
}

export const api = async ({ path, body, type, sendToken }) => {
    const accessToken = await AsyncStorage.getItem('accessToken')
    const refreshToken = await AsyncStorage.getItem('refreshToken')
    const user_id = await AsyncStorage.getItem('user_id')
    const admin = await AsyncStorage.getItem('admin')
    return new Promise(async (rejects, resolve) => {
        switch (type) {
            case TypeHTTP.GET:
                axios.get(path, { headers: sendToken ? { accessToken, refreshToken, userid: user_id, admin } : {} })
                    .then(async (res) => {
                        if (sendToken) {
                            await AsyncStorage.setItem('accessToken', res.data.tokens.accessToken)
                            await AsyncStorage.setItem('refreshToken', res.data.tokens.refreshToken)
                            rejects(res.data.data)
                        } else {
                            rejects(res.data)
                        }
                    })
                    .catch(res => {
                        resolve({ status: res.response?.status, message: res.response?.data })
                    })
                break
            case TypeHTTP.POST:
                axios.post(path, body, { headers: sendToken ? { accessToken, refreshToken, userid: user_id, admin } : {} })
                    .then(async (res) => {
                        if (sendToken) {
                            await AsyncStorage.setItem('accessToken', res.data.tokens.accessToken)
                            await AsyncStorage.setItem('refreshToken', res.data.tokens.refreshToken)
                            rejects(res.data.data)
                        } else {
                            rejects(res.data)
                        }
                    })
                    .catch(res => {
                        resolve({ status: res.response?.status, message: res.response?.data })
                    })
                break
            case TypeHTTP.PUT:
                axios.put(path, body, { headers: sendToken ? { accessToken, refreshToken, userid: user_id, admin } : {} })
                    .then(async (res) => {
                        if (sendToken) {
                            await AsyncStorage.setItem('accessToken', res.data.tokens.accessToken)
                            await AsyncStorage.setItem('refreshToken', res.data.tokens.refreshToken)
                            rejects(res.data.data)
                        } else {
                            rejects(res.data)
                        }
                    })
                    .catch(res => {
                        resolve({ status: res.response?.status, message: res.response?.data })
                    })
                break
            case TypeHTTP.DELETE:
                axios.delete(path, { headers: sendToken ? { accessToken, refreshToken, userid: user_id, admin } : {} })
                    .then(async (res) => {
                        if (sendToken) {
                            await AsyncStorage.setItem('accessToken', res.data.tokens.accessToken)
                            await AsyncStorage.setItem('refreshToken', res.data.tokens.refreshToken)
                            rejects(res.data.data)
                        } else {
                            rejects(res.data)
                        }
                    })
                    .catch(res => {
                        resolve({ status: res.response?.status, message: res.response?.data })
                    })
                break
        }
    })
}