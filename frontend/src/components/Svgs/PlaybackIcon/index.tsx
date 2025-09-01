
import React from "react";

interface Icon {
  onClick?: () => void;
}

const PlaybackIcon = ({ onClick }: Icon) => {
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
      <path d="M3.5 5.5L11 11V0.5L3.5 5.5Z" fill="#0B41A8" />
      <rect
        width="2"
        height="11"
        transform="matrix(-1 0 0 1 2 0)"
        fill="#0B41A8"
      />
    </svg>
  );
};

export default PlaybackIcon;
