import React from "react";
import {Calendar, Eye, MapPin, User} from "lucide-react";

// Types pour les formations
export interface Formation {
    id: string;
    title: string;
    category: string;
    status: 'confirmed' | 'upcoming' | 'completed';
    startDate: string;
    endDate: string;
    location: string;
    tags: string[];
    certificationsCount: number;
    isQualifying: boolean;
}

export type FilterType = 'all' | 'completed' | 'upcoming';

// Composant FormationCard
interface FormationCardProps {
    formation: Formation;
    onViewDetails: (id: string) => void;
}

const FormationCard: React.FC<FormationCardProps> = ({formation, onViewDetails}) => {
    const getStatusConfig = () => {
        switch (formation.status) {
            case 'confirmed':
                return {
                    barColor: 'bg-green-500',
                    badgeColor: 'bg-green-50 text-green-700 border-green-200',
                    statusText: 'Confirmé'
                };
            case 'upcoming':
                return {
                    barColor: 'bg-yellow-500',
                    badgeColor: 'bg-yellow-50 text-yellow-700 border-yellow-200',
                    statusText: 'À venir'
                };
            case 'completed':
                return {
                    barColor: 'bg-blue-500',
                    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
                    statusText: 'Terminée'
                };
            default:
                return {
                    barColor: 'bg-gray-500',
                    badgeColor: 'bg-gray-50 text-gray-700 border-gray-200',
                    statusText: 'Brouillon'
                };
        }
    };

    const statusConfig = getStatusConfig();

    return (
        <div className="relative rounded-lg border border-gray-200 shadow-sm overflow-hidden bg-white">
            {/* Barre verticale colorée */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${statusConfig.barColor}`}></div>

            <div className="p-5 pl-6">
                {/* Header avec titre et statut */}
                <div className="flex flex-col md:flex-row md:items-start justify-between mb-3">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{formation.title}</h3>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm text-gray-600">{formation.category}</span>
                            {formation.isQualifying && (
                                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                  Qualifiante
                </span>
                            )}
                        </div>
                    </div>

                    <span
                        className={`${statusConfig.badgeColor} rounded-full border px-3 py-1 text-xs font-semibold whitespace-nowrap mt-2 md:mt-0`}>
            {statusConfig.statusText}
          </span>
                </div>

                {/* Dates et lieu */}
                <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4"/>
                        <span>{formation.startDate} - {formation.endDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4"/>
                        <span>{formation.location}</span>
                    </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {formation.tags.map((tag, index) => (
                        <span
                            key={index}
                            className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-full border"
                        >
              {tag}
            </span>
                    ))}
                </div>

                {/* Footer avec certifications et bouton */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="h-4 w-4"/>
                        <span>{formation.certificationsCount}</span>
                        <span className="text-purple-600 font-medium">Certifié</span>
                    </div>

                    <button
                        onClick={() => onViewDetails(formation.id)}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-2"
                    >
                        <Eye className="h-4 w-4"/>
                        Voir les détails
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FormationCard;