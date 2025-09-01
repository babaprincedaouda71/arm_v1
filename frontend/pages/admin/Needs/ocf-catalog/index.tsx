import React, { useState } from "react";
import TabBar from "@/components/TabBar";
import NeedsOCFCatalogDashboard from "@/components/Needs/OCFCatalog/Dashboard";
import NeedsOCFCatalogC from "@/components/Needs/OCFCatalog/OCF";

const NeedsOcfCatalog = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const tabs = [
    { id: "dashboard", label: "Tableau de bord" },
    { id: "ocfCatalog", label: "Catalogue OCF" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <NeedsOCFCatalogDashboard />;
      case "ocfCatalog":
        return <NeedsOCFCatalogC />;
    }
  };
  return (
    <div className="font-title text-xs md:text-sm lg:text-base rounded-t-xl">
      <TabBar tabs={tabs} onTabChange={setActiveTab} activeTab={activeTab} />
      <div className=""> {renderContent()} </div>
    </div>
  );
};

export default NeedsOcfCatalog;