// src/components/FormComponents/OFPPTValidationSwitch.tsx - Version adaptée pour votre Switch
import React, {useCallback, useState, useEffect} from 'react';
import Modal from '@/components/Modal';
import {PlansProps} from '@/types/dataTypes';
import {PLANS_URLS} from "@/config/urls";
import Switch from "@/components/FormComponents/Switch";

interface ValidationReport {
    planId: string;
    planTitle: string;
    canBeValidated: boolean;
    issues: string[];
    messages: string[];
    trainingDetails: TrainingValidationDetail[];
}

interface TrainingValidationDetail {
    trainingId: string;
    trainingTheme: string;
    complete: boolean;
    missingFields: string[];
    groupeDetails: GroupeValidationDetail[];
}

interface GroupeValidationDetail {
    groupeId: number;
    groupeName: string;
    complete: boolean;
    missingFields: string;
}

interface OFPPTValidationSwitchProps {
    plan: PlansProps;
    onStatusUpdate?: () => void;
}

const OFPPTValidationSwitch: React.FC<OFPPTValidationSwitchProps> = ({
                                                                         plan,
                                                                         onStatusUpdate
                                                                     }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [validationReport, setValidationReport] = useState<ValidationReport | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [canBeValidated, setCanBeValidated] = useState<boolean | null>(null);

    // Vérifier le statut de validation au chargement
    useEffect(() => {
        // Ne pas exécuter l'effet si ce n'est pas un plan CSF
        if (!plan.isCSFPlan) {
            return;
        }

        const checkValidationStatus = async () => {
            try {
                const response = await fetch(`${PLANS_URLS.canBeValidated}/${plan.id}`, {
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    setCanBeValidated(data.canBeValidated);
                }
            } catch (error) {
                console.warn('Erreur lors de la vérification du statut de validation:', error);
            }
        };

        checkValidationStatus();
    }, [plan.id, plan.isCSFPlan]);

    const handleSwitchChange = useCallback(async (newValue: boolean) => {
        if (!newValue) {
            // Désactivation directe - toujours autorisée
            await updateValidationStatus(newValue);
            return;
        }

        // Activation : vérifier d'abord si c'est possible
        setIsLoading(true);
        try {
            const response = await fetch(`${PLANS_URLS.validationReport}/${plan.id}`, {
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la vérification');
            }

            const report: ValidationReport = await response.json();

            if (report.canBeValidated) {
                // Validation directe possible
                await updateValidationStatus(true);
            } else {
                // Afficher le modal avec les détails des problèmes
                setValidationReport(report);
                setIsModalOpen(true);
            }
        } catch (error) {
            console.error('Erreur lors de la vérification:', error);
            alert('Une erreur est survenue lors de la vérification');
        } finally {
            setIsLoading(false);
        }
    }, [plan.id]);

    const updateValidationStatus = async (isValidated: boolean) => {
        try {
            const response = await fetch(`${PLANS_URLS.updateOFPPTValidation}/${plan.id}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({isValidated}),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.error || 'Erreur lors de la mise à jour');
            }

            const result = await response.json();
            console.log('Validation mise à jour:', result);

            // Mettre à jour le statut local
            setCanBeValidated(isValidated);

            // Rafraîchir les données du tableau
            onStatusUpdate?.();

        } catch (error) {
            console.error('Erreur lors de la mise à jour:', error);
            alert(`Erreur: ${error.message}`);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setValidationReport(null);
    };

    const renderValidationDetails = () => {
        if (!validationReport) return null;

        return (
            <div className="space-y-4">
                {/* Messages d'erreur généraux */}
                {validationReport.issues.length > 0 && (
                    <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                            <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd"
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                      clipRule="evenodd"/>
                            </svg>
                            <h4 className="font-semibold text-red-800">Prérequis non satisfaits</h4>
                        </div>
                        <ul className="list-disc list-inside text-red-700 text-sm space-y-1">
                            {validationReport.issues.map((issue, index) => (
                                <li key={index}>{issue}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Message d'aide avec les conditions */}
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                    <div className="flex items-start">
                        <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd"
                                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                  clipRule="evenodd"/>
                        </svg>
                        <div>
                            <p className="text-sm text-blue-800 font-medium mb-1">Conditions de validation OFPPT :</p>
                            <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                                <li>Le plan doit contenir au moins une formation CSF</li>
                                <li>Toutes les formations CSF doivent avoir leurs informations complètes</li>
                                <li>Chaque formation CSF doit avoir au moins un groupe créé</li>
                                <li>Tous les groupes doivent être entièrement remplis</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Déterminer les classes CSS pour le switch (suppression de la désactivation)
    const getSwitchClassName = () => {
        let classes = '';

        if (isLoading) {
            classes += ' opacity-50 pointer-events-none';
        }

        return classes;
    };

    // Ne pas afficher le switch si ce n'est pas un plan CSF
    if (!plan.isCSFPlan) {
        console.log(`Switch non affiché pour le plan ${plan.title}: isCSFPlan = ${plan.isCSFPlan}`);
        return null;
    }

    console.log(`Switch affiché pour le plan ${plan.title}: isCSFPlan = ${plan.isCSFPlan}`);

    return (
        <>
            <div className="flex items-center space-x-2">
                <Switch
                    label=""
                    name="ofpptValidation"
                    checked={plan.isOFPPTValidation}
                    onChange={handleSwitchChange}
                    className={getSwitchClassName()}
                />

                {/* Indicateur visuel du statut - plus simple */}
                {/*{plan.isOFPPTValidation && (*/}
                {/*    <div className="flex items-center">*/}
                {/*        <svg className="w-4 h-4 text-blue-500 mr-1" fill="currentColor" viewBox="0 0 20 20">*/}
                {/*            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>*/}
                {/*        </svg>*/}
                {/*        <span className="text-xs text-blue-600 font-medium" title="Plan validé par l'OFPPT">*/}
                {/*            Validé OFPPT*/}
                {/*        </span>*/}
                {/*    </div>*/}
                {/*)}*/}

                {isLoading && (
                    <span className="text-xs text-gray-500">
                        Vérification...
                    </span>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title="Validation OFPPT impossible"
                subtitle="Les éléments suivants doivent être complétés avant la validation :"
                icon={
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-8 h-8 text-amber-600"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                        />
                    </svg>
                }
                actions={[
                    {
                        label: "Compris",
                        onClick: closeModal,
                        className: "bg-gradient-to-b from-gradientBlueStart to-gradientBlueEnd text-white px-6 py-2",
                    },
                ]}
            >
                {renderValidationDetails()}
            </Modal>
        </>
    );
};

export default OFPPTValidationSwitch;