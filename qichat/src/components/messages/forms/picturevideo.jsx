import React, { useContext } from 'react'
import { MessagesContext } from '../context'
import { ThemeContext } from '@/app/context'

const PictureVideo = ({ pictureVideos }) => {
    const { handler } = useContext(ThemeContext)
    const { listData, listHandler } = useContext(MessagesContext)

    return (
        <div style={{ height: pictureVideos?.length !== 0 ? '500px' : '0', width: pictureVideos?.length !== 0 ? 'auto' : '0' }} className='z-10 fixed transition-all top-[50%] left-[50%] translate-x-[-50%] flex translate-y-[-50%] overflow-hidden rounded-xl bg-slate-50'>
            <div className='row'>
                <div className='p-4'>
                    <span className='font-semibold'>{`Pictures & Videos (${pictureVideos?.length} items)`}</span>
                </div>
                <div className='h-[85%] w-[100% overflow-y-auto'>
                    <div className=' grid grid-cols-5 gap-3 row w-100% justify-center px-3'>
                        {pictureVideos.map((item, index) => {
                            if (item.url.includes('.amazonaws.com/image_')) {
                                return <img onClick={() => handler.showImage(item.url)} key={index} src={item.url} className='cursor-pointer aspect-square rounded-lg' />
                            } else if (item.url.includes('.amazonaws.com/video_')) {
                                return <div onClick={() => handler.showVideo(item.url)} key={index} style={{ backgroundImage: `url(/bg.webp)`, backgroundSize: 'cover' }} className='cursor-pointer relative overflow-hidden aspect-square w-full rounded-md' >
                                    <video className='w-[100%] translate-y-[-40%] rounded-md' src={item.url} />
                                    <i className='bx text-[40px] text-[white] shadow-2xl bx-play absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]'></i>
                                </div>
                            }
                        })}
                    </div>
                </div>

            </div>
            <button onClick={() => listHandler.setPictureVideos([])} className='text-[#999] absolute top-2 right-2'><i className='text-[28px] bx bx-x'></i></button>
        </div>
    )
}

export default PictureVideo