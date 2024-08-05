import React, { useContext, useState } from 'react'
import UserIcon from '../userIcon';
import { ThemeContext, notifyType } from '@/app/context';
import { TypeHTTP, api } from '@/utils/api';

const BlockFrom = ({ user }) => {

    const { handler } = useContext(ThemeContext)
    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')
    const [files, setFiles] = useState([])

    const handleSummitBlock = () => {
        const filesData = files.map(item => item.file);
        const formData = new FormData();
        formData.append("id", user._id)
        formData.append('title', title);
        formData.append('body', body);
        filesData.forEach((file, index) => {
            formData.append(`image`, file);
        });
        api({ type: TypeHTTP.POST, sendToken: true, path: '/users/block-all', body: formData })
            .then(res => {
                handler.notify(notifyType.SUCCESS, "Locked Account")
                handler.hiddenBlockForm()
                setTimeout(() => {
                    globalThis.window.location.reload()
                }, 1000);
            })
    }

    const handleFiles = (e) => {
        const files = e.target.files
        for (let i = 0; i < files.length; i++) {
            if (files[i]) {
                const url = URL.createObjectURL(files[i])
                const file = files[i]
                if (file.type.split('/')[0] === 'image') {
                    setFiles(prev => {
                        return [...prev, {
                            path: url,
                            file: file,
                            type: 'image'
                        }]
                    })
                }
            }
        }
        e.target.value = ''
    }

    return (
        <div style={user ? { width: '500px', height: '400px', padding: '1rem' } : { width: '0px', height: '0px', padding: 0 }} className='flex flex-col gap-1 overflow-x-hidden overflow-y-auto z-50 transition-all bg-[white] rounded-md fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] overflow-y-auto'>
            <h3 className='text-[20px] font-semibold font-poppins'>Block Form</h3>
            <div>
                <input value={title} onChange={(e) => setTitle(e.target.value)} type='text' placeholder='Title' className='text-[13px] pl-[10px] pr-[10px] w-full h-[35px] focus:outline-0 rounded-md border-[#cacaca] mt-[5px] border-[1px]' />
                <textarea value={body} onChange={e => setBody(e.target.value)} placeholder='Body' className='text-[13px] p-[10px] w-full h-[170px] focus:outline-0 rounded-md border-[#cacaca] mt-[5px] border-[1px]' />
                {/* <input onChange={handleFiles} accept='image/' multiple type='file' className='text-[13px] my-2' /> */}
                <div className='flex justify-end gap-2 mt-2'>
                    <button onClick={() => handler.hiddenBlockForm()} className='text-[12px] px-[10px] py-[7px] rounded-lg bg-[red] text-[white] font-medium'>Cancel</button>
                    <button onClick={() => handleSummitBlock()} className='text-[12px] px-[10px] py-[7px] rounded-lg bg-[green] text-[white] font-medium'>Submit</button>
                </div>
            </div>
        </div>
    )
}

export default BlockFrom