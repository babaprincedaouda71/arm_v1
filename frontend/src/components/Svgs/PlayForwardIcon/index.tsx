import React from "react";

interface Icon {
  onClick?: () => void;  
 
}
const PlayForwardIcon = ({ onClick }:  Icon) => {
  return (
    <svg
      onClick={onClick}
      className="cursor-pointer"
      width="11"
      height="11"
      viewBox="0 0 11 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M7.5 5.5L0 11V0.5L7.5 5.5Z" fill="#0B41A8" />
      <rect x="9" width="2" height="11" fill="#0B41A8" />
    </svg>
  );
};

export default PlayForwardIcon;
