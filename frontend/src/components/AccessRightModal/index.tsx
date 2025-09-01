import React from "react";
import {AccessRightProps} from "@/types/dataTypes";

interface AccessRightModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    subtitle: string;
    children: React.ReactNode;
    actions: {};
    accessRights?: AccessRightProps[];
}

const AccessRightModal = ({
                              isOpen,
                              onClose,
                              title,
                              subtitle,
                              children,
                              actions,
                              accessRights = []
                          }: AccessRightModalProps) => {
    if (!isOpen) return null;

    // Extraire toutes les actions uniques disponibles
    const availableActions = Array.from(
        new Set(accessRights.map(right => right.action))
    ).sort();

    // Grouper les droits par page
    const rightsByPage = accessRights.reduce((acc, right) => {
        if (!acc[right.page]) {
            acc[right.page] = [];
        }
        acc[right.page].push(right);
        return acc;
    }, {} as Record<string, AccessRightProps[]>);


    return (
        <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center z-[55]">
            <div className="bg-white rounded-lg p-6 flex flex-col space-y-6 w-[400px] lg:w-[700px]">
                {/* En-tête du modal */}
                <div className="relative mb-4">
                    <div
                        className="absolute inset-0 bg-right bg-[url('/images/bg-modal.svg')] bg-no-repeat opacity-20"
                        style={{backgroundSize: "35% auto"}}
                    ></div>
                    <div className="flex items-center space-x-2">
                        <div className="mr-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={3.5}
                                stroke="currentColor"
                                className="w-8 h-8 text-black"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                        </div>
                        <div>
                            {title && <h2 className="text-xl font-bold">{title}</h2>}
                            {subtitle && (
                                <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Corps du modal */}
                <div className="mb-6">
                    {children || (
                        <div className="space-y-6">
                            {/* En-têtes des actions */}
                            <div className="grid gap-4" style={{
                                gridTemplateColumns: `minmax(100px, 1fr) repeat(${availableActions.length}, minmax(0, 1fr))`
                            }}>
                                <div className="col-span-1"></div>
                                {availableActions.map((action) => (
                                    <div key={action} className="text-gray-400 text-center">
                                        {action}
                                    </div>
                                ))}
                            </div>

                            {/* Liste des droits par page */}
                            <div className="space-y-4">
                                {Object.entries(rightsByPage).map(([page, rights]) => (
                                    <div key={page} className="grid gap-4 items-center border-b pb-2" style={{
                                        gridTemplateColumns: `minmax(100px, 1fr) repeat(${availableActions.length}, minmax(0, 1fr))`
                                    }}>
                                        <span className="font-semibold">{page}</span>
                                        {availableActions.map((action) => {
                                            const right = rights.find(r => r.action === action);
                                            return (
                                                <div key={`${page}-${action}`} className="flex justify-center">
                                                    <input
                                                        type="checkbox"
                                                        className="h-5 w-5 accent-primary"
                                                        checked={right?.allowed || false}
                                                        onChange={() => {
                                                            // Gérer le changement d'état ici
                                                        }}
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Pied de page du modal */}
                <div className="flex justify-around">
                    {actions && Array.isArray(actions) && actions.length > 0 ? (
                        actions.map((action, index) => (
                            <button
                                key={index}
                                className={`${action.className} px-4 py-2 rounded-md`}
                                onClick={action.onClick}
                            >
                                {action.label}
                            </button>
                        ))
                    ) : (
                        <>
                            <button
                                className="border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50"
                                onClick={onClose}
                            >
                                Non! Annuler
                            </button>
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                onClick={onClose}
                            >
                                Enregistrer
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AccessRightModal;