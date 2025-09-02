// src/config/urls.ts

// Configuration dynamique de l'URL de base
const getApiUrl = () => {
    // Vérifier si on est côté client (navigateur)
    if (typeof window !== 'undefined') {
        const {protocol, hostname} = window.location;

        // Si on accède via une IP (mobile), utiliser cette IP
        if (hostname !== 'localhost') {
            return `${protocol}//${hostname}:8888/api`;
        }

        // Sinon, utiliser localhost (développement sur PC)
        return 'http://localhost:8888/api';
    }

    // Côté serveur (SSR) ou fallback via variable d'environnement
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8888/api';
};

const API_URL = getApiUrl();


// const API_URL = "http://localhost:8888/api";
export const AUTH_URLS = {
    login: `${API_URL}/auth/login`,
    logout: `${API_URL}/auth/logout`,
    setting_password: `${API_URL}/auth/set-password`,
}

export const COMPANIES_URLS = {
    complete_register: `${API_URL}/companies/company/complete`,
    getCurrent: `${API_URL}/companies/company/current`,
}

export const USERS_URLS = {
    add: `${API_URL}/users/add`,
    delete: `${API_URL}/users/delete`,
    mutate: `${API_URL}/users/get/all`,
    updateStatus: `${API_URL}/users/update-status`,
    import: `${API_URL}/users/import`,
    fetchProfile: `${API_URL}/auth/profile`,
    fetchCampaignEvaluationParticipants: `${API_URL}/users/campaign-evaluation/get/participants`,
    changeRole: `${API_URL}/users/change-role`, // URL pour changer le rôle
    updateManager: `${API_URL}/users/update-manager`, // URL pour changer le manager
};

export const SUPPLIERS_URLS = {
    add: `${API_URL}/users/add`,
    delete: `${API_URL}/users/delete`,
    edit: `/User/editUser`,
    view: `/User/user`,
    mutate: `${API_URL}/ocf/get/all`,
    updateStatus: `${API_URL}/users/update-status`,
    import: `${API_URL}/users/import`,
    fetchProfile: `${API_URL}/auth/profile`,
};

export const GROUPS_URLS = {
    add: `${API_URL}/groupes/add`,
    delete: `${API_URL}/groupes/delete`,
    update: `${API_URL}/groupes/update`,
    edit: `/Groups/editGroup`,
    mutate: `${API_URL}/groupes/get/all`,
    updateRights: `/groupes/permissions`,
};

export const NOTIFICATIONS_URLS = {
    fetchAll: (userId: number) => `${API_URL}/notifications/get/all/${userId}`,
    markAsRead: (id: number) => `${API_URL}/notifications/markAsRead/${id}`,
    markAllAsRead: `${API_URL}/notifications/markAllAsRead`,
    notifs: `${API_URL}/notifications/notifs`,
};

export const STRATEGIC_AXES_URLS = {
    fetchAll: `${API_URL}/strategicAxes/get/all`,
    fetchAllByYear: `${API_URL}/strategicAxes/get/allByYear`,
    add: `${API_URL}/strategicAxes/add`,
    delete: `${API_URL}/strategicAxes/delete`,
    edit: `${API_URL}/strategicAxes/edit`,
}

export const SITE_URLS = {
    mutate: `${API_URL}/site/get/all`,
    add: `${API_URL}/site/add`,
    view: `/User/user`,
    delete: `${API_URL}/site/delete`,
    edit: `${API_URL}/site/edit`,
}

export const DEPARTMENT_URLS = {
    mutate: `${API_URL}/department/get/all`,
    add: `${API_URL}/department/add`,
    view: `/User/user`,
    delete: `${API_URL}/department/delete`,
    edit: `${API_URL}/department/edit`,
}

export const DOMAIN_URLS = {
    mutate: `${API_URL}/domain/get/all`,
    add: `${API_URL}/domain/add`,
    view: `/User/user`,
    delete: `${API_URL}/domain/delete`,
    edit: `${API_URL}/domain/edit`,
}

