import React from "react";
import PlusIcon from "../Svgs/PlusIcon";
import FileCopy from "../Svgs/FileCopy";

interface ExpandableRowProps {
    item: any;
    isEven: boolean;
    onAddGroup?: (need: any) => void;
    onEditGroup?: (need: any, groupId: number) => void;
    onDuplicate?: (group: any) => void; // Ajout de la prop onDuplicate
}

const ExpandableRow: React.FC<ExpandableRowProps> = ({ item, isEven, onAddGroup, onEditGroup, onDuplicate }) => {
    const baseBackgroundColor = isEven ? "bg-[#F7F7FF]" : "bg-white";
    return (
        <div
            className={`lg:pl-14 py-4 ${baseBackgroundColor}`}
        >
            <div className="flex space-x-4">
                {/* Groupes */}
                {item.groups.map((group, index) => (
                    <div className="md:w-52 lg:w-64 bg-white rounded-xl shadow-lg border border-gray-200 flex" key={index}>
                        {/* Section gauche avec rotation */}
                        <div
                        onClick={() => onEditGroup(item, group.id)}
                            className={`${group.status === "Validé" ? "bg-green-500" : "bg-draft text-bold"} text-white flex items-center justify-center w-8 rounded-tl-xl rounded-bl-xl cursor-pointer`}>
                            <div
                                className="transform -rotate-90 whitespace-nowrap text-sm md:text-base lg:text-lg font-bold">
                                {group.name}
                            </div>
                        </div>
                        {/* Section principale */}
                        <div className="flex-grow p-4">
                            {/* Icône du document en haut à droite */}
                            <div className="flex justify-end">
                                <div className="cursor-pointer" onClick={() => onDuplicate(group)}>
                                    <FileCopy />
                                </div>
                            </div>
                            {/* Contenu principal */}
                            <div className="mt-4 space-y-2 text-center">
                                <p className="text-gray-700 font-medium">
                                    {group.dates != null ? group.dates : "Date"}
                                </p>
                                <p className="text-gray-700">
                                    {group.participantCount != null ? group.participantCount + " participants" : "Participants"}
                                </p>
                                <p className="text-gray-700 font-semibold">
                                    {group.trainingProvider != null ? group.trainingProvider : "OCF"}
                                </p>
                                <p className="text-gray-700 font-bold">{group.price != null ? group.price : "Prix"}</p>
                                <p className="text-gray-700 font-medium">{group.trainerName != null ? group.trainerName : "Formateur"}</p>
                            </div>
                        </div>
                    </div>
                ))}

                {onAddGroup && (
                    <div className="flex items-center">
                        <button
                            onClick={() => onAddGroup(item)}
                            className="w-14 h-12 bg-gradient-to-b from-gradientBlueStart to-gradientBlueEnd text-white rounded-full flex items-center justify-center">
                            <PlusIcon />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExpandableRow;