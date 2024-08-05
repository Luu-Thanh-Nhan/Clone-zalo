import React, { useEffect, useRef } from 'react';

export const VideoPlayer = ({ user }) => {
    const ref = useRef();

    useEffect(() => {
        user.videoTrack.play(ref.current);
    }, []);

    return (
        <div
            className='w-[100%] h-[100%] relative'
            ref={ref}
        >
            <span className='absolute bottom-2 left-3 text-[white] font-medium'>Participant</span>
        </div>
    );
};