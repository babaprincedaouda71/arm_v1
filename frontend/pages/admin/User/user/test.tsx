import React, { useState } from "react";

/**
 * Composant Tabs dynamique avec Next.js et Tailwind CSS
 * @param {Array} tabs - Tableau d'objets représentant les onglets. Chaque objet doit contenir :
 *  - id : Identifiant unique pour l'onglet
 *  - label : Le texte affiché dans l'onglet
 * @param {Function} onTabChange - Fonction appelée lorsque l'onglet actif change, reçoit l'id de l'onglet actif.
 */
const Tabs = ({ tabs, onTabChange }) => {
  // État pour suivre l'onglet actif
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || null);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  return (
    <div className="w-full">
      {/* Barre d'onglets */}
      <div className="flex border-b border-gray-300">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`px-4 py-2 text-sm font-medium cursor-pointer 
              ${
                activeTab === tab.id
                  ? "border-b-2 border-indigo-500 text-indigo-600"
                  : "text-gray-500 hover:text-indigo-600"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Tabs;

/**
 * Exemple d'utilisation du composant Tabs dans une page
 * Cette page utilise Tabs pour afficher le contenu en fonction de l'onglet actif.
 */
export const UserPage = () => {
  const tabsData = [
    { id: "profile", label: "ProfileComponent" },
    { id: "planning", label: "Planification" },
    { id: "history", label: "Historique" },
  ];

  const [activeTab, setActiveTab] = useState("profile");

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <div>Contenu du profil</div>;
      case "planning":
        return <div>Contenu de la planification</div>;
      case "history":
        return <div>Contenu de l'historique</div>;
      default:
        return <div>Sélectionnez un onglet</div>;
    }
  };

  return (
    <div>
      <Tabs tabs={tabsData} onTabChange={setActiveTab} />
      <div className="p-4">{renderContent()}</div>
    </div>
  );
};