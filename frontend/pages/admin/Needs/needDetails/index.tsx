import React, {ChangeEvent, useEffect, useMemo, useState} from "react";
import {useRouter} from "next/router";
import TextAreaField from "@/components/FormComponents/TextAreaField";
import Switch from "@/components/FormComponents/Switch";
import {NEEDS_GROUP_URLS, NEEDS_STRATEGIC_AXES_URLS} from "@/config/urls";
import InputField from "@/components/FormComponents/InputField";
import SearchFilterAddBar from "@/components/SearchFilterAddBar";
import ModalButton from "@/components/ModalButton";
import Table from "@/components/Tables/Table/index";
import {handleSort} from "@/utils/sortUtils";
import PlusIcon from "@/components/Svgs/PlusIcon";
import useTable from "@/hooks/useTable";
import {statusConfig} from "@/config/tableConfig";
import StatusRenderer from "@/components/Tables/StatusRenderer";
import DynamicActionsRenderer from "@/components/Tables/DynamicActionsRenderer";
import {useRoleBasedNavigation} from "@/hooks/useRoleBasedNavigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import {UserRole} from "@/contexts/AuthContext";

interface FormData {
    domain: number | null; // Pourrait être string | number | undefined selon InputField
    theme: string;
    objective: string;
    content: string;
    csf: boolean;
    csfPlanifie: string;
    comment?: string; // Ajout du champ commentaire à l'interface
}

interface GroupData {
    id: number;
    name: string;
    dates: string | null; // Date au format ISO
    startDate: string | null;
    participantCount: number;
    dayCount: number;
    price: number;
    trainerName: string | null;
    status: string; // Correspond à GroupeStatusEnums côté backend
}

const TABLE_HEADERS = [
    "Groupe",
    "Date",
    "Éffectif",
    "Nbr de jours",
    "Coût",
    "Fournisseur",
    "Statut",
    "Actions",
];
const TABLE_KEYS = [
    "name", // Utilisation de 'name' au lieu de 'group' car c'est la clé dans GroupData
    "dates", // Utilisation de 'startDate' au lieu de 'date'
    "participantCount", // Utilisation de 'participantCount' au lieu de 'staff'
    "dayCount", // Utilisation de 'dayCount' au lieu de 'nbrDay'
    "price", // Utilisation de 'price' au lieu de 'cost'
    "trainerName", // Utilisation de 'trainerName' au lieu de 'supplier'
    "status",
    "actions",
];

const ACTIONS_TO_SHOW = ["edit", "delete"];
const RECORDS_PER_PAGE = 4;

