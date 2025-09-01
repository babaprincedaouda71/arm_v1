import CustomSelect from '@/components/FormComponents/CustomSelect';
import FileInputField from '@/components/FormComponents/FileInputField';
import InputField from '@/components/FormComponents/InputField';
import RadioGroup from '@/components/FormComponents/RadioGroup'
import TextAreaField from '@/components/FormComponents/TextAreaField';
import React, {useEffect, useMemo, useState} from 'react'
import useSWR from "swr";
import {fetcher} from "@/services/api";
import {OCF_URLS, TRAINERS_URLS, TRAINING_GROUPE_URLS, TRAINING_URLS} from '@/config/urls';
import {GroupData} from '../add-group';
import Alert from '@/components/Alert';
import {useRoleBasedNavigation} from "@/hooks/useRoleBasedNavigation";
import InvitationPopup from "@/components/ui/InvitationPopup";

interface ProvidersProps {
    trainingId: string | string[] | undefined;
    groupData?: GroupData;
    onGroupDataUpdated?: (data: GroupData) => void;
}

const Providers = ({trainingId, groupData, onGroupDataUpdated}: ProvidersProps) => {
    const {navigateTo} = useRoleBasedNavigation();
    // État pour savoir si on est en mode édition
    const isEditMode = groupData !== null && groupData !== undefined;

    console.log('isEditMode', isEditMode);
    // etat du formulaire
    const [formData, setFormData] = useState({
        trainingType: "",
        trainer: null, // Pour le formateur interne (ID)
        comment: "",
        ocf: null, // Pour l'OCF externe (ID)
        externalTrainerName: "",
        externalTrainerEmail: "",
        externalTrainerCv: null,
        cost: "",
    });
    const [selected, setSelected] = useState("internal");

    // etat pour gérer les alertes
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info'>('success'); // Type de l'alerte

    const [showPopup, setShowPopup] = useState(false);
    const [selectedTrainerForPopup, setSelectedTrainerForPopup] = useState<{
        id: number;
        name: string;
        email?: string
    } | null>(null);

    const handleSendInvitation = (data: any) => {
        console.log('Données d\'invitation:', data);
        // Ici vous pouvez traiter l'envoi de l'invitation
    };


    const handleCloseAlert = () => {
        setShowAlert(false);
        setAlertMessage('');
    };

    // Données du formateur
    const {data: trainersData} = useSWR(TRAINERS_URLS.mutate, fetcher);
    // Formater les options pour le select
    const trainersOptionsFormatted = useMemo(() => {
        if (trainersData) {
            return trainersData.map(trainer => ({name: trainer.name, id: trainer.id}));
        }
        return [];
    }, [trainersData]);

    const {data: ocfData} = useSWR(OCF_URLS.mutate, fetcher);

    // Formater les options pour le select OCF
    const ocfOptionsFormatted = useMemo(() => {
        if (ocfData) {
            return ocfData.map(ocf => ({name: ocf.corporateName, id: ocf.id, emailMainContact: ocf.emailMainContact}));
        }
        return [];
    }, [ocfData]);

    const options = [
        {id: "internal", value: "internal", label: "Interne"},
        {id: "external", value: "external", label: "Externe"}
    ];

    // UseEffect pour pré-remplir le formulaire si on est en mode édition
    useEffect(() => {
        if (isEditMode && groupData) {
            // Déterminer si c'est une formation interne ou externe
            const trainingType = groupData.trainingType === "Interne" ? "internal" : "external";

            // Mettre à jour le type sélectionné (interne/externe)
            setSelected(trainingType);
            console.log(groupData.trainingType)

            // Pré-remplir les données du formulaire selon le type
            if (trainingType === "internal") {
                setFormData({
                    trainingType: groupData.trainingType,
                    trainer: groupData.internalTrainerId || null,
                    comment: groupData.comment || "",
                    ocf: null,
                    externalTrainerName: "",
                    externalTrainerEmail: "",
                    externalTrainerCv: null,
                    cost: "",
                });
                if (groupData.internalTrainerId && trainersData) {
                    const trainerDetails = trainersData.find(t => t.id === groupData.internalTrainerId);
                    if (trainerDetails) {
                        setSelectedTrainerForPopup(trainerDetails);
                    }
                }
            } else {
                setFormData({
                    trainingType: groupData.trainingType,
                    trainer: null,
                    comment: "",
                    ocf: groupData.ocf?.id || null,
                    externalTrainerName: groupData.externalTrainerName || "",
                    externalTrainerEmail: groupData.externalTrainerEmail || "",
                    externalTrainerCv: null, // On ne peut pas récupérer le fichier
                    cost: groupData.cost?.toString() || "",
                });
            }
        }
    }, [isEditMode, groupData]);

    // Gestionnaire de changement
    const handleChange = (e) => {
        setSelected(e.target.value);
    };

    const handleChangeCustomSelect = (event: { name: string; value: string }) => {
        const {name, value} = event;
        let selectedId: number | null = null;
        switch (name) {
            case "trainer":
                selectedId = trainersData?.find(trainer => trainer.name === value)?.id || null
                // Mettre à jour le formateur sélectionné pour le pop-up
                if (selectedId) {
                    const trainerDetails = trainersData?.find(t => t.id === selectedId);
                    if (trainerDetails) setSelectedTrainerForPopup(trainerDetails);
                } else {
                    setSelectedTrainerForPopup(null);
                }
                break;
            case "ocf":
                selectedId = ocfData?.find(ocf => ocf.corporateName === value)?.id || null;
                break;
            default:
                selectedId = parseInt(value, 10) || null;
                break;
        }
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: selectedId,
        }));
    };

    const handleSendTrainerInvitation = () => {
        if (!selectedTrainerForPopup) {
            setAlertMessage('Veuillez sélectionner un formateur');
            setAlertType('warning');
            setShowAlert(true);
            return;
        }

        // Naviguer vers la page sendInvitation avec les paramètres pour formateur interne
        navigateTo(`/Plan/annual/sendInvitation`, {
            query: {
                trainingId: trainingId,
                groupId: groupData?.id,
                type: 'trainer', // Paramètre pour identifier le type d'invitation
                trainerId: selectedTrainerForPopup.id
            }
        });
    };


    // Fonction pour rendre le contenu conditionnel
    const renderContent = () => {
        switch (selected) {
            case "internal":
                return (
                    <div className='grid md:grid-cols-1 md:gap-10 gap-5'>
                        <CustomSelect
                            name='trainer'
                            label='Formateur'
                            options={trainersOptionsFormatted.map(trainer => trainer.name)}
                            value={trainersData?.find(trainer => trainer.id === formData.trainer)?.name || ''}
                            onChange={handleChangeCustomSelect}
                        />
                        <TextAreaField
                            label='Commentaire'
                            name='comment'
                            value={formData.comment}
                            onChange={(e) => setFormData({...formData, comment: e.target.value})}/>
                        <div className='flex gap-5 items-center'>
                            <label>Envoyer une invitation au formateur</label>
                            <button
                                type="button"
                                onClick={handleSendTrainerInvitation}
                                className="bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-2 px-6 rounded-xl"
                                disabled={!selectedTrainerForPopup}
                            >
                                Envoyer
                            </button>
                        </div>
                        <div className='flex gap-5 items-center'>
                            <label>État de confirmation</label>
                            <button
                                type="button"
                                className="bg-gradient-to-b from-gradientYellowStart to-gradientYellowEnd hover:bg-gradientYellowEnd text-black font-bold p-2 md:p-3 lg:p-4 rounded-xl"
                            >
                                En attente de confirmation
                            </button>
                        </div>
                    </div>
                );
            case "external":
                return (
                    <div className='grid md:grid-cols-1 md:gap-10 gap-5'>
                        <CustomSelect
                            label='OCF'
                            name="ocf"
                            options={ocfOptionsFormatted.map(ocf => ocf.name)}
                            value={ocfData?.find(ocf => ocf.id === formData.ocf)?.corporateName || ''}
                            onChange={handleChangeCustomSelect} // Nouveau gestionnaire de changement
                        />
                        <InputField
                            label="Nom Formateur"
                            name="externalTrainerName"
                            value={formData.externalTrainerName}
                            onChange={(e) => setFormData({...formData, externalTrainerName: e.target.value})}
                        />
                        <InputField
                            label="Email"
                            name="externalTrainerEmail"
                            value={formData.externalTrainerEmail}
                            onChange={(e) => setFormData({...formData, externalTrainerEmail: e.target.value})}
                        />
                        <FileInputField
                            label="CV Formateur"
                            name="externalTrainerCv"
                            onChange={(file) => setFormData({...formData, externalTrainerCv: file})}
                        />
                        <label className='text-primary font-bold text-center'>Demander l'affectation d'un
                            formateur</label>
                        <InputField
                            type='number'
                            label="Coût total de la formation"
                            name="cost"
                            value={formData.cost}
                            onChange={(e) => setFormData({...formData, cost: e.target.value})}
                        />
                        <label className='text-primary font-bold text-center'>Demande de devis</label>
                    </div>
                );
            default:
                return null; // Aucun contenu si rien n'est sélectionné
        }
    };


    // Gestionnaire de soumission
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Données du formulaire :", formData);

        let dataToSend = {};

        if (selected === "internal") {
            const trainerToSend = formData.trainer ? trainersData?.find(trainer => trainer.id === formData.trainer) : null;
            const formattedTrainer = trainerToSend ? {id: trainerToSend.id, name: trainerToSend.name} : null;

            dataToSend = {
                trainer: formattedTrainer,
                comment: formData.comment,
                trainingType: "Interne",
            };
        } else if (selected === "external") {
            const OCFToSend = formData.ocf ? ocfData?.find(ocf => ocf.id === formData.ocf) : null;
            const formattedOCF = OCFToSend ? {
                id: OCFToSend.id,
                corporateName: OCFToSend.corporateName,
                emailMainContact: OCFToSend.emailMainContact
            } : null;

            dataToSend = {
                ocf: formattedOCF,
                externalTrainerName: formData.externalTrainerName,
                externalTrainerEmail: formData.externalTrainerEmail,
                externalTrainerCv: formData.externalTrainerCv,
                cost: formData.cost,
                trainingType: "Externe",
            };
        }

        console.log("Données à envoyer au backend :", dataToSend);

        try {
            let url = "";

            // Définir l'URL en fonction du mode (ajout ou édition) et du type (interne ou externe)
            if (selected === "internal") {
                url = isEditMode
                    ? `${TRAINING_GROUPE_URLS.editGroupInternalProvider}/${groupData.id}`
                    : `${TRAINING_GROUPE_URLS.addGroupInternalProvider}/${trainingId}`;
            } else if (selected === "external") {
                url = isEditMode
                    ? `${TRAINING_GROUPE_URLS.editGroupExternalProvider}/${groupData.id}`
                    : `${TRAINING_GROUPE_URLS.addGroupExternalProvider}/${trainingId}`;
            }

            const response = await fetch(url, {
                method: isEditMode ? 'PUT' : 'POST', // Utiliser PUT pour l'édition, POST pour l'ajout
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de l\'envoi des données');
            }

            const responseData = await response.json();

            // Appeler la fonction de mise à jour des données du groupe
            if (onGroupDataUpdated) {
                onGroupDataUpdated(responseData);
            }

            // Afficher l'alerte de succès
            setAlertMessage(isEditMode ? 'Mise à jour effectuée avec succès !' : 'Ajout effectué avec succès !');
            setAlertType('success');
            setShowAlert(true);

            navigateTo(TRAINING_URLS.addPage, {
                query: {trainingId: trainingId, groupId: responseData.id},
            });
        } catch (error) {
            console.error('Erreur lors de l\'envoi des données :', error);
            // Afficher l'alerte d'erreur
            setAlertMessage('Erreur lors de la mise à jour !');
            setAlertType('error');
            setShowAlert(true);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                {showAlert && (
                    <Alert
                        message={alertMessage}
                        type={alertType}
                        onClose={handleCloseAlert}
                    />
                )}
                <RadioGroup
                    groupLabel="Veuillez choisir le type de formation"
                    options={options}
                    name="type"
                    selectedValue={selected}
                    onChange={(e) => setSelected(e.target.value)}/>
                {/* Zone de contenu conditionnel */}
                <div className="mt-6 lg:px-80">
                    {renderContent()}
                </div>
                <div className="mt-6 text-right lg:px-80">
                    <button
                        type="submit"
                        className="bg-gradient-to-b from-gradientGreenStart to-gradientGreenEnd hover:bg-green-700 text-white font-bold py-2 px-6 rounded-xl"
                    >
                        Valider
                    </button>
                </div>
            </form>
            {/* AJOUT DU POP-UP ICI */}
            {selectedTrainerForPopup && (
                <InvitationPopup
                    isOpen={showPopup}
                    onClose={() => setShowPopup(false)}
                    onSend={handleSendInvitation}
                    trainerName="Jean Dupont"
                />
            )}
        </>
    )
}


export default Providers