export const QUALIFICATION_URLS = {
    mutate: `${API_URL}/qualification/get/all`,
    add: `${API_URL}/qualification/add`,
    view: `/User/user`,
    delete: `${API_URL}/qualification/delete`,
    edit: `${API_URL}/qualification/edit`,
}

export const NEEDS_STRATEGIC_AXES_URLS = {
    add: `${API_URL}/needs/add/strategicAxesNeed`,
    mutate: `${API_URL}/needs/get/all/strategicAxesNeed`,
    view: `/Needs/needDetails`,
    delete: `${API_URL}/needs/delete/strategicAxesNeed`,
    editPage: `/Needs/edit`,
    getNeed: `${API_URL}/needs/get/needToEdit`,
    update: `${API_URL}/needs/edit/need`,
    getDetails: `${API_URL}/needs/get/details/strategicAxesNeed`,
}

export const NEEDS_URLS = {
    add: `${API_URL}/needs/add`,
    editPage: `/Needs/edit`,
    mutate: `${API_URL}/needs/get/all`,
    view: `/User/user`,
    getNeed: `${API_URL}/needs/get/needToEdit`,
    delete: `${API_URL}/needs/delete`,
    edit: `${API_URL}/needs/edit`,
    updateStatus: `${API_URL}/needs/update-status`,
    duplicateGroup: `${API_URL}/needs/groups/duplicate/group`,
    getNeedForAddGroup: `${API_URL}/needs/get/needForAddGroup`,
    update: `${API_URL}/needs/edit/need`,
}

export const NEEDS_GROUP_URLS = {
    addPage: `/Needs/group/add-group`,
    addGroupPlanning: `${API_URL}/needs/groups/add/groupPlanning`,
    addGroupInternalProvider: `${API_URL}/needs/groups/add/groupInternalProvider`,
    editGroupInternalProvider: `${API_URL}/needs/groups/edit/groupInternalProvider`,
    editGroupExternalProvider: `${API_URL}/needs/groups/edit/groupExternalProvider`,
    addGroupExternalProvider: `${API_URL}/needs/groups/add/groupExternalProvider`,
    editGroupPlanning: `${API_URL}/needs/groups/edit/groupPlanning`,
    editGroupParticipants: `${API_URL}/needs/groups/edit/groupParticipants`,
    addGroupParticipants: `${API_URL}/needs/groups/add/groupParticipants`,
    mutate: `${API_URL}/needs/groups/get/all/group`,
    view: `/User/user`,
    delete: `${API_URL}/needs/groups/delete/group`,
    editPage: `/Needs/groups/group/editGroup`,
    getNeed: `${API_URL}/needs/groups/get/group`,
    update: `${API_URL}/needs/groups/edit/group`,
    getDetails: `${API_URL}/needs/groups/get/details/group`,
    getGroupToAddOrEdit: `${API_URL}/needs/groups/get/groupToAddOrEdit`,
    sendInvitations: `${API_URL}/needs/groups/send-invitation`,
    getGroupParticipants: `${API_URL}/needs/groups/get/getParticipants`,
    removeGroupParticipant: `${API_URL}/needs/groups/remove/groupParticipant`,
}

export const TRAINERS_URLS = {
    mutate: `${API_URL}/users/trainers/get/all`,
    getTrainerName: `${API_URL}/users/trainers/get/trainerName`,
}

export const OCF_URLS = {
    mutate: `${API_URL}/ocf/get/all`,
    add: `${API_URL}/ocf/add/ocf`,
    updateStatus: `${API_URL}/ocf/update-status`,
    edit: `${API_URL}/ocf/edit`,
    getDetails: `${API_URL}/ocf/get/details/ocf`,
    getPdf: `${API_URL}/ocf/get/pdf`,
    deleteOCF: `${API_URL}/ocf/delete`,
    editPage: `/ocf/add`,
    details: `/ocf/details`,
}

