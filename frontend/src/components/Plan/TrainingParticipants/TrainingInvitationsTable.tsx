import React from 'react';
import Table from '@/components/Tables/Table';
import StatusRenderer from '@/components/Tables/StatusRenderer';
import DynamicActionsRenderer from '@/components/Tables/DynamicActionsRenderer';
import {TrainingInvitationProps} from "@/types/dataTypes";

interface TrainingInvitationsTableProps {
    invitations: TrainingInvitationProps[];
    onCancelInvitation: (invitation: TrainingInvitationProps) => void;
    onSendInvitations: () => void;
    isSubmitting: boolean;
    isLoading: boolean;
    error: string | null;
    tableConfig: {
        headers: string[];
        keys: string[];
        recordsPerPage: number;
    };
}

const TrainingInvitationsTable: React.FC<TrainingInvitationsTableProps> = ({
                                                                               invitations,
                                                                               onCancelInvitation,
                                                                               onSendInvitations,
                                                                               isSubmitting,
                                                                               isLoading,
                                                                               error,
                                                                               tableConfig
                                                                           }) => {
    const renderers = {
        status: (value: string) => (
            <StatusRenderer value={value} groupeConfig={{}} />
        ),
        actions: (_: any, row: TrainingInvitationProps) => (
            <DynamicActionsRenderer
                actions={["cancel"]}
                row={row}
                openCancelModal={() => onCancelInvitation(row)}
            />
        ),
    };

    return (
        <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Participants invités</h3>
            {error && (
                <div className="text-red-600 mb-4">{error}</div>
            )}
            <Table
                data={invitations}
                keys={tableConfig.keys}
                headers={tableConfig.headers}
                sortableCols={tableConfig.headers.filter(h => !["Actions"].includes(h))}
                onSort={() => {}}
                isPagination={false}
                visibleColumns={tableConfig.headers}
                renderers={renderers}
                loading={isLoading}
            />
            <div className="text-right text-xs md:text-sm lg:text-base mt-2">
                <button
                    type="button"
                    className="bg-gradient-to-b from-gradientBlueStart to-gradientBlueEnd hover:bg-indigo-700 text-white font-bold p-2 md:p-3 lg:p-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={onSendInvitations}
                    disabled={invitations.length === 0 || isSubmitting}
                >
                    {isSubmitting ? 'Envoi En Cours...' : 'Envoyer une invitation aux participants'}
                </button>
            </div>
        </div>
    );
};

export default TrainingInvitationsTable;