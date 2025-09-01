import React from 'react';

const DepartmentsChart = ({ departments }) => {
  const maxScale = 20;

  // Tableau de classes Tailwind pour les couleurs
  const colorClasses = [
    'bg-blue-200',
    'bg-green-200',
    'bg-sky-300',
    'bg-violet-100',
    'bg-yellow-300',
    'bg-red-100',
    'bg-orange-200',
    'bg-pink-200'
  ];

  // Fonction pour obtenir une couleur basée sur l'AnnualPlanPage
  const getColor = (index) => {
    return colorClasses[index % colorClasses.length];
  };

  return (
    <div className="p-6 w-full max-w-2xl bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Titre */}
      <h2 className="text-2xl font-semibold text-[#1E1E3F] mb-4">Départements</h2>

      {/* Ligne de séparation */}
      <div className="border-b border-gray-200 mb-6"></div>

      {/* Container des départements */}
      <div className="space-y-6 relative">
        {/* Lignes verticales de l'échelle */}
        <div className="absolute inset-y-0 w-full">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute border-l border-dashed border-gray-200 h-full"
              style={{
                left: `${(i * 5 * 100) / maxScale}%`
              }}
            />
          ))}
        </div>

        {/* Liste des départements */}
        {departments.map((dept, index) => (
          <div key={index} className="relative">
            {/* En-tête avec nom et valeur */}
            <div className="flex justify-between mb-2">
              <span className="text-gray-700">{dept.name}</span>
              <span className="text-gray-500">
                {dept.value.toString().padStart(2, '0')}
              </span>
            </div>

            {/* Barre de progression */}
            <div className="w-full">
              <div
                className={`h-6 rounded-md ${getColor(index)}`}
                style={{
                  width: `${(dept.value * 100) / maxScale}%`
                }}
              />
            </div>
          </div>
        ))}

        {/* Échelle en bas */}
        <div className="flex justify-between text-gray-500 mt-4">
          <span>0</span>
          <span>5</span>
          <span>10</span>
          <span>15</span>
          <span>20</span>
        </div>
      </div>
    </div>
  );
};

export default DepartmentsChart;