export const MY_REQUESTS_URLS = {
    mutate: `${API_URL}/trainings/training-requests/get/my-requests`,
    add: `${API_URL}/trainings/training-requests/add/new-request`,
    view: "",
    edit: "",
    delete: "",
}

export const TEAM_REQUESTS_URLS = {
    mutate: `${API_URL}/trainings/training-requests/get/team-requests`,
    updateStatus: `${API_URL}/trainings/training-requests/update-status`,
}

export const NEED_INDIVIDUAL_REQUESTS_URLS = {
    mutate: `${API_URL}/needs/get/all/individualRequestNeed`,
    updateStatus: `${API_URL}/trainings/training-requests/update-status`,
    editPage: `/Needs/edit`,
}

export const NEED_EVALUATION_URLS = {
    mutate: `${API_URL}/needs/get/all/evaluationNeed`,
    updateStatus: `${API_URL}/nedd/evaluation/update-status`,
    editPage: `/Needs/edit`,
}

export const TEAM_EVALUATIONS_URLS = {
    mutate: `${API_URL}/evaluations/team-evaluations/get/all`,
    view: '/manager/team-evaluations/detail-evaluation',
    getDetails: `${API_URL}/evaluations/team-evaluations/get/details`,
    sendEvaluationToAdmin: `${API_URL}/evaluations/team-evaluations/send-evaluation-to-admin`,
}

export const MY_EVALUATIONS_URLS = {
    mutate: `${API_URL}/evaluations/my-evaluations/get/all`,
    view: '/manager/team-evaluations/detail-evaluation',
    sendEvaluation: `${API_URL}/evaluations/my-evaluations/send-evaluation`,
}

export const CAMPAIGN_URLS = {
    add: `${API_URL}/evaluations/campaign-evaluation/add`,
    mutate: `${API_URL}/evaluations/campaign-evaluation/get/all`,
    deleteUserResponses: `${API_URL}/evaluations/campaign-evaluation/delete/user-response`,
    getDetails: `${API_URL}/evaluations/campaign-evaluation/get/details`,
    campaignEvaluationDetail: `${API_URL}/evaluations/campaign-evaluation/details`,
    update: `${API_URL}/evaluations/campaign-evaluation/update`,
    editPage: `/Needs/evaluation/add`,
    view: `/Needs/evaluation/details`,
    delete: `${API_URL}/evaluations/campaign-evaluation/delete`,
    publish: `${API_URL}/evaluations/campaign-evaluation/publish`,
}

export const QUESTIONNAIRE_URLS = {
    fetchAllByType: `${API_URL}/evaluations/questionnaire-evaluation/get/all/by-type`,
    getQuestionnaire: `${API_URL}/evaluations/questionnaire-evaluation/get/questionnaire`,
    update: `${API_URL}/evaluations/questionnaire-evaluation/update/questionnaire`,
    delete: `${API_URL}/evaluations/questionnaire-evaluation/delete/questionnaire`,
    updateStatus: `${API_URL}/evaluations/questionnaire-evaluation/update/questionnaire/status`,
    add: `${API_URL}/evaluations/questionnaire-evaluation/add`,
    mutate: `${API_URL}/evaluations/questionnaire-evaluation/get/all`,
    sendResponse: `${API_URL}/evaluations/questionnaire-evaluation/send-response`,
    getDetails: `${API_URL}/evaluations/questionnaire-evaluation/get/questionnaire`,
    getF4Questionnaire: `${API_URL}/evaluations/questionnaire`,
}

export const USER_RESPONSES_URLS = {
    sendUserResponse: `${API_URL}/evaluations/user-response/send-user-response`,
    fetchUserResponses: `${API_URL}/evaluations/user-response/get/all`,
    fetchUserQuestionsResponses: `${API_URL}/evaluations/user-response/get`,
}

