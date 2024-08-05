import React, { useContext } from 'react'
import UserIcon from '../userIcon'
import { TypeHTTP, api } from '@/utils/api'
import { ThemeContext } from '@/app/context'

const ReportedFrom = ({ reports }) => {

    const { data, handler } = useContext(ThemeContext)

    return (
        <div style={reports?.length > 0 ? { width: '500px', minHeight: '400px', padding: '1rem' } : { width: '0px', height: '0px', padding: 0 }} className='flex flex-col gap-1 overflow-hidden z-50 transition-all w-[400px] h-[350px] bg-[white] rounded-md fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] overflow-y-auto'>
            {reports?.map((report, index) => {
                return <div key={index} className='relative p-[0.5rem] flex flex-col gap-1 w-full text-[13px] rounded-md border-[#d7d7d7] border-[1px]'>
                    <div className='absolute top-1 right-1 flex gap-1 items-center'>
                        <span>From </span>
                        <UserIcon avatar={report.fromUser.avatar} size={32} />
                        <span className='text-[12px] font-medium'>{report.fromUser.fullName}</span>
                    </div>
                    <h5 className='text-[15px] font-medium'>Report: {report.title}</h5>
                    <textarea cols={4} readOnly value={report.body} className='focus:outline-none w-full max-h-[80px]'></textarea>
                    <div className='flex gap-1 items-center'>
                        <span>To </span>
                        <UserIcon avatar={report.toUser.avatar} size={32} />
                        <span className='text-[12px] font-medium'>{report.toUser.fullName}</span>
                        <button onClick={() => { handler.hiddenReported(); handler.showWarningForm(report); }} className='text-[12px] px-[10px] py-[3px] rounded-lg bg-[#df800c] text-[white] font-medium'>Warning</button>
                    </div>
                    <div style={{ justifyContent: 'start' }} className='gallery flex gap-1 justify-center flex-wrap mt-3 items-center h-[70px] overflow-hidden z-0 p-[4px] rounded-lg text-[14px]'>
                        {Array.isArray(report.message.information) ? report.message.information.map((item, index) => {
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
                            <span>{report.message.information}</span>
                        }
                    </div>
                    {report.watched === true && <div className='absolute bottom-1 right-3 bg-[green] text-[white] px-4 py-2 rounded-lg'>
                        Watched
                    </div>}
                </div>
            })}

        </div >
    )
}

export default ReportedFrom