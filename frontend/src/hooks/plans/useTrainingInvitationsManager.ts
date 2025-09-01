// hooks/useTrainingInvitationsManager.ts
import { useState, useCallback } from 'react';
import { TRAINING_INVITATION_URLS, TRAINING_URLS } from '@/config/urls';
import {TrainingInvitationProps} from "@/types/dataTypes";

export const useTrainingInvitationsManager = (groupId: string | string[] | undefined) => {
    const [invitations, setInvitations] = useState<TrainingInvitationProps[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchInvitations = useCallback(async () => {
        if (!groupId) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${TRAINING_INVITATION_URLS.mutate}/${groupId}`, {
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to fetch invitations');
            }

            const data: TrainingInvitationProps[] = await response.json();
            setInvitations(data);
        } catch (err) {
            setError('Erreur lors du chargement des invitations');
            console.error('Error:', err);
        } finally {
            setIsLoading(false);
        }
    }, [groupId]);

    const cancelInvitation = useCallback(async (invitation: TrainingInvitationProps) => {
        try {
            const response = await fetch(`${TRAINING_URLS.cancelTraining}/${invitation.id}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (response.ok) {
                await fetchInvitations();
                return { success: true, message: 'Invitation annulée avec succès' };
            } else {
                throw new Error('Erreur lors de l\'annulation de l\'invitation');
            }
        } catch (error) {
            console.error('Error canceling invitation:', error);
            return { success: false, message: 'Erreur lors de l\'annulation de l\'invitation' };
        }
    }, [fetchInvitations]);

    return {
        invitations,
        isLoading,
        error,
        fetchInvitations,
        cancelInvitation
    };
};