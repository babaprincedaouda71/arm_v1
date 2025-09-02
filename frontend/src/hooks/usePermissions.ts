// src/hooks/usePermissions.ts
import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface PermissionCheckRequest {
    userId: number;
    module: string;
    action: string;
}

interface PermissionResponse {
    hasPermission: boolean;
    message: string;
}

interface ModulePermissions {
    [action: string]: boolean;
}

interface UsePermissionsResult {
    checkPermission: (module: string, action: string) => Promise<boolean>;
    checkMultiplePermissions: (module: string, actions: string[]) => Promise<ModulePermissions>;
    loading: boolean;
    error: string | null;
}

const PERMISSIONS_URL = "/api/access-rights/check-permission";

export const usePermissions = (): UsePermissionsResult => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const checkPermission = useCallback(async (module: string, action: string): Promise<boolean> => {
        if (!user) {
            return false;
        }

        // Les admins ont tous les droits
        if (user.role === 'Admin') {
            return true;
        }

        setLoading(true);
        setError(null);

        try {
            const request: PermissionCheckRequest = {
                userId: user.id,
                module,
                action
            };

            const response = await fetch(PERMISSIONS_URL, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(request),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la vérification des permissions');
            }

            const data: PermissionResponse = await response.json();
            return data.hasPermission;
        } catch (error) {
            console.error('Erreur de vérification de permission:', error);
            setError(error instanceof Error ? error.message : 'Erreur inconnue');
            return false;
        } finally {
            setLoading(false);
        }
    }, [user]);

    const checkMultiplePermissions = useCallback(async (
        module: string,
        actions: string[]
    ): Promise<ModulePermissions> => {
        const permissions: ModulePermissions = {};

        // Vérifier toutes les permissions en parallèle
        const permissionChecks = actions.map(async (action) => {
            const hasPermission = await checkPermission(module, action);
            return { action, hasPermission };
        });

        const results = await Promise.all(permissionChecks);

        results.forEach(({ action, hasPermission }) => {
            permissions[action] = hasPermission;
        });

        return permissions;
    }, [checkPermission]);

    return {
        checkPermission,
        checkMultiplePermissions,
        loading,
        error
    };
};