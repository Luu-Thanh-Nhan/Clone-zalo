import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <section style={{ backgroundImage: 'url(/bg.webp)' }} className='relative flex items-center font-poppins px-[4rem] h-screen w-[100%] bg-cover'>
      <div className='absolute flex items-center w-full px-[4rem] top-0 left-0 justify-between pt-[1rem]'>
        <div className='flex items-center'>
          <img width={'60px'} src='/logo.png' />
          <span className='text-[white] font-bold text-[24px]'>QiChat</span>
        </div>
        <div className='font-semibold'>
          <Link href={'/sign-up'}><button className='rounded-full text-[15px] px-[20px] h-[35px] bg-[white] font-bold mr-[15px]'>Sign Up</button></Link>
          <Link href={'/sign-in'}><button className='text-[white] text-[15px] font-bold'>Sign In</button></Link>
        </div>
      </div>
      <div className='flex items-center w-[100%] justify-center'>
        <div className='w-[600px] h-full flex flex-col justify-center items-start gap-[1rem]'>
          <span className='rounded-[20px] font-semibold text-[white] bg-[#FFB800] px-[1.5rem] py-[0.5rem]'>Hello My Family!!!</span>
          <h1 className='text-[50px] text-[white] leading-[65px] font-semibold'>
            {"It's A Good Platform For Message Sharing"}
          </h1>
          <span className='text-[white] border-[white] border-l-[4px] text-[20px] pl-[0.5rem]'>Helps you connect with people, share knowledge and experiences.</span>
          <button className='px-[1rem] py-[0.5rem] rounded-full text-[15px] text-[white] font-semibold bg-[#FFB800]'>START FREE</button>
        </div>
        <img className='w-[650px]' src='/banner.png' />
      </div>
    </section>
  );
}
