import {PDF_URLS, TRAINING_GROUPE_URLS} from '@/config/urls';

// Interface pour les participants du PDF
interface ParticipantForPDF {
    id: number;
    firstName: string;
    lastName: string;
    code: string;
    position: string;
    level: string;
    manager: string;
    cnss?: string;
    cin?: string;
}

// Définir une interface pour les données du groupe, incluant les IDs des utilisateurs sélectionnés
interface GroupData {
    id?: number;
    name?: string;
    targetAudience: string;
    managerCount: number;
    employeeCount: number;
    workerCount: number;
    temporaryWorkerCount: number;
    userGroupIds: number[];
    dates?: string[]; // Ajout des dates pour le tableau de présence
    location: string;
    trainingType?: string;
    ocf?: {
        id: number;
        corporateName: string;
        emailMainContact?: string;
    };
}

export class TrainingGroupParticipantsService {
    static async addParticipantsToGroup(
        trainingId: string | string[] | undefined,
        groupData: GroupData | null,
        formData: any,
        selectedUserIds: number[]
    ) {
        const dataToSend = {
            id: groupData?.id,
            targetAudience: formData.targetAudience,
            managerCount: formData.managerCount,
            employeeCount: formData.employeeCount,
            workerCount: formData.workerCount,
            temporaryWorkerCount: formData.temporaryWorkerCount,
            userGroupIds: selectedUserIds,
        };

        const url = groupData ?
            `${TRAINING_GROUPE_URLS.editGroupParticipants}/${groupData.id}` :
            `${TRAINING_GROUPE_URLS.addGroupParticipants}/${trainingId}`;

        const method = groupData ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erreur lors de l\'ajout des participants');
        }

        return response.json();
    }

    static async fetchParticipantsForAttendanceList(groupId: string | string[] | undefined): Promise<ParticipantForPDF[]> {
        if (!groupId) return [];

        const response = await fetch(`${TRAINING_GROUPE_URLS.getParticipantsForList}/${groupId}`, {
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des participants');
        }

        return response.json();
    }

    static async saveAttendanceListPDF(
        pdfBlob: Blob,
        trainingId: string | string[] | undefined,
        groupId: string | string[] | undefined,
        selectedDate: string,
        listType: string,
        groupName?: string
    ) {
        const formData = new FormData();
        formData.append('file', pdfBlob, `liste_presence_${listType}_${groupName || 'formation'}_${selectedDate}.pdf`);
        formData.append('trainingId', trainingId as string);
        formData.append('groupId', groupId as string);
        formData.append('date', selectedDate);
        formData.append('type', listType);

        const response = await fetch(PDF_URLS.savePDFToMinio, {
            method: 'POST',
            credentials: 'include',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la sauvegarde du PDF');
        }

        return response.json();
    }
}