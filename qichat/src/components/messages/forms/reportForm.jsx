import { ThemeContext, notifyType } from '@/app/context'
import { TypeHTTP, api } from '@/utils/api'
import React, { useContext, useEffect, useState } from 'react'

const ReportForm = ({ report }) => {
    const { handler } = useContext(ThemeContext)
    const [re, setReport] = useState()
    useEffect(() => setReport(report), [report])

    const handleReport = () => {
        if (re.title === '') {
            return
        }
        if (re.body === '') {
            return
        }
        handler.notify(notifyType.LOADING, "Sending Report")
        api({ body: { report: re }, type: TypeHTTP.POST, sendToken: true, path: "/reports" })
            .then(res => {
                handler.notify(notifyType.SUCCESS, "Sended Report")
                handler.hiddenReport()
            })
    }

    return (
        <div style={report ? { width: '500px', minHeight: '400px', padding: '1rem' } : { width: '0px', height: '0px', padding: 0 }} className='flex flex-col gap-1 overflow-hidden z-50 transition-all w-[400px] h-[350px] bg-[white] rounded-md fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]'>
            <h3 className='text-[20px] font-medium'>Report</h3>
            <input value={re?.title} onChange={e => setReport({ ...re, title: e.target.value })} type='text' placeholder='Title' className='text-[13px] pl-[10px] pr-[10px] w-full h-[35px] focus:outline-0 rounded-md border-[#cacaca] mt-[5px] border-[1px]' />
            <textarea value={re?.body} onChange={e => setReport({ ...re, body: e.target.value })} placeholder='Body' className='text-[13px] p-[10px] w-full h-[170px] focus:outline-0 rounded-md border-[#cacaca] mt-[5px] border-[1px]'>
            </textarea>
            <div className='flex flex-col px-[1rem] mt-2 gap-1 w-full border-[#999] border-[1px] rounded-lg'>
                <h5 className='text-[14px] font-medium mt-1 text-[#999]' >Report Message</h5>
                <div className='w-full flex py-2 gap-4'>
                    {Array.isArray(re?.message.information) ?
                        <div style={{ justifyContent: 'start' }} className='gallery flex gap-1 justify-center flex-wrap items-center h-[70px] overflow-hidden z-0 p-[4px] rounded-lg text-[14px]'>
                            {re.message.information.map((item, index) => {
                                if (item.url?.includes('/image___')) {
                                    return <img style={{ height: re.message.information.length === 1 ? 'calc(100% - 5px)' : re.message.information.length === 2 ? 'calc(50% - 5px)' : 'calc(33.33% - 5px)' }} onClick={() => handler.showImage(item.url)} key={index} src={item.url} className='rounded-xl cursor-pointer max-w-[100%]' />
                                } else if (item.url?.includes('/video___')) {
                                    return <video style={{ height: re.message.information.length === 1 ? 'calc(100% - 5px)' : 'calc(50% - 5px)' }} controls key={index} src={item.url} className='rounded-xl cursor-pointer' />
                                } else if (item.url?.includes('/audio___')) {
                                    return <audio controls key={index} src={item.url} className='rounded-xl cursor-pointer w-[200px] h-[20px]' />
                                } else {
                                    const type = item.url?.split('___')[0].split('/')[item.url?.split('___')[0].split('/').length - 1]
                                    return <a key={index} target='_blank' href={item.url}>
                                        <div className='max-w-[300px] flex justify-around items-center relative'>
                                            <img src={`/${type}.png`} className='w-[28%]' />
                                            <div className='flex flex-col w-[65%] '>
                                                <span className='leading-[22px] text-[13px] font-medium'>{`${item.name}.${type}`.substring(0, 20)}{`${item.name}.${type}`.length > 20 ? '...' : ''}</span>
                                                <span className='leading-[22px] text-[12px] font-semibold'>{`${item.size >= 1024 ? `${(item.size / 1024).toFixed(2)} MB` : `${item.size} KB`}`}</span>
                                            </div>
                                        </div>
                                    </a>
                                }
                            })}
                        </div>
                        :
                        <div style={{ overflowWrap: 'break-word' }} className='leading-[21px] overflow-wrap max-w-[170px] z-0 bg-[#e4e4e47c] px-[10px] py-[7px] rounded-lg text-[14px]'>
                            {re?.message.information + ""}
                        </div>
                    }
                    <div className='flex gap-2 items-center'>
                        <span className='text-[14px]'>From</span>
                        <img src={re?.toUser.avatar} className='w-[40px] rounded-full' />
                        <span className='text-[14px] font-medium'>{re?.toUser.fullName}</span>
                    </div>
                </div>

            </div>
            <div className='flex items-center my-2'>
                <button onClick={() => handleReport()} className='text-[13px] px-[10px] py-[4px] rounded-lg bg-[#e5e52c] text-[white] font-medium ml-1'>{`Report`}</button>
                <button onClick={() => handler.hiddenReport()} className='text-[13px] px-[10px] py-[4px] rounded-lg bg-[red] text-[white] font-medium ml-1'>Cancel</button>
            </div>
        </div>
    )
}

export default ReportForm