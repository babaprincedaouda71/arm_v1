import React from "react";
import {ChevronDown, List} from "lucide-react";
import EvaluationItem from "../EvaluationItem";
import NewModelButton from "../NewModelButton";
import {EvaluationSectionProps, EvaluationsProps} from "@/types/dataTypes";

interface InternalEvaluationSectionProps extends EvaluationSectionProps {
    onUpdateEvaluation: (evaluation: EvaluationsProps) => void;
    onDeleteEvaluation: (questionnaireId: string, questionnaireTitle: string) => void;
}

const EvaluationSection: React.FC<InternalEvaluationSectionProps> = ({
                                                                         type,
                                                                         evaluations = [],
                                                                         isOpen,
                                                                         onToggle,
                                                                         questionnaireTypeForNewModel,
                                                                         onUpdateEvaluation,
                                                                         onDeleteEvaluation
                                                                     }) => {
    const handleSetDefault = (selectedId: string) => {
        // Logique pour s'assurer qu'un seul questionnaire est par défaut
        const updatedEvaluations = evaluations.map(evalItem => ({
            ...evalItem,
            isDefault: evalItem.id === selectedId,
        }));
        // Notifier le composant parent de la mise à jour (si nécessaire)
        updatedEvaluations.forEach(updatedEval => {
            if (evaluations.find(e => e.id === updatedEval.id && e.isDefault !== updatedEval.isDefault)) {
                onUpdateEvaluation(updatedEval);
            }
        });
    };

    return (
        <div className="border rounded-lg overflow-hidden">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between px-4 py-8 bg-[#5a62dd10] hover:bg-violet-100 transition-colors"
            >
                <List className="text-gray-600" size={20}/>
                <div className="flex items-center space-x-4">
                    <span className="font-bold md:text-lg text-gray-700">{type}</span>
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
                    <h3 className="font-medium text-gray-700 mb-3">
                        Recenser les besoins des collaborateurs
                    </h3>
                    {evaluations.map((evaluation, index) => (
                        <div
                            key={index}>
                            <EvaluationItem
                                id={evaluation.id}
                                title={evaluation.title}
                                type={questionnaireTypeForNewModel}
                                isDefault={evaluation.isDefault}
                                onSetDefault={handleSetDefault}
                                onDelete={(id, title) => onDeleteEvaluation(id, title)}
                            />
                            <hr/>
                        </div>
                    ))}
                    <div className="flex">
                        <NewModelButton questionnaireType={questionnaireTypeForNewModel}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EvaluationSection;