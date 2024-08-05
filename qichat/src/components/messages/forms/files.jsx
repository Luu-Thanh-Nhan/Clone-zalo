import React, { useContext } from 'react'
import { MessagesContext } from '../context'
import { ThemeContext } from '@/app/context'

const Files = ({ files }) => {
    const { handler } = useContext(ThemeContext)
    const { listData, listHandler } = useContext(MessagesContext)
    return (
        <div style={{ height: files?.length !== 0 ? '500px' : '0', width: files?.length !== 0 ? 'auto' : '0' }} className='z-10 fixed transition-all top-[50%] left-[50%] translate-x-[-50%] flex translate-y-[-50%] overflow-hidden rounded-xl bg-slate-50'>
            <div className='row'>
                <div className='p-4'>
                    <span className='font-semibold'>{`Attachments (${files?.length} items)`}</span>
                </div>
                <div className='h-[85%] w-[100% overflow-y-auto'>
                    <div className=' grid grid-cols-4 gap-3 row w-100% justify-center px-3'>
                        {files.map((item, index) => {
                            if (item && item.url && item.url.split) {
                                if (item.url.split('___')[0].split('/')[item.url.split('___')[0].split('/').length - 1] !== 'audio') {
                                    return (
                                        <a target='_blank' href={item.url} key={index} className='w-full flex items-center gap-2 my-[2px]'>
                                            <img className='w-[35px]' src={`/${item.url.split('___')[0].split('/')[item.url.split('___')[0].split('/').length - 1]}.png`} />
                                            <span className='text-[13px] my-[4px]'>{`${item.name.substring(0, 25)}${item.name.length >= 25 ? '...' : `.${item.url.split('___')[0].split('/')[item.url.split('___')[0].split('/').length - 1]}`}`}</span>
                                        </a>
                                    );
                                }
                            }
                        })}
                    </div>
                </div>

            </div>
            <button onClick={() => listHandler.setFiles([])} className='text-[#999] absolute top-2 right-2'><i className='text-[28px] bx bx-x'></i></button>
        </div>
    )
}

export default Files