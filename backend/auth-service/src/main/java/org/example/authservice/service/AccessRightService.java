package org.example.authservice.service;

import lombok.extern.slf4j.Slf4j;
import org.example.authservice.dto.*;
import org.example.authservice.entity.AccessRight;
import org.example.authservice.entity.Groupe;
import org.example.authservice.entity.User;
import org.example.authservice.exceptions.GroupeNotFoundException;
import org.example.authservice.exceptions.UserNotFoundException;
import org.example.authservice.repository.AccessRightRepository;
import org.example.authservice.repository.GroupeRepository;
import org.example.authservice.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Slf4j
@Transactional
public class AccessRightService {

    private final AccessRightRepository accessRightRepository;
    private final GroupeRepository groupeRepository;
    private final UserRepository userRepository;

    // Mise à jour dans AccessRightService.java - Configuration des modules

    // Définition étendue des actions par module
    private static final Map<String, Map<String, String>> MODULE_ACTIONS = new HashMap<>();

    static {
        // Module Utilisateurs
        Map<String, String> userActions = new HashMap<>();
        userActions.put("view", "Voir la liste des utilisateurs");
        userActions.put("create", "Créer un nouvel utilisateur");
        userActions.put("edit", "Modifier un utilisateur");
        userActions.put("delete", "Supprimer un utilisateur");
        userActions.put("export", "Exporter la liste des utilisateurs");
        userActions.put("view_details", "Voir les détails d'un utilisateur");
        userActions.put("import", "Importer des utilisateurs (CSV)");
        userActions.put("change_status", "Changer le statut d'un utilisateur");
        userActions.put("change_role", "Changer le rôle d'un utilisateur");
        userActions.put("assign_manager", "Assigner un manager");
        MODULE_ACTIONS.put("users", userActions);

        // Module Plan
        Map<String, String> planActions = new HashMap<>();
        planActions.put("view", "Voir les plans de formation");
        planActions.put("create", "Créer un plan de formation");
        planActions.put("edit", "Modifier un plan de formation");
        planActions.put("delete", "Supprimer un plan");
        planActions.put("approve", "Approuver un plan");
        planActions.put("publish", "Publier un plan");
        planActions.put("export", "Exporter un plan");
        planActions.put("duplicate", "Dupliquer un plan");
        MODULE_ACTIONS.put("plan", planActions);

        // Module Évaluations
        Map<String, String> evaluationActions = new HashMap<>();
        evaluationActions.put("view", "Voir les évaluations");
        evaluationActions.put("create", "Créer une évaluation");
        evaluationActions.put("edit", "Modifier une évaluation");
        evaluationActions.put("delete", "Supprimer une évaluation");
        evaluationActions.put("respond", "Répondre à une évaluation");
        evaluationActions.put("approve", "Approuver une évaluation");
        evaluationActions.put("publish", "Publier une évaluation");
        evaluationActions.put("view_results", "Voir les résultats d'évaluation");
        MODULE_ACTIONS.put("evaluations", evaluationActions);

        // Module Besoins
        Map<String, String> needsActions = new HashMap<>();
        needsActions.put("view", "Voir les besoins de formation");
        needsActions.put("create", "Créer un besoin");
        needsActions.put("edit", "Modifier un besoin");
        needsActions.put("delete", "Supprimer un besoin");
        needsActions.put("validate", "Valider un besoin");
        needsActions.put("assign", "Assigner un besoin");
        MODULE_ACTIONS.put("needs", needsActions);

        // Module Groupes/Permissions
        Map<String, String> groupActions = new HashMap<>();
        groupActions.put("view", "Voir les groupes");
        groupActions.put("create", "Créer un groupe");
        groupActions.put("edit", "Modifier un groupe");
        groupActions.put("delete", "Supprimer un groupe");
        groupActions.put("manage_permissions", "Gérer les permissions");
        MODULE_ACTIONS.put("groups", groupActions);

        // Module Rapports
        Map<String, String> reportActions = new HashMap<>();
        reportActions.put("view", "Voir les rapports");
        reportActions.put("generate", "Générer des rapports");
        reportActions.put("export", "Exporter des rapports");
        reportActions.put("schedule", "Programmer des rapports");
        MODULE_ACTIONS.put("reports", reportActions);

        // Module Paramètres
        Map<String, String> settingsActions = new HashMap<>();
        settingsActions.put("view", "Voir les paramètres");
        settingsActions.put("edit", "Modifier les paramètres");
        settingsActions.put("manage_company", "Gérer les informations entreprise");
        settingsActions.put("manage_notifications", "Gérer les notifications");
        MODULE_ACTIONS.put("settings", settingsActions);
    }

