'use client'
import BlockFrom from "@/components/admin/blockForm";
import ReportedFrom from "@/components/admin/reportedFrom";
import WarningFrom from "@/components/admin/warningFrom";
import FormTransfer from "@/components/formTransfer";
import ReportForm from "@/components/messages/forms/reportForm";
import Notification from "@/components/notification";
import FormInformation from "@/components/user/formInformation";
import { TypeHTTP, api, baseURL } from "@/utils/api";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useEffect, useRef, useState } from "react";
import { io } from 'socket.io-client'
const socket = io.connect(baseURL)
export const ThemeContext = createContext();

export const notifyType = {
    SUCCESS: 'success',
    FAIL: 'fail',
    WARNING: 'warning',
    LOADING: 'loading',
    NONE: 'none'
}

export const ProviderContext = ({ children }) => {
    const pathname = usePathname()
    const router = useRouter();
    const wrapperRef = useRef()
    const publicRoutes = ['/', '/sign-in', '/sign-up', '/sign-up/verification', '/sign-up/information', '/sign-up/email-verification']
    const [user, setUser] = useState()
    const [info, setInfo] = useState({ status: notifyType.NONE, message: '' })
    const [userInformation, setUserInformation] = useState()
    const [urlImage, setUrlImage] = useState('')
    const [urlVideo, setUrlVideo] = useState('')
    const [transfer, setTransfer] = useState()
    const [adminVisible, setAdminVisible] = useState(false)
    const [reported, setReported] = useState()
    const [report, setReport] = useState()
    const [warningReport, setWarningReport] = useState()
    const [userBlock, setUserBlock] = useState()


    useEffect(() => {
        if (info.status !== notifyType.NONE) {
            if (info.status !== notifyType.LOADING) {
                setTimeout(() => {
                    setInfo({ status: notifyType.NONE, message: '' })
                }, 3000);
            }
        }
    }, [info.status])

    useEffect(() => {
        const onBeforeUnload = (ev) => {
            socket.emit('close_operating', { _id: user._id, operating: { status: false, time: new Date() } })
        };
        globalThis.addEventListener("beforeunload", onBeforeUnload);

        return () => {
            globalThis.addEventListener("beforeunload", onBeforeUnload);
        }
    }, [pathname, user]);

    useEffect(() => {
        if (pathname !== '/forgot-password') {
            if (!publicRoutes.includes(pathname)) {
                api({ type: TypeHTTP.GET, sendToken: true, path: '/get-user-by-tokens' })
                    .then(user => {
                        setUser(user)
                        if (user.disable === true) {
                            handler.notify(notifyType.FAIL, 'This account has been locked')
                            router.push('/lock')
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
                    .catch((error) => {
                        globalThis.localStorage.removeItem('accessToken')
                        globalThis.localStorage.removeItem('refreshToken')
                        router.push('/')
                    })
            } else {
                api({ type: TypeHTTP.GET, sendToken: true, path: '/get-user-by-tokens' })
                    .then(user => {
                        setUser(user)
                        router.push('/messages')
                    })
            }
        }
    }, [pathname])

    const notify = (status, message) => setInfo({ status, message })


    const showWrapper = () => {
        wrapperRef.current.style.display = 'block'
    }

    const hiddenWrapper = () => {
        wrapperRef.current.style.display = 'none'
    }

    const showUserInformation = (userInfo) => {
        showWrapper()
        setUserInformation(userInfo)
    }

    const hiddenUserInformation = (userInfo) => {
        hiddenWrapper()
        setUserInformation(undefined)
    }

    const showImage = (path) => {
        showWrapper()
        setUrlImage(path)
    }

    const hiddenImage = () => {
        hiddenWrapper()
        setUrlImage('')
    }

    const showTransfer = (message) => {
        showWrapper()
        setTransfer(message)
    }

    const hiddenTransfer = () => {
        hiddenWrapper()
        setTransfer(undefined)
    }

    const showVideo = (path) => {
        showWrapper()
        setUrlVideo(path)
    }

    const hiddenVideo = () => {
        hiddenWrapper()
        setUrlVideo('')
    }

    const hiddenReport = () => {
        hiddenWrapper()
        setReport(undefined)
    }

    const hiddenReported = () => {
        hiddenWrapper()
        setReported([])
    }

    const showReported = (reports) => {
        showWrapper()
        setReported(reports)
    }
    const showReport = (report) => {
        showWrapper()
        setReport(report)
    }

    const showWarningForm = (report) => {
        showWrapper()
        setWarningReport(report)
    }

    const hiddenWarningForm = () => {
        hiddenWrapper()
        setWarningReport(undefined)
    }

    const showBlockForm = (user) => {
        showWrapper()
        setUserBlock(user)
    }

    const hiddenBlockForm = () => {
        hiddenWrapper()
        setUserBlock(undefined)
    }

    const data = {
        user,
        adminVisible,
    }

    const handler = {
        setUser,
        notify,
        showUserInformation,
        hiddenUserInformation,
        showImage,
        hiddenImage,
        showWrapper,
        hiddenWrapper,
        showVideo,
        hiddenVideo,
        showTransfer,
        hiddenTransfer,
        setAdminVisible,
        showReported,
        showReport,
        hiddenReport,
        hiddenReported,
        showWarningForm,
        hiddenWarningForm,
        showBlockForm,
        hiddenBlockForm
    }

    return (
        <ThemeContext.Provider value={{ data, handler }}>
            {children}
            <BlockFrom user={userBlock} />
            <WarningFrom report={warningReport} />
            <ReportedFrom reports={reported} />
            <ReportForm report={report} />
            <div ref={wrapperRef} onClick={() => { hiddenBlockForm(); hiddenWarningForm(); hiddenReport(); hiddenReported(); hiddenUserInformation(); hiddenImage(); hiddenVideo(); hiddenTransfer() }} className="wrapper fixed top-0 left-0 hidden w-screen h-screen z-50" />
            <FormTransfer transfer={transfer} />
            <Notification status={info.status} message={info.message} setInfomation={setInfo} />
            <FormInformation userInfo={userInformation} />
            <img src={urlImage} className="max-w-[400px] max-h-[500px] z-50 fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]" />
            <video src={urlVideo} style={{ display: urlVideo === '' ? 'none' : 'block' }} controls className="max-w-[400px] max-h-[500px] z-40 fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]" />
        </ThemeContext.Provider>
    )
} 