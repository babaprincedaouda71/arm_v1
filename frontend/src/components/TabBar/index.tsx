import React, { useMemo } from "react";

/**
 * Composant Tabs dynamique avec Next.js et Tailwind CSS
 * @param {Array} tabs - Tableau d'objets représentant les onglets. Chaque objet doit contenir :
 *  - id : Identifiant unique pour l'onglet
 *  - label : Le texte affiché dans l'onglet
 *  - content : Le contenu à afficher lorsque l'onglet est actif
 * @param onTabChange
 * @param activeTab
 */

const TabBar = ({ tabs, onTabChange, activeTab }) => {
  const activeTabIndex = useMemo(() => (
    tabs.findIndex((tab) => tab.id === activeTab)
  ), [tabs, activeTab]);

  return (
    <div className="relative bg-white rounded-xl mb-4 overflow-hidden">
      {/* Fond animé */}
      <div
        className="absolute top-0 left-0 h-full bg-gradient-to-b from-gradientBlueStart to-gradientBlueEnd rounded-xl transition-transform duration-500"
        style={{
          width: `${100 / tabs.length}%`,
          transform: `translateX(${activeTabIndex * 100}%)`,
        }}
      />
      {/* Barre d'onglets */}
      <div className="relative z-10 flex h-10 md:text-lg lg:text-xl">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 flex items-center justify-center font-bold transition-all ${activeTab === tab.id ? "text-white" : "text-gray-600"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabBar;