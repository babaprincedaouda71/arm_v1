import React, {useState} from "react";
import FormationCard, {FilterType, Formation} from "@/components/ui/FormationCard";

const Path: React.FC = () => {
    const [activeFilter, setActiveFilter] = useState<FilterType>('all');

    // Données statiques pour l'exemple (à remplacer par vos données réelles)
    const formations: Formation[] = [
        {
            id: '1',
            title: 'Introduction au Marketing Digital',
            category: 'Marketing',
            status: 'confirmed',
            startDate: '15 mars 2023',
            endDate: '17 mars 2023',
            location: 'Paris',
            tags: ['SEO', 'SEM', 'Réseaux sociaux'],
            certificationsCount: 2,
            isQualifying: true
        },
        {
            id: '2',
            title: 'Développement Leadership',
            category: 'Management',
            status: 'confirmed',
            startDate: '10 juin 2023',
            endDate: '12 juin 2023',
            location: 'Lyon',
            tags: ['Leadership', 'Communication', 'Gestion de conflits'],
            certificationsCount: 1,
            isQualifying: true
        },
        {
            id: '3',
            title: 'Excel Avancé',
            category: 'Bureautique',
            status: 'confirmed',
            startDate: '05 févr. 2024',
            endDate: '06 févr. 2024',
            location: 'En ligne',
            tags: ['Tableaux croisés', 'Formules avancées', 'Macros'],
            certificationsCount: 1,
            isQualifying: false
        },
        {
            id: '4',
            title: 'Intelligence Artificielle pour Managers',
            category: 'Technologies',
            status: 'upcoming',
            startDate: '20 avr. 2024',
            endDate: '21 avr. 2024',
            location: 'Paris',
            tags: ['IA', 'Transformation digitale', 'Innovation'],
            certificationsCount: 1,
            isQualifying: true
        }
    ];

    const getFilteredFormations = () => {
        switch (activeFilter) {
            case 'completed':
                return formations.filter(f => f.status === 'completed');
            case 'upcoming':
                return formations.filter(f => f.status === 'upcoming');
            default:
                return formations;
        }
    };

    const handleViewDetails = (formationId: string) => {
        // Navigation vers la page de détails
        console.log('Naviguer vers les détails de la formation:', formationId);
        // router.push(`/formations/${formationId}`);
    };

    const getFilterButtonClass = (filterType: FilterType) => {
        return activeFilter === filterType
            ? 'bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium'
            : 'bg-white text-gray-700 px-4 py-2 rounded-md text-sm font-medium border border-gray-300 hover:bg-gray-50';
    };

    const filteredFormations = getFilteredFormations();

    return (
        <div className="max-w-8xl mx-auto px-6 py-4">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Mon parcours de formation</h1>
                <p className="text-gray-600 mb-4">Retrouvez l'ensemble des formations suivies et à venir</p>

                {/* Filtres */}
                <div className="flex gap-3">
                    <button
                        onClick={() => setActiveFilter('all')}
                        className={getFilterButtonClass('all')}
                    >
                        Toutes
                    </button>
                    <button
                        onClick={() => setActiveFilter('completed')}
                        className={getFilterButtonClass('completed')}
                    >
                        Terminées
                    </button>
                    <button
                        onClick={() => setActiveFilter('upcoming')}
                        className={getFilterButtonClass('upcoming')}
                    >
                        À venir
                    </button>
                </div>
            </div>

            {/* Grille des formations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredFormations.map((formation) => (
                    <FormationCard
                        key={formation.id}
                        formation={formation}
                        onViewDetails={handleViewDetails}
                    />
                ))}
            </div>

            {/* Message si aucune formation */}
            {filteredFormations.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-500 text-lg">Aucune formation trouvée pour ce filtre</div>
                </div>
            )}
        </div>
    );
};

export default Path;