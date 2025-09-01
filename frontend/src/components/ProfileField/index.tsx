import React from 'react'

const ProfileField = ({ label, value }) => {
  return (
    <div className="flex items-center w-full text-xs md:text-sm lg:text-base">
    {/* Label for the field */}
    <label className="flex-[1] block font-medium text-gray-700 break-words">
      {label}
    </label>
    {/* Display the value or a placeholder if value is empty */}
    <div className="flex-[4] h-[48px] px-5 rounded-md bg-gray-100 flex items-center border border-gray-300">
      {value}
    </div>
  </div>
  )
}

export default ProfileField