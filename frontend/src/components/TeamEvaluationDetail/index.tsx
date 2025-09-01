import React from 'react';
import ProgressBar from '@/components/ProgressBar';
import {Check} from "lucide-react";

interface EvaluationDetailsProps {
    type: string;
    status: string;
    description: string;
    progress: number;
    training: string;
    creationDate: string;
    lastUpdate: string;
    isSentToAdmin?: boolean;
}

const TeamEvaluationDetails: React.FC<EvaluationDetailsProps> = ({
                                                                     type,
                                                                     status,
                                                                     description,
                                                                     progress,
                                                                     training,
                                                                     creationDate,
                                                                     lastUpdate,
                                                                     isSentToAdmin
                                                                 }) => {
    return (
        <div className="bg-white rounded-lg p-6 mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Détails de l'évaluation</h3>
            <div className="flex items-center gap-2 mb-1">
        <span
            className={`rounded-full px-2 py-1 text-xs font-semibold 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
          {type}
        </span>
                <span
                    className={`${isSentToAdmin ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-700 border-gray-200'} 
                                    rounded-full border px-2.5 py-0.5 text-xs font-semibold flex items-center`}
                >
                                {isSentToAdmin ? (
                                    <>
                                        <Check className="h-3 w-3 inline-block mr-1"/> Terminée
                                    </>
                                ) : (
                                    <>
                                        Brouillon
                                    </>
                                )}
                            </span>
            </div>
            <p className="text-sm text-gray-600 mb-2">{description}</p>
            <div className="mb-2">
                <label className="block text-gray-700 text-sm font-bold mb-1">Progression globale de l'équipe</label>
                <ProgressBar progress={progress}/>
                <span className="text-xs text-gray-500">{progress}%</span>
            </div>
            <div className="text-sm text-gray-600 mb-1">
                <span className="font-semibold">Formation :</span> {training}
            </div>
            <div className="text-sm text-gray-600 mb-1">
                <span className="font-semibold">Date de début :</span> {creationDate}
            </div>
            <div className="text-sm text-gray-600">
                <span className="font-semibold">Dernière mise à jour :</span> {lastUpdate}
            </div>
        </div>
    );
};

export default TeamEvaluationDetails;