export const PLANS_URLS = {
    mutate: `${API_URL}/plan/get/all`,
    add: `${API_URL}/plan/add`,
    updateStatus: `${API_URL}/plan/update-status`,
    delete: `${API_URL}/plan/delete`,
    view: `/Plan/annual/`,
    edit: `${API_URL}/plan/edit-plan`,

    updateOFPPTValidation: `${API_URL}/plan/ofppt-validation`,
    validationReport: `${API_URL}/plan/validation-report`,
    canBeValidated: `${API_URL}/plan/can-be-validated`,
}

export const TRAINING_URLS = {
    mutate: `${API_URL}/plan/trainings/get/all`,
    getDetails: `${API_URL}/plan/trainings/get/details`,
    getTrainingForAddGroup: `${API_URL}/plan/trainings/get/trainingForAddGroup`,
    getTrainingToEdit: `${API_URL}/plan/trainings/get/trainingToEdit`,
    editTraining: `${API_URL}/plan/trainings/edit/training`,
    getTrainingDetailForCancel: `${API_URL}/plan/trainings/get/trainingDetailForCancel`,
    getTrainingDetailForInvitation: `${API_URL}/plan/trainings/get/trainingDetailForInvitation`,
    getParticipants: `${API_URL}/plan/trainings/get/getParticipants`,
    cancelTraining: `${API_URL}/plan/trainings/cancel/training`,
    sendInvitations: `${API_URL}/plan/trainings/sendInvitation/training`,
    //
    addPage: `/Plan/annual/add-group`,
    editPage: `/Plan/annual/edit`,
    add: `${API_URL}/trainings/plan/training/add`,
    updateStatus: `${API_URL}/trainings/plan/training/update-status`,
    delete: `${API_URL}/trainings/plan/training/delete`,
    view: `/Plan/annual/`,
    edit: `${API_URL}/trainings/plan/training/edit-training`,
}

export const TRAINING_GROUPE_URLS = {
    getTrainingGroupeToAddOrEdit: `${API_URL}/plan/trainings/training-groups/getTrainingGroupToAddOrEdit`,
    addGroupPlanning: `${API_URL}/plan/trainings/training-groups/add/groupPlanning`,
    editGroupPlanning: `${API_URL}/plan/trainings/training-groups/edit/groupPlanning`,
    addGroupParticipants: `${API_URL}/plan/trainings/training-groups/add/groupParticipants`,
    editGroupParticipants: `${API_URL}/plan/trainings/training-groups/edit/groupParticipants`,
    addGroupInternalProvider: `${API_URL}/plan/trainings/training-groups/add/groupInternalProvider`,
    editGroupInternalProvider: `${API_URL}/plan/trainings/training-groups/edit/groupInternalProvider`,
    addGroupExternalProvider: `${API_URL}/plan/trainings/training-groups/add/groupExternalProvider`,
    editGroupExternalProvider: `${API_URL}/plan/trainings/training-groups/edit/groupExternalProvider`,
    sendInvitations: `${API_URL}/plan/trainings/training-groups/send-invitations`,
    getParticipants: `${API_URL}/plan/trainings/training-groups/get/getParticipants`,
    getParticipantsForList: `${API_URL}/plan/trainings/training-groups/get/getParticipantsForList`,
    getGroupDetailsForSendInvitationToTrainer: `${API_URL}/plan/trainings/training-groups/get/getGroupDetailsForSendInvitationToTrainer`,
    getGroupDates: `${API_URL}/plan/trainings/training-groups/get/getGroupDates`,
    getUserPlanning: `${API_URL}/plan/trainings/training-groups/get/planning`,
    getUserTrainingHistory: `${API_URL}/plan/trainings/training-groups/get/trainingHistory`,
}