    /**
     * Méthode pour ajouter de nouveaux modules dynamiquement
     * Utile pour l'extensibilité future
     */
    public void addModuleActions(String module, Map<String, String> actions) {
        MODULE_ACTIONS.put(module, actions);
        log.info("Nouveau module ajouté : {} avec {} actions", module, actions.size());
    }

    /**
     * Méthode pour obtenir les modules disponibles
     */
    public Set<String> getAvailableModules() {
        return MODULE_ACTIONS.keySet();
    }

    /**
     * Méthode pour obtenir les actions d'un module spécifique
     */
    public Map<String, String> getModuleActions(String module) {
        return MODULE_ACTIONS.getOrDefault(module, new HashMap<>());
    }

    public AccessRightService(AccessRightRepository accessRightRepository,
                              GroupeRepository groupeRepository,
                              UserRepository userRepository) {
        this.accessRightRepository = accessRightRepository;
        this.groupeRepository = groupeRepository;
        this.userRepository = userRepository;
    }

    /**
     * Crée les droits d'accès par défaut pour un nouveau groupe
     */
    public void createDefaultAccessRights(Groupe groupe) {
        log.info("Création des droits d'accès par défaut pour le groupe : {}", groupe.getName());

        for (String module : MODULE_ACTIONS.keySet()) {
            Map<String, String> actions = MODULE_ACTIONS.get(module);

            for (String action : actions.keySet()) {
                // Définir les permissions par défaut selon le groupe
                boolean defaultAllowed = getDefaultPermission(groupe.getName(), module, action);

                AccessRight accessRight = AccessRight.builder()
                        .groupe(groupe)
                        .module(module)
                        .action(action)
                        .allowed(defaultAllowed)
                        .build();

                accessRightRepository.save(accessRight);
            }
        }
    }

    /**
     * Définit les permissions par défaut selon le rôle
     */
    /**
     * Définit les permissions par défaut selon le rôle - Version personnalisée
     */
    private boolean getDefaultPermission(String groupeName, String module, String action) {
        return switch (groupeName.toLowerCase()) {
            case "admin" -> true; // Admin a tous les droits sur tous les modules

            case "manager" -> switch (module) {
                case "users" -> switch (action) {
                    case "view", "create", "edit", "export", "view_details" -> true;
                    case "delete" -> false; // Manager ne peut pas supprimer les utilisateurs
                    default -> false;
                };
                case "plan" -> true; // Manager a tous les droits sur le plan
                case "evaluations" -> switch (action) {
                    case "view", "create", "edit" -> true;
                    case "delete", "approve" -> false;
                    default -> false;
                };
                default -> false;
            };

            case "formateur" -> switch (module) {
                case "users" -> switch (action) {
                    case "view", "view_details" -> true; // Formateur peut voir la liste et détails
                    case "create", "edit", "delete", "export" -> false;
                    default -> false;
                };
                case "plan" -> switch (action) {
                    case "view" -> true; // Peut voir le plan mais pas le modifier
                    case "create", "edit", "delete", "approve" -> false;
                    default -> false;
                };
                case "evaluations" -> true; // Formateur a tous les droits sur les évaluations
                default -> false;
            };

            case "collaborateur" -> switch (module) {
                case "users" -> switch (action) {
                    case "view_details" -> true; // Peut voir ses propres détails uniquement
                    case "view", "create", "edit", "delete", "export" -> false;
                    default -> false;
                };
                case "evaluations" -> switch (action) {
                    case "view", "create" -> true; // Peut voir et répondre aux évaluations
                    case "edit", "delete", "approve" -> false;
                    default -> false;
                };
                default -> false;
            };

            case "employé" -> switch (module) {
                case "users" -> switch (action) {
                    case "view_details" -> true; // Peut voir ses propres détails uniquement
                    case "view", "create", "edit", "delete", "export" -> false;
                    default -> false;
                };
                case "evaluations" -> switch (action) {
                    case "view" -> true; // Peut voir les évaluations qui lui sont assignées
                    case "create", "edit", "delete", "approve" -> false;
                    default -> false;
                };
                default -> false;
            };

            // Groupes personnalisés
            case "manager/formateur", "formateur-manager" -> switch (module) {
                case "users" -> switch (action) {
                    case "view", "create", "edit", "view_details" -> true;
                    case "delete", "export" -> false;
                    default -> false;
                };
                case "plan", "evaluations" -> true; // Droits complets sur plan et évaluations
                default -> false;
            };

            case "fournisseur", "supplier" -> switch (module) {
                case "plan" -> switch (action) {
                    case "view" -> true; // Peut voir les plans qui le concernent
                    case "create", "edit", "delete", "approve" -> false;
                    default -> false;
                };
                default -> false;
            };

            default -> false; // Par défaut, aucun droit pour les groupes non reconnus
        };
    }

