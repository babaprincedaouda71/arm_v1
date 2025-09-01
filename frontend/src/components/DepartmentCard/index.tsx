import React from 'react';

const DepartmentCard = ({departments, maxScale = 20}) => {
    // Couleurs correspondant à l'image
    const colors = {
        'Ingénierie': '#8B9EFF',
        'IT': '#DC3545',
        'Marketing': '#B5D4FF',
        'Sécurité': '#E9ECEF'
    };

    // Créer les marqueurs d'échelle
    const scaleMarkers = [...Array(maxScale + 1)].map((_, index) => index).filter(n => n % 5 === 0);

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 w-full">
            {/* Titre */}
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Départments</h2>

            {/* Ligne de séparation */}
            <div className="border-b border-gray-200 mb-6"></div>

            {/* Conteneur principal avec grille de fond */}
            <div className="relative">
                {/* Lignes verticales pointillées */}
                <div className="absolute inset-0 flex justify-between -z-10">
                    {scaleMarkers.map((value) => (
                        <div
                            key={value}
                            className={`border-l border-dashed border-gray-200 h-full
                ${value === 0 ? 'border-none' : ''}`}
                            style={{
                                left: `${(value / maxScale) * 100}%`
                            }}
                        />
                    ))}
                </div>

                {/* Liste des départements */}
                <div className="space-y-6">
                    {departments.map((dept) => (
                        <div key={dept.name} className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-700">{dept.name}</span>
                                <span
                                    className="font-medium text-gray-900">{dept.count.toString().padStart(2, '0')}</span>
                            </div>
                            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-300 ease-in-out"
                                    style={{
                                        width: `${(dept.count / maxScale) * 100}%`,
                                        backgroundColor: colors[dept.name]
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Échelle en bas */}
                <div className="flex justify-between mt-6 text-sm text-gray-500">
                    {scaleMarkers.map((value) => (
                        <span key={value}>{value}</span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DepartmentCard;