export const PDF_URLS = {
    savePDFToMinio: `${API_URL}/plan/file/save-cancellation-notice`,
    downloadPDF: `${API_URL}/plan/file/download`,
    deletePDF: `${API_URL}/plan/file/delete`,
    saveAttendanceListPDF: `${API_URL}/plan/file/save-attendance-list`,
};

export const NEED_TO_ADD_TO_PLAN_URLS = {
    mutate: `${API_URL}/needs/get/allValidatedNeedToAddToPlan`,
    addTheme: `${API_URL}/plan/addThemeToPlan`,
    removeTheme: `${API_URL}/plan/removeThemeFromPlan`
}

export const GROUPE_INVOICE_URLS = {
    mutate: `${API_URL}/plan/groupeInvoice/get/all`,
    addGroupeInvoice: `${API_URL}/plan/groupeInvoice/add/groupeInvoice`,
    editGroupeInvoice: `${API_URL}/plan/groupeInvoice/edit/groupeInvoice`,
    deleteGroupeInvoice: `${API_URL}/plan/groupeInvoice/delete/groupeInvoice`,
    updateStatus: `${API_URL}/plan/groupeInvoice/update-status`,
    getGroupeInvoiceDetails: `${API_URL}/plan/groupeInvoice/get/groupeInvoiceDetails`,
    getPdf: `${API_URL}/plan/groupeInvoice/get/pdf`,
}

export const TRAINING_INVITATION_URLS = {
    mutate: `${API_URL}/plan/trainings/invitations/get/all`,
    sendInvitations: `${API_URL}/plan/trainings/invitations/send-invitations`,
    sendTrainerInvitation: `${API_URL}/plan/trainings/invitations/send-trainer-invitation`,
    getUserInvitations: `${API_URL}/plan/trainings/invitations/get/userInvitations`,
    getTeamInvitations: `${API_URL}/plan/trainings/invitations/get/teamInvitations`,
    respondToInvitation: `${API_URL}/plan/trainings/invitations/respond`,
    checkTrainerInvitationStatus: `${API_URL}/plan/trainings/invitations/checkTrainerInvitationStatus`,
}

export const GROUPE_EVALUATION_URLS = {
    mutate: `${API_URL}/plan/groupes/evaluations/get/all`,
    sendEvaluation: `${API_URL}/plan/groupes/evaluations/send-evaluation`,
    fetchParticipants: `${API_URL}/plan/groupes/evaluations/get/participants`,
    add: `${API_URL}/plan/groupes/evaluations/add`,
    updateStatus: `${API_URL}/plan/groupes/evaluations/update-status`,
    delete: `${API_URL}/plan/groupes/evaluations/delete`,
    view: `/Plan/annual/`,
    edit: `${API_URL}/plan/groupes/evaluations/edit-evaluation`,
    editDetails: `${API_URL}/plan/groupes/evaluations/get/edit-details`, // 🆕 Nouvelle URL
    getDetails: `${API_URL}/evaluations/admin/groupe-evaluation-details`,
    getEvaluationForF4: `${API_URL}/plan/groupes/evaluations/get/groupe-evaluation`,
    getTokensForF4: `${API_URL}/plan/groupes/evaluations/get/qr-tokens`,
    // 🆕 NOUVELLE URL pour la synthèse
    synthese: `${API_URL}/plan/groupes/evaluations/synthese`,
    fetchParticipantResponses: `${API_URL}/plan/groupes/evaluations/responses`,
}

export const ATTENDANCE_URLS = {
    saveList: `${API_URL}/plan/attendance/save-list`,
    scan: `${API_URL}/public/attendance/scan`,
    markAttendance: `${API_URL}/public/attendance/mark`,
    getAttendanceListPerDate: `${API_URL}/plan/attendance/get-list-per-date`,
}

export const F4_EVALUATION_URLS = {
    scan: `${API_URL}/public/evaluation/scan`,
    submit: `${API_URL}/public/evaluation/submit`,
}