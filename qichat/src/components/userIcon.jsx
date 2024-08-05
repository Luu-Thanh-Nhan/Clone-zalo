import { tinhSoPhutChamIcon } from '@/utils/time'
import React from 'react'

const UserIcon = ({ avatar, operating, show, isStranger, size }) => {
    return (
        <div style={size ? { width: `${size}px`, height: `${size}px` } : { width: '42px', height: '42px' }} className=' mx-[2px] relative rounded-full'>
            <img src={avatar ? avatar : '/avatar.jpg'} className='w-[100%] h-[100%] rounded-full' />
            {isStranger ?
                <div className='h-[13px] bottom-[0px] right-[-1px] w-[13px] absolute bg-[white] rounded-full flex items-center justify-center'><i className='bx bxl-meta text-[13px]'></i></div>
                :
                operating?.status ?
                    <div className='h-[13px] bottom-[0px] right-[-1px] w-[13px] absolute bg-[#2fd12f] rounded-full'></div>
                    :
                    show === true && <div className='py-1 px-1 bottom-[-2px] right-[-5px] bg-[black] absolute text-[9px] font-poppins font-bold text-[white] rounded-full'>{!tinhSoPhutChamIcon(operating?.time) ? '0s' : tinhSoPhutChamIcon(operating?.time)}</div>
            }
        </div>
    )
}

export default UserIcon