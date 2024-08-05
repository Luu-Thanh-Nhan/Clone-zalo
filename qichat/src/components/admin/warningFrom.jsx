import React, { useContext, useState } from 'react'
import UserIcon from '../userIcon';
import { ThemeContext, notifyType } from '@/app/context';
import { TypeHTTP, api } from '@/utils/api';

const WarningFrom = ({ report }) => {

    const { handler } = useContext(ThemeContext)
    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')

    const handleSubmitWarning = () => {
        const data = {
            title, body,
            message: report.message,
            id: report.toUser._id
        }
        api({ sendToken: true, type: TypeHTTP.POST, path: '/users/add-notification', body: data })
            .then(res => {
                api({ type: TypeHTTP.PUT, sendToken: true, path: `/reports/${report._id}`, body: { watched: true } })
                    .then(res => {
                        handler.notify(notifyType.SUCCESS, "Sended Warning Notification")
                        handler.hiddenWarningForm()
                    })
            })
    }

    return (
        <div style={report ? { width: '500px', height: '400px', padding: '1rem' } : { width: '0px', height: '0px', padding: 0 }} className='flex flex-col gap-1 overflow-x-hidden overflow-y-auto z-50 transition-all bg-[white] rounded-md fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] overflow-y-auto'>
            <h3 className='text-[20px] font-semibold font-poppins'>Warning Form</h3>
            <div className='relative p-[0.5rem] flex flex-col gap-1 w-full text-[13px] rounded-md border-[#d7d7d7] border-[1px]'>
                <div className='absolute top-1 right-1 flex gap-1 items-center'>
                    <span>From </span>
                    <UserIcon avatar={report?.fromUser.avatar} size={32} />
                    <span className='text-[12px] font-medium'>{report?.fromUser.fullName}</span>
                </div>
                <h5 className='text-[15px] font-medium'>Report: {report?.title}</h5>
                <textarea cols={4} readOnly value={report?.body} className='focus:outline-none w-full max-h-[80px]'></textarea>
                <div className='flex gap-1 items-center'>
                    <span>To </span>
                    <UserIcon avatar={report?.toUser.avatar} size={32} />
                    <span className='text-[12px] font-medium'>{report?.toUser.fullName}</span>
                </div>
                <div style={{ justifyContent: 'start' }} className='gallery flex gap-1 justify-center flex-wrap mt-3 items-center h-[70px] overflow-hidden z-0 p-[4px] rounded-lg text-[14px]'>
                    {Array.isArray(report?.message.information) ? report?.message.information.map((item, index) => {
                        if (item.url?.includes('/image___')) {
                            return <img style={{ height: report.message.information.length === 1 ? 'calc(100% - 5px)' : report.message.information.length === 2 ? 'calc(50% - 5px)' : 'calc(33.33% - 5px)' }} onClick={() => handler.showImage(item.url)} key={index} src={item.url} className='rounded-xl cursor-pointer max-w-[100%]' />
                        } else if (item.url?.includes('/video___')) {
                            return <video style={{ height: report.message.information.length === 1 ? 'calc(100% - 5px)' : 'calc(50% - 5px)' }} controls key={index} src={item.url} className='rounded-xl cursor-pointer' />
                        } else if (item.url?.includes('/audio___')) {
                            return <audio controls key={index} src={item.url} className='rounded-xl cursor-pointer w-[200px] h-[20px]' />
                        } else {
                            const type = item.url?.split('___')[0].split('/')[item.url?.split('___')[0].split('/').length - 1]
                            return <a key={index} target='_blank' href={item.url}>
                                <div className='max-w-[200px] flex justify-around items-center relative'>
                                    <img src={`/${type}.png`} className='w-[28%]' />
                                    <div className='flex flex-col w-[65%] '>
                                        <span className='leading-[22px] text-[13px] font-medium'>{`${item.name}.${type}`.substring(0, 20)}{`${item.name}.${type}`.length > 20 ? '...' : ''}</span>
                                        <span className='leading-[22px] text-[12px] font-semibold'>{`${item.size >= 1024 ? `${(item.size / 1024).toFixed(2)} MB` : `${item.size} KB`}`}</span>
                                    </div>
                                </div>
                            </a>
                        }
                    })
                        :
                        <span>{report?.message.information}</span>
                    }
                </div>
            </div>
            <div>
                <input value={title} onChange={e => setTitle(e.target.value)} type='text' placeholder='Title' className='text-[13px] pl-[10px] pr-[10px] w-full h-[35px] focus:outline-0 rounded-md border-[#cacaca] mt-[5px] border-[1px]' />
                <textarea value={body} onChange={e => setBody(e.target.value)} placeholder='Body' className='text-[13px] p-[10px] w-full h-[170px] focus:outline-0 rounded-md border-[#cacaca] mt-[5px] border-[1px]' />
                <div className='flex justify-end gap-2 mt-2'>
                    <button onClick={() => handler.hiddenWarningForm()} className='text-[12px] px-[10px] py-[7px] rounded-lg bg-[red] text-[white] font-medium'>Cancel</button>
                    <button onClick={() => handleSubmitWarning()} className='text-[12px] px-[10px] py-[7px] rounded-lg bg-[green] text-[white] font-medium'>Submit</button>
                </div>
            </div>
        </div>
    )
}

export default WarningFrom