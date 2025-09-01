import React from 'react'
import ShieldIcon from "@/components/Svgs/ShieldIcon";

const WarningModal = ({ isOpen, title, onClose }) => {
    setTimeout(() => {
        onClose()
    }, 6000)

    if (!isOpen) {
        return null;
    }
    return (
        <div className='fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center text-tBodyTextColor z-[50]'>
            <div className="bg-white rounded-lg p-6 flex justify-center items-center flex-col w-[400px] lg:w-[700px] h-[195px]">
                <ShieldIcon/>
                <span className='lg:text-lg font-extrabold'>{title}</span>
            </div>
        </div>
    )
}

export default WarningModal