// hooks/useTrainingGroupParticipantsData.ts
import {useEffect, useState} from 'react';
import useSWR from 'swr';
import {COMPANIES_URLS, USERS_URLS} from '@/config/urls';
import {fetcher} from '@/services/api';
import {UserProps} from "@/types/dataTypes";

// Interface pour les données de la compagnie
interface CompanyData {
    id: number;
    corporateName: string;
    address?: string;
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

export const useTrainingGroupParticipantsData = (groupData?: GroupData) => {
    const {data: initialUsersData, error: initialUsersError, isLoading: initialUsersLoading} =
        useSWR<UserProps[]>(USERS_URLS.mutate, fetcher);

    const {data: companyDataFromAPI} = useSWR<CompanyData>(COMPANIES_URLS.getCurrent, fetcher);

    const [users, setUsers] = useState<UserProps[]>([]);
    const [companyData, setCompanyData] = useState<CompanyData | null>(null);

    useEffect(() => {
        if (companyDataFromAPI) {
            setCompanyData(companyDataFromAPI);
        }
    }, [companyDataFromAPI]);

    useEffect(() => {
        if (initialUsersData) {
            if (groupData) {
                const selectedIds = new Set((groupData.userGroupIds || []).map(id => id));
                const usersForEdit = initialUsersData.filter(user => !selectedIds.has(user.id));
                setUsers(usersForEdit);
            } else {
                setUsers(initialUsersData);
            }
        }
    }, [groupData, initialUsersData]);

    return {
        users,
        setUsers,
        companyData,
        initialUsersLoading,
        initialUsersError
    };
};