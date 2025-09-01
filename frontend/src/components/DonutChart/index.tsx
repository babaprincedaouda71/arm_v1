import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';

const DEFAULT_COLORS = {
    IT: '#DC2626',         // Rouge
    Marketing: '#93C5FD',  // Bleu clair
    Ingénierie: '#818CF8', // Bleu lavande
    Sécurité: '#E2E8F0',   // Bleu très clair
};

const DonutChart = ({
                        data,
                        totalLabel = 'Départements',
                        colors = DEFAULT_COLORS,
                        animation = true
                    }) => {
    // Calcul de la taille responsive
    const [chartSize, setChartSize] = React.useState({ width: 0, height: 0 });
    const containerRef = React.useRef(null);

    React.useEffect(() => {
        const updateSize = () => {
            if (containerRef.current) {
                const { width, height } = containerRef.current.getBoundingClientRect();
                const size = Math.min(width, height) * 0.8; // Réduit la taille de 20%
                setChartSize({
                    width: size,
                    height: size
                });
            }
        };

        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    // Préparation des données pour Recharts
    const chartData = data.map(item => ({
        ...item,
        value: Number(item.value)
    }));

    // Calcul du total
    const total = chartData.reduce((acc, curr) => acc + curr.value, 0);

    const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value }) => {
        const RADIAN = Math.PI / 180;
        const radius = ((innerRadius + outerRadius) / 2) * 1.1;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor="middle"
                dominantBaseline="central"
                className="font-medium text-base"
            >
                {value.toString().padStart(2, '0')}
            </text>
        );
    };

    return (
        <div ref={containerRef} className="w-full h-full flex items-center justify-center bg-white rounded-lg">
            <div className="relative" style={{ width: chartSize.width, height: chartSize.height }}>
                <PieChart width={chartSize.width} height={chartSize.height}>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius="36%"
                        outerRadius="80%"
                        paddingAngle={0}
                        dataKey="value"
                        isAnimationActive={animation}
                        label={CustomLabel}
                        labelLine={false}
                    >
                        {chartData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={colors[entry.name] || DEFAULT_COLORS[entry.name]}
                                className="hover:opacity-90 cursor-pointer transition-opacity duration-300"
                            />
                        ))}
                    </Pie>
                </PieChart>

                {/* Texte central */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold">{total}</span>
                    <span className="text-gray-500 text-sm">{totalLabel}</span>
                </div>
            </div>
        </div>
    );
};

export default DonutChart;