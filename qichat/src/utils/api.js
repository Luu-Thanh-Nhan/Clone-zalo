import axios from "axios";
export const baseURL = 'http://localhost:8080'
export const systemID = '5f4a3e1b2c3d4e5f67890abc'
// export const baseURL = 'https://shoeshop-backend.online'
axios.defaults.baseURL = `${baseURL}/v1/api`

export const TypeHTTP = {
    GET: 'get',
    POST: 'post',
    PUT: 'put',
    DELETE: 'delete'
}

export const api = ({ path, body, type, sendToken }) => {
    const accessToken = globalThis.localStorage.getItem('accessToken')
    const refreshToken = globalThis.localStorage.getItem('refreshToken')
    const user_id = globalThis.localStorage.getItem('user_id')
    const admin = globalThis.localStorage.getItem('admin')
    return new Promise((rejects, resolve) => {
        switch (type) {
            case TypeHTTP.GET:
                axios.get(path, { headers: sendToken ? { accessToken, refreshToken, userid: user_id, admin } : {} })
                    .then(res => {
                        if (sendToken) {
                            globalThis.localStorage.setItem('accessToken', res.data.tokens.accessToken)
                            globalThis.localStorage.setItem('refreshToken', res.data.tokens.refreshToken)
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
                    .then(res => {
                        if (sendToken) {
                            globalThis.localStorage.setItem('accessToken', res.data.tokens.accessToken)
                            globalThis.localStorage.setItem('refreshToken', res.data.tokens.refreshToken)
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
                    .then(res => {
                        if (sendToken) {
                            globalThis.localStorage.setItem('accessToken', res.data.tokens.accessToken)
                            globalThis.localStorage.setItem('refreshToken', res.data.tokens.refreshToken)
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
                    .then(res => {
                        if (sendToken) {
                            globalThis.localStorage.setItem('accessToken', res.data.tokens.accessToken)
                            globalThis.localStorage.setItem('refreshToken', res.data.tokens.refreshToken)
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