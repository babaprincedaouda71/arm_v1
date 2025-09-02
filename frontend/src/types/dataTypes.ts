import React from "react";

export interface PlaningDataProps {
    theme: string;
    dates: string;
    location?: string;
    status?: string;
}

export interface TrainingHistoricProps {
    year: string;
    theme: string;
    dates: string;
    certificateAndLicence: string;
}

export interface GroupsProps {
    id: number;
    name: string;
    userCount: string;
}

export interface DepartmentProps {
    id: number;
    companyId: number;
    code: string;
    name: string;
}

export interface SiteProps {
    id: number;
    companyId: number;
    code: string;
    label: string;
    address: string;
    city: string;
    phone: string;
    trainingRoom: "Oui" | "Non";
    size: number;
    departmentIds?: number[]; // 🆕 IDs des départements liés au site
    departments?: DepartmentProps[]; // 🆕 Optionnel pour l'affichage enrichi
}

// 🆕 Nouveau type pour les sites avec départements complets
export interface SiteWithDepartmentsProps extends Omit<SiteProps, 'departments'> {
    departments: DepartmentProps[];
}

export interface DomainProps {
    id: number;
    code: string;
    name: string;
}

export interface QualificationProps {
    id: number;
    code: string;
    type: string;
    validityNumber: number;
    validityUnit: string;
    reminderNumber: number;
    reminderUnit: string;
}

export interface StrategicAxes {
    id?: number,
    year: number;
    title: string;
}

export interface StrategicAxesSectionProps {
    title: string;
    strategicAxes: StrategicAxes[];
    isOpen: boolean;
    onToggle: () => void;
    onEditStrategicAxes?: (axeToEdit: { title: string; id: number | null; year: string | number }) => void;
    onDeleteStrategicAxes?: (axeToDelete: { title: string; id: number | null; year: string | number }) => void;
}

export interface NeedsProps {
    id: number;
    domain: string;
    theme: string;
    axe: string;
    source: string;
    nbrGroup: number;
    site: string[];
    department: string[];
    creationDate: string;
    status: string;
    // budget: string;
    // ocf: string;
    // group: string;
}

export interface StrategicAxesNeedsProps {
    id: number;
    domain: string;
    theme: string;
    axe: string;
    source: string;
    nbrGroup: number;
    site: string[];
    department: string[];
    creationDate: string;
    status: string;
    // budget: string;
    // ocf: string;
    // group: string;
}

export interface ManualEntryNeedsProps {
    axe: string;
    sites: string[];
    departments: string[];
    domains: string;
    theme: string;
    noDays: number;
    type: string;
    noGroup: number;
    qualifications: string[];
    objective: string,
    content: string;
    csf: string;
    status: string;
    source: string;
}

export interface AccessRightProps {
    page: string;
    action: string;
    allowed: boolean;
}


export interface GroupesProps {
    id: number;
    nom: string;
    date: string;
    participants: number;
    client: string;
    prix: string;
    formateur: string;
}

export interface NeedsStrategicAxe {
    num: string;
    domaine: string;
    theme: string;
    source: string;
    noGroup: string;
    site: string;
    department: string;
    status: string;
    actions: null;
    groupes: GroupesProps[];
}

export interface InternalCatalogProps {
    ref: string;
    domaine: string;
    theme: string;
    plan: string;
    department: string;
    type: string;
}

export interface ExternalCatalogProps {
    ref: string;
    domaine: string;
    theme: string;
    ocf: string;
}

export interface OCFCatalogProps {
    ref: string;
    domaine: string;
    theme: string;
    ocf: string;
    actions?: null;
    select?: boolean;
}

export interface NeedsEvaluationProps {
    id: number;
    domaine: string;
    theme: string;
    questionnaire: string;
    priority: string;
    validatedBy: string;
    status: string;
}

export interface NeedsEvaluationCampaignProps {
    title: string;
    creationDate: string;
    questionnaire: string;
    department: string;
    site: string;
    status: string;
    progress: number;
}

export interface NeedsEvaluationCampaignDetailsProps {
    id: string;
    participantId: number;
    questionnaireId: string;
    site: string;
    department: string;
    lastName: string;
    firstName: string;
    groupe: string;
    status: string;
    approver: string;
    responseDate: string;
}

export interface NeedsEvaluationAddProps {
    id: number;
    code: string;
    firstName: string;
    lastName: string;
    poste: string;
    level: string;
    manager: string;
    department: string;
}

export interface NeedsInternalCatalogDashboardProps {
    ref: string;
    domaine: string;
    theme: string;
    site: string;
    department: string;
    status: string;
}

export interface NeedsInternalCatalogCProps {
    ref: string;
    domain: string;
    theme: string;
    plan: string;
    department: string;
    type: string;
}

export interface NeedsOCFCatalogDashboardProps {
    ref: string;
    domaine: string;
    theme: string;
    ocf: string;
    site: string;
    department: string;
    status: string;
}

export interface NeedsOCFCatalogCProps {
    ref: string;
    domaine: string;
    theme: string;
    ocf: string;
}

