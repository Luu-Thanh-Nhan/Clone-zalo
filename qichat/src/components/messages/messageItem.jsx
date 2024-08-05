import { ThemeContext } from '@/app/context'
import React, { useContext } from 'react'

const MessageItem = ({ message, type, style }) => {

    const { handler } = useContext(ThemeContext)

    if (type === 'loading') {
        return (
            <div className='w-[100%] flex' style={{ alignContent: style }}>
                <div className='leading-[21px] overflow-wrap max-w-[250px] z-0 bg-[#e4e4e47c] px-[10px] py-[7px] rounded-lg text-[14px]'>
                    <div role="status">
                        <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-[black]" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                        </svg>
                    </div>
                </div>
            </div>
        )
    }
    if (type === 'text') {
        return (
            <div style={{ overflowWrap: 'break-word' }} className='leading-[21px] overflow-wrap max-w-[250px] z-0 bg-[#e4e4e47c] px-[10px] py-[7px] rounded-lg text-[14px]'>
                {message}
            </div>
        )
    }
    return <div className='max-w-[300px] bg-[#e4e4e47c] rounded-2xl py-[5px]'>
        <div style={{ justifyContent: style }} className='gallery leading-[30px] flex gap-1 justify-center flex-wrap items-center w-[auto] z-0 p-[4px] rounded-lg text-[14px]'>
            {message.map((item, index) => {
                if (item.url?.includes('/image___')) {
                    return <img style={{ width: message.length === 1 ? 'calc(100% - 5px)' : message.length === 2 ? 'calc(50% - 5px)' : 'calc(33.33% - 5px)' }} onClick={() => handler.showImage(item.url)} key={index} src={item.url} className='rounded-xl cursor-pointer max-w-[100%]' />
                } else if (item.url?.includes('/video___')) {
                    return <video style={{ width: message.length === 1 ? 'calc(100% - 5px)' : 'calc(50% - 5px)' }} controls key={index} src={item.url} className='rounded-xl cursor-pointer' />
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
    </div>
}

export default MessageItem