    /**
     * Met à jour les droits d'accès pour un groupe et un module
     */
    public GroupAccessRightsResponse updateAccessRights(UpdateAccessRightsRequest request) {
        log.info("Mise à jour des droits d'accès pour le groupe {} et le module {}",
                request.getGroupeId(), request.getModule());

        Groupe groupe = groupeRepository.findById(request.getGroupeId())
                .orElseThrow(() -> new GroupeNotFoundException("Groupe non trouvé"));

        // Mettre à jour ou créer les droits d'accès
        for (AccessRightUpdateDto dto : request.getAccessRights()) {
            AccessRight accessRight = accessRightRepository
                    .findByGroupeAndModuleAndAction(groupe, request.getModule(), dto.getAction())
                    .orElse(AccessRight.builder()
                            .groupe(groupe)
                            .module(request.getModule())
                            .action(dto.getAction())
                            .build());

            accessRight.setAllowed(dto.getAllowed());
            accessRightRepository.save(accessRight);
        }

        return getGroupAccessRights(request.getGroupeId(), request.getModule());
    }

    /**
     * Récupère les droits d'accès d'un groupe pour un module
     */
    public GroupAccessRightsResponse getGroupAccessRights(Long groupeId, String module) {
        Groupe groupe = groupeRepository.findById(groupeId)
                .orElseThrow(() -> new GroupeNotFoundException("Groupe non trouvé"));

        List<AccessRight> accessRights = accessRightRepository.findByGroupeIdAndModule(groupeId, module);
        Map<String, String> moduleActions = MODULE_ACTIONS.get(module);

        // Créer les droits manquants avec valeur par défaut
        for (String action : moduleActions.keySet()) {
            boolean exists = accessRights.stream()
                    .anyMatch(ar -> ar.getAction().equals(action));

            if (!exists) {
                boolean defaultAllowed = getDefaultPermission(groupe.getName(), module, action);
                AccessRight newAccessRight = AccessRight.builder()
                        .groupe(groupe)
                        .module(module)
                        .action(action)
                        .allowed(defaultAllowed)
                        .build();
                accessRightRepository.save(newAccessRight);
                accessRights.add(newAccessRight);
            }
        }

        List<AccessRightDto> accessRightDtos = accessRights.stream()
                .map(ar -> AccessRightDto.builder()
                        .id(ar.getId())
                        .action(ar.getAction())
                        .allowed(ar.getAllowed())
                        .actionLabel(moduleActions.get(ar.getAction()))
                        .build())
                .collect(Collectors.toList());

        return GroupAccessRightsResponse.builder()
                .groupeId(groupeId)
                .groupeName(groupe.getName())
                .module(module)
                .accessRights(accessRightDtos)
                .build();
    }

    /**
     * Vérifie si un utilisateur a la permission pour une action sur un module
     */
    public UserPermissionResponse checkUserPermission(Long userId, String module, String action) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("Utilisateur non trouvé", null));

        // Les admins ont tous les droits
        if ("Admin".equalsIgnoreCase(user.getRole())) {
            return UserPermissionResponse.builder()
                    .hasPermission(true)
                    .message("Administrateur - Accès autorisé")
                    .build();
        }

        AccessRight accessRight = accessRightRepository
                .findByGroupeAndModuleAndAction(user.getGroupe(), module, action)
                .orElse(null);

        boolean hasPermission = accessRight != null && accessRight.getAllowed();

        return UserPermissionResponse.builder()
                .hasPermission(hasPermission)
                .message(hasPermission ? "Accès autorisé" : "Accès refusé")
                .build();
    }

    /**
     * Récupère tous les modules et actions disponibles
     */
    public Map<String, Map<String, String>> getAllModuleActions() {
        return MODULE_ACTIONS;
    }

    /**
     * Supprime tous les droits d'accès d'un groupe
     */
    public void deleteGroupAccessRights(Long groupeId) {
        log.info("Suppression des droits d'accès pour le groupe : {}", groupeId);
        accessRightRepository.deleteByGroupeId(groupeId);
    }

}