export interface NeedsIndividualRequestProps {
    id: number;
    year: number;
    domain: string;
    theme: string;
    site: string;
    department: string;
    creationDate: string;
    requester: string;
    approver: string;
    status: string;
}

export interface AnnualPlanProps {
    exercice: string;
    title: string;
    estimatedBudget: string;
    actualBudget: string;
    status: string;
}

export interface PlanRefundProps {
    exercice: string;
    title: string;
    fundingRequest: string;
    refundRequest: string;
    status: string;
}

export interface PlanRefundExerciceProps {
    number: number;
    theme: string;
    completionDate: string;
    staff: number;
    cost: string;
    ocf: string;
    status: string;
    document: string;
}

export interface PlanAnnualExerciceProps {
    id: string;
    number: number;
    theme: string;
    date: string;
    type: string;
    ocf: string;
    budget: string;
    status: string;
}

export interface PlanAnnualExerciceThemeProps {
    group: string;
    date: string;
    staff: number;
    nbrDay: number;
    cost: string;
    supplier: string;
    status: string;
}

export interface SupplierProps {
    id: number;
    code: string;
    corporateName: string;
    ice: string;
    phone: string;
    email: string;
    nameMainContact: string;
    positionMainContact: string;
    emailMainContact: string;
    phoneMainContact: string;
    status: string;
}

export interface Evaluation {
    title: string;
}

export interface EvaluationSectionProps {
    type: string;
    evaluations: EvaluationsProps[];
    isOpen: boolean;
    onToggle: () => void;
    questionnaireTypeForNewModel: string,
}

export interface EvaluationItemProps {
    title: string;
}

// export interface NavItem {
//   name: string;
//   icon: React.ReactNode;
//   path: string;
//   subItems?: NavItem[];
// }

export interface NavState {
    isCollapsed: boolean;
    openSubmenu: string | null;
}


export interface NavSubItem {
    id: string;
    name: string;
    icon?: React.ReactNode;
}

export interface NavItem {
    id: string;
    name: string;
    icon?: React.ReactNode;
    subItems?: readonly NavSubItem[];
    path?: string;
}

export interface NavigationState {
    activeTab: string;
    activeSubItem: string | null;
}

export interface PlanGroupUserProps {
    code: string;
    firstName: string;
    lastName: string;
    position: string;
    level: string;
    manager: string;
    confirmation?: string;
    cin?: string;
    cnss?: string;
}

export interface TeamEvaluationProps {
    id: string;
    title: string;
    type: string;
    status: string;
    participantIds: number[]
    participants: number;
    progress: number;
    creationDate: string;
}

export interface TeamEvaluationDetailsProps {
    id: string;
    title: string;
    description: string;
    status: string;
    startDate: string;
    creationDate: string;
    type: string;
    progress: number;
    participants: TeamEvaluationDetailsForUserProps[]
    questions?: QuestionsProps[];
}

export interface TeamEvaluationDetailsForUserProps {
    id: string;
    name: string;
    groupe: string
    position: string;
    progress: number;
    status: string;
    isSentToManager: boolean;
    isSentToAdmin: boolean;
}

export interface MyEvaluationsProps {
    id: string;
    category: string;
    title: string;
    type: string;
    description: string;
    creationDate: string;
    startDate: string;
    progress: number;
    status: string;
    isSentToManager: boolean;
    questions: QuestionsProps[];
}

export interface UserEvaluationProps {
    id: string;
    category: string;
    title: string;
    type: string;
    description: string;
    creationDate: string;
    startDate: string;
    progress: number;
    status: string;
    isSentToManager: boolean;
    questions: QuestionsProps[];
    responses: UserResponse[];
}

export interface UserResponse {
    id?: string;
    companyId?: number;
    userId: number;
    questionnaireId: string;
    questionId: string;
    responseType: string;
    textResponse?: string | null;
    commentResponse?: string | null;
    scoreResponse?: number | null;
    ratingResponse?: number | null;
    multipleChoiceResponse?: string[] | null;
    singleChoiceResponse?: string | null;
    singleLevelChoiceResponse?: string | null;
    status?: string;
    isSentToManger?: boolean;
    progression?: number;
    startDate?: string;
    lastModifiedDate?: string;
    campaignEvaluationId?: string | null;
}

export interface QuestionsProps {
    id: string;
    companyId: number;
    type: string;
    text: string;
    options: string[];
    levels: string[];
    scoreValue: number;
    ratingValue: number;
}

export interface UserResponseProps {
    id?: string; // L'ID est généré par le backend
    companyId?: number; // Sera géré par le backend
    userId: number;
    questionnaireId: string;
    questionId: string;
    responseType: string;
    textResponse?: number | null;
    scoreResponse?: number | null;
    multipleChoiceResponse?: number[] | null;
    singleChoiceResponse?: number | null;
    status?: string;
    progression?: number;
    startDate?: string;
    lastModifiedDate?: string;
    campaignEvaluationId?: string | null; // Sera géré par le backend
}

export interface PlanGroupUser2Props {
    firstName: string;
    lastName: string;
    cin: string;
    cnss: string;
    status: string;
}

