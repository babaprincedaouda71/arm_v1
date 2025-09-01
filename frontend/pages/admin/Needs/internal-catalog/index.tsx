import React, { useState } from "react";

import TabBar from "@/components/TabBar";
import NeedsInternalCatalogDashboard from "@/components/Needs/InternalCatalog/Dashboard";
import NeedsInternalCatalogC from "@/components/Needs/InternalCatalog/C";

const NeedsInternalCatalog = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const tabs = [
    { id: "dashboard", label: "Tableau de bord" },
    { id: "internalCatalog", label: "Catalogue interne" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <NeedsInternalCatalogDashboard />;
      case "internalCatalog":
        return <NeedsInternalCatalogC />;
    }
  };

  return (
    <div className="font-title text-xs md:text-sm lg:text-base rounded-t-xl">
      <TabBar tabs={tabs} onTabChange={setActiveTab} activeTab={activeTab}/>
      <div className=""> {renderContent()} </div>
    </div>
  );
};

export default NeedsInternalCatalog;