// src/contexts/PermissionContext.tsx
import React, {createContext, ReactNode, useCallback, useContext, useEffect, useState} from 'react';
import {useAuth} from '@/contexts/AuthContext';

interface ModulePermissions {
    [action: string]: boolean;
}

interface UserPermissions {
    [module: string]: ModulePermissions;
}

interface PermissionContextType {
    permissions: UserPermissions;
    loading: boolean;
    hasPermission: (module: string, action: string) => boolean;
    checkPermission: (module: string, action: string) => Promise<boolean>;
    refreshPermissions: () => Promise<void>;
    loadModulePermissions: (module: string) => Promise<void>;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

interface PermissionProviderProps {
    children: ReactNode;
}

// Actions disponibles par module
const MODULE_ACTIONS = {
    users: ['view', 'create', 'edit', 'delete', 'export', 'view_details'],
    plan: ['view', 'create', 'edit', 'approve'],
    // Ajoutez d'autres modules selon vos besoins
};

const PERMISSIONS_API_URL = "/api/access-rights/check-permission";

export const PermissionProvider = ({children}: PermissionProviderProps) => {
    const {user} = useAuth();
    const [permissions, setPermissions] = useState<UserPermissions>({});
    const [loading, setLoading] = useState(false);

    // Fonction pour vérifier une permission spécifique
    const checkPermission = useCallback(async (module: string, action: string): Promise<boolean> => {
        if (!user) return false;

        // Les admins ont tous les droits
        if (user.role === 'Admin') return true;

        try {
            const response = await fetch(PERMISSIONS_API_URL, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user.id,
                    module,
                    action
                }),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la vérification des permissions');
            }

            const data = await response.json();
            return data.hasPermission;
        } catch (error) {
            console.error('Erreur de vérification de permission:', error);
            return false;
        }
    }, [user]);

    // Fonction pour vérifier une permission depuis le cache local
    const hasPermission = useCallback((module: string, action: string): boolean => {
        if (!user) return false;
        if (user.role === 'Admin') return true;

        return permissions[module]?.[action] || false;
    }, [user, permissions]);

    // Charger les permissions d'un module spécifique
    const loadModulePermissions = useCallback(async (module: string) => {
        if (!user || user.role === 'Admin') return;

        setLoading(true);
        try {
            const moduleActions = MODULE_ACTIONS[module] || [];
            const modulePermissions: ModulePermissions = {};

            // Vérifier toutes les permissions du module en parallèle
            const permissionChecks = moduleActions.map(async (action) => {
                const hasPermission = await checkPermission(module, action);
                return {action, hasPermission};
            });

            const results = await Promise.all(permissionChecks);

            results.forEach(({action, hasPermission}) => {
                modulePermissions[action] = hasPermission;
            });

            setPermissions(prev => ({
                ...prev,
                [module]: modulePermissions
            }));
        } catch (error) {
            console.error(`Erreur lors du chargement des permissions pour ${module}:`, error);
        } finally {
            setLoading(false);
        }
    }, [user, checkPermission]);

    // Rafraîchir toutes les permissions
    const refreshPermissions = useCallback(async () => {
        if (!user || user.role === 'Admin') return;

        setLoading(true);
        try {
            const newPermissions: UserPermissions = {};

            for (const module of Object.keys(MODULE_ACTIONS)) {
                const moduleActions = MODULE_ACTIONS[module];
                const modulePermissions: ModulePermissions = {};

                const permissionChecks = moduleActions.map(async (action) => {
                    const hasPermission = await checkPermission(module, action);
                    return {action, hasPermission};
                });

                const results = await Promise.all(permissionChecks);

                results.forEach(({action, hasPermission}) => {
                    modulePermissions[action] = hasPermission;
                });

                newPermissions[module] = modulePermissions;
            }

            setPermissions(newPermissions);
        } catch (error) {
            console.error('Erreur lors du rafraîchissement des permissions:', error);
        } finally {
            setLoading(false);
        }
    }, [user, checkPermission]);

    // Charger les permissions au montage du composant
    useEffect(() => {
        if (user && user.role !== 'Admin') {
            refreshPermissions();
        }
    }, [user, refreshPermissions]);

    const value: PermissionContextType = {
        permissions,
        loading,
        hasPermission,
        checkPermission,
        refreshPermissions,
        loadModulePermissions,
    };

    return (
        <PermissionContext.Provider value={value}>
            {children}
        </PermissionContext.Provider>
    );
};

export const usePermissions = () => {
    const context = useContext(PermissionContext);
    if (context === undefined) {
        throw new Error('usePermissions must be used within a PermissionProvider');
    }
    return context;
};