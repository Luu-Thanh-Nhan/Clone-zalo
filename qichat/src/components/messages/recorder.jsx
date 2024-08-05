import React, { useEffect, useRef, useState } from 'react'
import { ReactMic } from 'react-mic'
import { formatElapsedTime, secondsToHms } from '@/utils/other';

const Recorder = ({ setIsRecording, sendMessage, setFiles }) => {

    const [elapsedTime, setElapsedTime] = React.useState(0);
    const [voice, setVoice] = React.useState(false);
    const [audioFile, setAudioFile] = React.useState(null);
    const [played, setPlayed] = useState(0)
    const interval = useRef()
    const audioRef = useRef()

    const onStop = (recordedBlob) => {
        handleConvertToAudioFile(recordedBlob.blobURL);
    };

    const startHandle = () => {
        setElapsedTime(0);
        interval.current = setInterval(() => {
            setElapsedTime(prev => prev + 1)
        }, 10);
        setVoice(true);
    };

    const stopHandle = () => {
        setVoice(false);
        clearInterval(interval.current)
    };

    const clearHandle = () => {
        setVoice(false);
        setElapsedTime(0);
        setAudioFile(null);
    };

    const handleConvertToAudioFile = (recordBlobLink) => {
        if (recordBlobLink) {
            fetch(recordBlobLink)
                .then(response => response.blob())
                .then(blob => {
                    setAudioFile(blob);
                });
        }
    };

    useEffect(() => {
        if (audioFile) {
            setFiles([{
                path: URL.createObjectURL(audioFile),
                file: audioFile,
                type: 'mp3.'
            }])
        }
    }, [audioFile])


    return (
        <div className='w-full px-[1rem]'>
            <div className='w-full rounded-lg border-[#f1f1f1] border-[2px] h-[50px] flex items-center px-[0.5rem] gap-2 justify-around'>
                {!audioFile ?
                    <>
                        {!voice ?
                            <button onClick={startHandle}><i className='bx bx-play-circle text-[#999] text-[35px] translate-y-[3px]'></i></button>
                            :
                            <button onClick={stopHandle}><i className='bx bx-stop-circle text-[#999] text-[35px] translate-y-[3px]'></i></button>
                        }
                        <ReactMic
                            record={voice}
                            className="sound-wave w-[88%] h-[30px] rounded-lg bg-[#999]"
                            onStop={onStop}
                            strokeColor="#000000"
                        />
                        <span className='font-medium text-[#999] text-[14px]'>{secondsToHms(elapsedTime)}</span>
                    </>
                    :
                    (<div className='flex items-center w-full justify-evenly'>
                        <audio controls autoPlay ref={audioRef} src={URL.createObjectURL(audioFile)} className="h-[30px] w-full mx-3" />
                        <div className='flex items-center'>
                            <i onClick={() => clearHandle()} className='bx bx-revision text-[23px] cursor-pointer text-[#a5a5a5]'></i>
                            <i onClick={() => { setIsRecording(false), setFiles([]) }} className='bx bx-x text-[23px] cursor-pointer text-[#a5a5a5]'></i>
                            <i onClick={() => sendMessage()} className='bx bx-send text-[23px] cursor-pointer text-[#a5a5a5]'></i>
                        </div>
                    </div>
                    )}
            </div>
        </div>
    )
}

export default Recorder