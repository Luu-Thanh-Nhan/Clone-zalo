import React from 'react'

const Logo = ({ text }) => {
    return (
        <div className='font-poppins flex items-center'>
            <img width={'60px'} src='/logo.png' />
            <span className={`text-[${text}] font-bold text-[25px]`}>QiChat</span>
        </div >
    )
}

export default Logo