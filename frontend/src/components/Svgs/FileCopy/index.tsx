import React from 'react';

const FileCopy = ({
  size = 24,
  gradientStart = '#2563eb', // Couleur de début du dégradé (blue-600)
  gradientEnd = '#1d4ed8',   // Couleur de fin du dégradé (blue-700)
  className = 'h-4 w-4 md:w-6 md:h-6 lg:w-8 lg:h-8',
  ...props
}) => {
  // Identifiant unique pour le dégradé
  const gradientId = React.useId();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      {...props}
    >
      {/* Définition du dégradé */}
      <defs>
        <linearGradient
          id={gradientId}
          x1="0%"
          y1="0%"
          x2="0%"
          y2="100%"
        >
          <stop offset="0%" stopColor={gradientStart} />
          <stop offset="100%" stopColor={gradientEnd} />
        </linearGradient>
      </defs>

      {/* Chemin du SVG avec le dégradé appliqué */}
      <path
        d="M6.9998 6V3C6.9998 2.44772 7.44752 2 7.9998 2H19.9998C20.5521 2 20.9998 2.44772 20.9998 3V17C20.9998 17.5523 20.5521 18 19.9998 18H16.9998V20.9991C16.9998 21.5519 16.5499 22 15.993 22H4.00666C3.45059 22 3 21.5554 3 20.9991L3.0026 7.00087C3.0027 6.44811 3.45264 6 4.00942 6H6.9998ZM5.00242 8L5.00019 20H14.9998V8H5.00242ZM8.9998 6H16.9998V16H18.9998V4H8.9998V6ZM7 11H13V13H7V11ZM7 15H13V17H7V15Z"
        fill={`url(#${gradientId})`}
      />
    </svg>
  );
};

export default FileCopy;