const NeedDetails = () => {
    const {navigateTo, buildRoleBasedPath} = useRoleBasedNavigation();
    const router = useRouter();
    const {id} = router.query;
    const [formData, setFormData] = useState<FormData>({
        domain: null,
        theme: "",
        objective: "",
        content: "",
        csf: false,
        csfPlanifie: '',
        comment: '',
    });
    const [groupData, setGroupData] = useState<GroupData[]>([]); // Nouvel état pour les données des groupes
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            const fetchNeedData = async () => {
                setLoading(true);
                setError(null);
                try {
                    const response = await fetch(NEEDS_STRATEGIC_AXES_URLS.getDetails + `/${id}`, {
                        method: "GET",
                        credentials: "include",
                    });

                    if (!response.ok) {
                        throw new Error(`Erreur lors de la récupération des données : ${response.status}`);
                    }

                    const needData = await response.json();
                    console.log(needData);

                    setFormData({
                        domain: needData.domain || null,
                        theme: needData.theme || "",
                        objective: needData.objective || "",
                        content: needData.content || "",
                        csf: needData.csf === true || needData.csf === 'true',
                        csfPlanifie: needData.csfPlanifie || '',
                        comment: needData.comment || '',
                    });

                    // Extraction des données des groupes
                    if (needData.groups && Array.isArray(needData.groups)) {
                        console.log("groupes");
                        setGroupData(needData.groups);
                    } else {
                        setGroupData([]); // S'assurer que l'état est un tableau même si l'API ne renvoie rien
                        console.warn("Les données des groupes sont absentes ou dans un format incorrect.");
                    }

                } catch (err) {
                    console.error("Erreur lors de la récupération des données du besoin :", err);
                    setError("Une erreur est survenue lors du chargement des détails du besoin.");
                } finally {
                    setLoading(false);
                }
            };

            fetchNeedData();
        }
    }, [id]);

    const handleGroupDelete = (groupId: number) => {
        setGroupData((prevData) => prevData.filter((group) => group.id !== groupId));
    };

    const memoizedGroupData = useMemo(() => groupData || [], [groupData]);
    const {
        currentPage,
        visibleColumns,
        setCurrentPage,
        handleSortData,
        toggleColumnVisibility,
        totalPages,
        totalRecords,
        paginatedData,
        sortableColumns,
    } = useTable(
        memoizedGroupData,
        TABLE_HEADERS,
        TABLE_KEYS,
        RECORDS_PER_PAGE,
    );

    // Renderers
    const renderers = {
        name: (value: string, row: GroupData) => (
            <button
                className="text-left hover:text-blue-600 hover:underline transition-colors duration-200 font-medium"
                onClick={() => {
                    navigateTo(buildRoleBasedPath(`/Needs/group/add-group`), {
                        query: {
                            needId: id,
                            groupId: row.id
                        },
                    })
                }}
                title="Cliquer pour modifier ce groupe"
            >
                {value}
            </button>
        ),
        status: (value: string, row: GroupData) => (
            <StatusRenderer
                value={value}
                groupeConfig={statusConfig}
                row={row}
                statusOptions={["Brouillon", "Validé"]}
            />
        ),
        actions: (_: any, row: GroupData) => (
            <DynamicActionsRenderer
                actions={ACTIONS_TO_SHOW}
                row={row}
                deleteUrl={NEEDS_GROUP_URLS.delete}
                onDeleteSuccess={handleGroupDelete}
                editUrl={NEEDS_GROUP_URLS.addPage}
                customEditHandler={(row) => {
                    navigateTo(buildRoleBasedPath(`/Needs/group/add-group`), {
                        query: {
                            needId: id,
                            groupId: row.id
                        },
                    })
                }}
                // 🆕 Nouvelle prop pour désactiver la suppression conditionnellement
                getActionDisabledState={(actionKey: string, row: any) => {
                    // Désactiver la suppression s'il n'y a qu'un seul groupe
                    return actionKey === 'delete' && memoizedGroupData.length <= 1;

                }}
                // 🔧 Message simple pour la confirmation de suppression
                confirmMessage="Êtes-vous sûr de vouloir supprimer ce groupe ?"
            />
        ),
    };

    // Composant SelectField pour CSF Planifié
    const planifieSelect = formData.csf ? (
        <InputField
            label={""}
            name="csfPlanifie"
            value={formData.csfPlanifie}
            disabled={true}
        />
    ) : null;

    // Gestion de la modification du champ Commentaire (si vous souhaitez l'activer)
    const handleCommentChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setFormData({...formData, comment: event.target.value});
    };

    if (loading) {
        return <div>Chargement des détails du besoin...</div>; // Afficher un indicateur de chargement
    }

    if (error) {
        return <div>{error}</div>; // Afficher un message d'erreur
    }

    const handleAddGroup = () => {
        // Logique pour ajouter un groupe
        navigateTo(buildRoleBasedPath("/Needs/group/add-group"), {
            query: {
                needId: id,
            }
        })
    };

    return (
        <ProtectedRoute requiredRole={UserRole.Admin}>
            <div className="bg-white rounded-xl">
                <div className="mx-auto bg-white font-title rounded-lg px-6 pb-14 pt-16">
                    <div className="grid md:grid-cols-2 gap-y-4 gap-x-8 md:gap-x-16 lg:gap-x-24 mb-4">
                        <InputField
                            label={"Domaine"}
                            name={"domain"}
                            value={formData.domain}
                            disabled={true}
                        />
                        <InputField
                            label={"Thème"}
                            value={formData.theme}
                            name={"theme"}
                            disabled={true}
                        />
                        <TextAreaField
                            label={"Objectif"}
                            value={formData.objective}
                            name={"objective"}
                            onChange={(e) => setFormData({...formData, objective: e.target.value})}
                        />
                        <TextAreaField
                            value={formData.comment}
                            label={"Commentaire"}
                            name={"comment"}
                            onChange={handleCommentChange} // Liaison de la fonction de gestion du changement
                        />
                        <TextAreaField
                            value={formData.content}
                            label={"Contenu"}
                            name={"content"}
                            onChange={(e) => setFormData({...formData, content: e.target.value})}
                        />
                        <Switch
                            label="CSF"
                            name="csf"
                            checked={formData.csf}
                            planifieField={planifieSelect}
                            onChange={() => {
                                // Empêche le changement d'état, donc le switch ne se togglera pas.
                                console.log("Le changement du switch CSF est désactivé.");
                            }}
                        />
                    </div>
                </div>
                {/* Tableau des groupes */}
                <div className="font-title text-xs md:text-sm lg:text-base bg-white rounded-xl pt-6">
                    <div className="flex items-start gap-2 md:gap-8">
                        <SearchFilterAddBar
                            isLeftButtonVisible={false}
                            isFiltersVisible={false}
                            isRightButtonVisible={false} // Afficher le bouton "Nouveau" pour les groupes
                            leftTextButton="Filtrer les colonnes"
                            rightTextButton="Nouveau Groupe"
                            onRightButtonClick={() => alert("Ouvrir modal nouveau groupe")} // Remplacer par la logique d'ajout de groupe
                            filters={[]}
                            placeholderText={"Rechercher des groupes"}
                        />
                        <ModalButton
                            headers={TABLE_HEADERS}
                            visibleColumns={visibleColumns}
                            toggleColumnVisibility={toggleColumnVisibility}
                        />
                    </div>

                    {/* Tableau */}
                    <Table
                        data={paginatedData}
                        keys={TABLE_KEYS}
                        headers={TABLE_HEADERS}
                        sortableCols={sortableColumns}
                        onSort={(column, order) => handleSortData(column, order, handleSort)}
                        isPagination={memoizedGroupData.length > RECORDS_PER_PAGE} // Activer la pagination si nécessaire
                        pagination={{
                            currentPage,
                            totalPages,
                            onPageChange: setCurrentPage,
                        }}
                        totalRecords={totalRecords}
                        loading={false}
                        onAdd={() => console.log("Nouveau groupe")}
                        visibleColumns={visibleColumns}
                        renderers={renderers}
                    />
                    {memoizedGroupData.length <= RECORDS_PER_PAGE && (
                        <div className="mt-6 pl-8 text-xs md:text-sm lg:text-base">
                            <button
                                className="flex items-center font-title justify-center text-white bg-gradient-to-b from-gradientBlueStart to-gradientBlueEnd rounded-lg p-2 text-sm md:text-base md:px-4 md:py-3 hover:shadow-lg transition-shadow duration-200"
                                onClick={handleAddGroup}
                            >
                                <PlusIcon/>
                                <span className="hidden sm:block ml-2">Nouveau Groupe</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}
export default NeedDetails;