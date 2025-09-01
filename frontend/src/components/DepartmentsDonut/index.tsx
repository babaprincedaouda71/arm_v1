import React from "react";

const DepartmentsDonut = ({ departments }) => {
    const size = 400;
    const strokeWidth = 60;
    const radius = (size - strokeWidth) / 2;
    const center = size / 2;

    const total = departments.reduce((sum, dept) => sum + dept.value, 0);

    const getCoordinates = (startAngle, endAngle) => {
        const start = {
            x: center + radius * Math.cos(startAngle),
            y: center + radius * Math.sin(startAngle),
        };
        const end = {
            x: center + radius * Math.cos(endAngle),
            y: center + radius * Math.sin(endAngle),
        };
        const largeArc = endAngle - startAngle <= Math.PI ? 0 : 1;

        return {
            path: `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`,
            textPos: {
                x: center + radius * 0.7 * Math.cos((startAngle + endAngle) / 2),
                y: center + radius * 0.7 * Math.sin((startAngle + endAngle) / 2),
            },
        };
    };

    const colors = [
        "rgb(232, 233, 255)", // violet très clair
        "rgb(177, 178, 255)", // violet
        "rgb(182, 233, 255)", // bleu ciel
        "rgb(220, 38, 38)", // rouge
    ];

    let currentAngle = -Math.PI / 2;
    const gap = (Math.PI / 180) * 5;

    return (
        <div className="relative w-full max-w-lg mx-auto p-6 bg-white rounded-lg shadow-sm">
            <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full">
                {/* Fond blanc explicite */}
                <rect width={size} height={size} fill="white" />

                {departments.map((dept, index) => {
                    const sectionAngle = (Math.PI * 2 * dept.value) / total - gap;
                    const coords = getCoordinates(
                        currentAngle,
                        currentAngle + sectionAngle
                    );
                    const currentColor = colors[index % colors.length];

                    const result = (
                        <g key={index}>
                            <path
                                d={coords.path}
                                fill="none"
                                stroke={currentColor}
                                strokeWidth={strokeWidth}
                                strokeLinecap="round"
                            />
                            <text
                                x={coords.textPos.x}
                                y={coords.textPos.y}
                                fill="white"
                                fontSize="24"
                                textAnchor="middle"
                                dominantBaseline="middle"
                            >
                                {dept.value.toString().padStart(2, "0")}
                            </text>
                        </g>
                    );

                    currentAngle += sectionAngle + gap;
                    return result;
                })}

                <text
                    x={center}
                    y={center - 10}
                    fontSize="48"
                    fontWeight="bold"
                    textAnchor="middle"
                    fill="#1E1E3F"
                >
                    {total}
                </text>
                <text
                    x={center}
                    y={center + 30}
                    fontSize="24"
                    textAnchor="middle"
                    fill="#6B7280"
                >
                    Departments
                </text>
            </svg>
        </div>
    );
};

export default DepartmentsDonut;
