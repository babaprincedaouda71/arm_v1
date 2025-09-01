// components/TeamRequestDetailsModal.tsx
import React from "react";
import formatDate from "@/utils/formatDateUtils"
import {ClockCircleIcon} from "@/components/Svgs/ClockCircleIcon";
import {CheckCircleIcon} from "@/components/Svgs/CheckCircleIcon";
import {RejectedIcon} from "@/components/Svgs/RejectedIcon";

interface MyRequestDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    requestData: any;
}

const MyRequestDetailsModal: React.FC<MyRequestDetailsModalProps> = ({
                                                                         isOpen,
                                                                         onClose,
                                                                         requestData,
                                                                     }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 w-full max-w-2xl relative">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                         xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>

                {/* Header */}
                <h2 className="text-xl font-bold">{requestData?.theme || "Formation React Avancé"}</h2>
                <p className="text-sm text-gray-500 mt-1">Demande soumise
                    le {formatDate(requestData?.creationDate) || "15 avril 2025"}</p>

                {/* Main content */}
                <div className="bg-gray-50 rounded-lg p-6 my-6">
                    <h3 className="font-semibold mb-4">Informations sur la formation</h3>

                    <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                        <div>
                            <div className="flex items-center mb-1">
                                <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                <p className="text-sm text-gray-500">Période:</p>
                            </div>
                            <p className="ml-7">Du 01 mai 2025 au 03 mai 2025</p>
                        </div>

                        <div>
                            <div className="flex items-center mb-1">
                                <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                                <p className="text-sm text-gray-500">Type:</p>
                            </div>
                            <p className="ml-7">Qualifiante</p>
                        </div>

                        <div>
                            <div className="flex items-center mb-1">
                                <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                </svg>
                                <p className="text-sm text-gray-500">Lieu:</p>
                            </div>
                            <p className="ml-7">{requestData?.site || "Paris"}</p>
                        </div>

                        <div>
                            <div className="flex items-center mb-1">
                                <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                </svg>
                                <p className="text-sm text-gray-500">Formateur:</p>
                            </div>
                            <p className="ml-7">John Doe</p>
                        </div>
                    </div>

                    <div className="mt-6">
                        <p className="text-sm text-gray-500 mb-1">Description:</p>
                        <p>{requestData?.objective || "Formation approfondie sur React et ses concepts avancés"}</p>
                    </div>
                </div>

                {/* Validation status */}
                <div className="space-y-4">
                    <div className="flex items-center">
                        {requestData.status === "Waiting" ? <ClockCircleIcon/> : requestData.status === "Approved" ?
                            <CheckCircleIcon/> : <RejectedIcon/>}
                        <div>
                            <p className="font-medium">Validation manager</p>
                            <p className="text-sm text-gray-500">
                                {requestData.status === "Waiting" ? "En attente de validation" : requestData.status === "Approved" ? "Approuvé par le manager" : "Demande rejetée par le manager"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center">
                        {requestData.status === "Waiting" ? <ClockCircleIcon/> : requestData.status === "Approved" ?
                            <CheckCircleIcon/> : <RejectedIcon/>}
                        <div>
                            <p className="font-medium">Validation Responsable Formation</p>
                            <p className="text-sm text-gray-500">En attente de validation</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyRequestDetailsModal;