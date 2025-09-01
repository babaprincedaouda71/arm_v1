import React from "react";
import {ChevronDown, List} from "lucide-react";
import {StrategicAxesSectionProps} from "@/types/dataTypes";
import StrategicAxesItem from "@/components/StrategicAxes/StrategicAxesItem";

const StrategicAxesSection: React.FC<StrategicAxesSectionProps> = ({
                                                                       title,
                                                                       strategicAxes = [],
                                                                       isOpen,
                                                                       onToggle,
                                                                       onEditStrategicAxes,
                                                                       onDeleteStrategicAxes,

                                                                   }) => {
    return (
        <div className="border rounded-lg overflow-hidden">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between px-4 py-8 bg-[#5a62dd10] hover:bg-violet-100 transition-colors"
            >
                <List className="text-gray-600" size={20}/>
                <div className="flex items-center space-x-4">
                    <span className="font-bold md:text-lg text-gray-700">{title}</span>
                </div>
                <ChevronDown
                    className={`transform transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                    }`}
                />
            </button>

            <div
                className={`transition-all duration-300 ease-in-out ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                } overflow-hidden`}
                style={{
                    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
                }}
            >
                <div className="p-4 bg-white">
                    {strategicAxes.map((strategicAxe, index) => (
                        <React.Fragment key={strategicAxe.id || index}> {/* Utiliser React.Fragment avec une key */}
                            <StrategicAxesItem title={strategicAxe.type}
                                               id={strategicAxe.id}
                                               year={strategicAxe.year}
                                               onEdit={onEditStrategicAxes}
                                               onDelete={onDeleteStrategicAxes}
                            />
                            <hr/>
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StrategicAxesSection;