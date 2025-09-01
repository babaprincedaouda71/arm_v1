import React from 'react';

const ProgressBar = ({
    progress = 0,
    fillColor = '#5A62DD', // Bleu par défaut (blue-500 de Tailwind)
    className = '',
}) => {
    // S'assurer que la progression est entre 0 et 100
    const normalizedProgress = Math.min(Math.max(progress, 0), 100);

    return (
        <div
            className={`w-full h-5 border bg-[#2D95F8] rounded-full overflow-hidden ${className}`}
        >
            <div
                className="h-full rounded-full transition-all duration-300 ease-in-out"
                style={{
                    width: `${normalizedProgress}%`,
                    backgroundColor: fillColor,
                }}
            />
        </div>
    );
};

export default ProgressBar;