export interface PlanGroupEvaluationProps {
    number: string;
    label: string;
    type: string;
    creationDate: string;
    status: string;
}

export interface AccountingsProps {
    id: string;
    type: string;
    creationDate: string;
    description: string;
    amount: string;
    status: string;
    paymentDate: string;
}

export interface UserDataProps {
    id: number;
    fullName: string;
    group: string;
    creationDate: string;
    status: string;
}

export interface CollaboratorProps {
    id: number;
    companyId: number;
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    position: string;
    groupe: string;
    department: string;
    creationDate: string;
    level: string;
    status: string;
}

export interface MyProfileProps {
    id: number;
    companyId: number;
    personalInfos: PersonalInfosProps;
    professionalInfos: ProfessionalInfosProps;
}

export interface PersonalInfosProps {
    fullName: string;
    gender: string;
    birthDate: string;
    address: string;
    phoneNumber: string;
    email: string;
    cin: string;
}

export interface ProfessionalInfosProps {
    collaboratorCode: string;
    hiringDate: string;
    department: string;
    position: string;
    socialSecurityNumber: string;
    certificates: string[];
    competences: string[];
}

export interface UserProps {
    level: string;
    code: string;
    id: number;
    companyId: number;
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    gender: string;
    birthDate: string;
    phoneNumber: string;
    address: string;
    cin: string;
    collaboratorCode: string;
    hiringDate: string;
    socialSecurityNumber: string;
    department: string;
    position: string;
    role: string;
    manager: string;
    creationDate: string;
    status: string;
}

export interface RoleUserProps {
    id: number;
    companyId: number;
    userId: number;
    name: string;
    description: string;
}

// Types pour l'importation CSV
export interface CsvUserData {
    firstName: string;
    lastName: string;
    gender: string;
    birthDate: string;
    phoneNumber: string;
    address: string;
    cin: string;
    collaboratorCode: string;
    hiringDate: string;
    socialSecurityNumber: string;
    department: string;
    position: string;
    email: string;
    creationDate: string;
    status?: string;
}

export interface MyRequestsProps {
    id: number;
    year: number;
    domain: string;
    theme: string;
    site: string;
    department: string;
    wishDate: string;
    requester: string;
    approvedBy: boolean;
    objective: string;
    content: string;
    learningMode: string;
}

export interface TeamRequestsProps {
    id: number;
    year: number;
    domain: string;
    theme: string;
    site: string;
    department: string;
    creationDate: string;
    requester: string;
    approver: string;
    objective: string;
    status: string;
}

export interface UpdateCampaignProps {
    id: number;
    title: string;
    instructions: string;
    siteIds: number[];
    departmentIds: number[];
    questionnaireIds: string[];
    participantIds: number[];
}

export interface QuestionnaireProps {
    id: string;
    title: string;
}

export interface EvaluationCampaignParticipantProps {
    id: number;
    code: string;
    firstName: string;
    lastName: string;
    position: string;
    level: string;
    manager: string;
    department: string;
}


export interface EvaluationsProps {
    id: string;
    type: string;
    title: string;
    isDefault: boolean;

}

export interface EvaluationsByTypeProps {
    type: string;
    questionnaires: EvaluationsProps[]
}

export interface PlanPagedResponse<T> {
    content: T[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
    first: boolean;
}

export interface PlansProps {
    id: string;
    title: string;
    year: number;
    startDate: string;
    endDate: string;
    estimatedBudget: number;
    isCSFPlan: boolean;
    isOFPPTValidation: boolean;
    status: string;
}

export interface TrainingProps {
    id: number;
    theme: string;
    date: string;
    type: string;
    ocf: string;
    budget: string;
    csf: boolean;
    status: string;
    // Nouvelle propriété pour les dates des groupes
    groupDates?: GroupDatesProps[];
}

export interface GroupDatesProps {
    groupId: number;
    groupName: string;
    dates: string[];
}

export interface ValidatedNeedToAddToPlanProps {
    id: string;
    theme: string;
    source: number;
}

export interface TrainingInvitationProps {
    id: string;
    userId: number;
    userFullName: string;
    invitationDate: string;
    status: string;
}

export interface GroupeEvaluationProps {
    id: string;
    label: string;
    description: string;
    creationDate: string;
    status: string;
}

export interface GroupeEvaluationDetailProps {
    id: number;
    name: string;
    firstName: string;
    lastName: string;
    cin: string;
    cnss: string;
    position: string;
    groupe: string;
    progress: number;
    status: string;
    isSentToManager: boolean;
    isSentToAdmin: boolean;
}

// 🆕 Interface pour les détails d'édition (correspondant au DTO backend)
export interface GroupeEvaluationEditDetailsProps {
    id: string;
    label: string;
    type: string;
    description: string;
    creationDate: string;
    status: string;
    questionnaireId: string; // UUID côté backend
    participantIds: number[];
}

// Mise à jour de l'interface existante
export interface GroupeEvaluationProps {
    id: string;
    label: string;
    description: string;
    creationDate: string;
    status: string;
    // 🆕 Champs optionnels pour l'édition
    type?: string;
    questionnaireId?: string;
    participantIds?: number[];
}