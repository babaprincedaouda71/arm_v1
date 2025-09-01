// src/hooks/useRoleBasedNavigation.tsx
import { useRouter } from 'next/router';
import { useAuth, UserRole } from '@/contexts/AuthContext';

// Définition des types
interface NavigationOptions {
    query?: Record<string, string | number | boolean | string[]>;
    shallow?: boolean;
    preserveQuery?: boolean;
}

// Préfixes d'URL par rôle
const ROLE_PREFIXES: Record<UserRole, string> = {
    [UserRole.Admin]: 'admin',
    [UserRole.Collaborateur]: 'collaborator',
    [UserRole.Manager]: 'manager',
    [UserRole.Formateur]: 'trainer',
    [UserRole.User]: 'user',
};

// Routes qui ne doivent pas utiliser le préfixe de rôle
const NO_PREFIX_ROUTES = [
    '/signin',
    '/forgot-password',
    '/account-creation',
    '/setting-user-password',
];

/**
 * Hook personnalisé pour la navigation basée sur les rôles
 */
export const useRoleBasedNavigation = () => {
    const router = useRouter();
    const { user } = useAuth();

    /**
     * Détermine si une route donnée doit avoir un préfixe
     */
    const shouldAddPrefix = (path: string): boolean => {
        // Si la route commence par un préfixe de rôle connu, ne pas en ajouter un nouveau
        const startsWithRolePrefix = Object.values(ROLE_PREFIXES).some(prefix =>
            path.startsWith(`/${prefix}/`)
        );

        if (startsWithRolePrefix) return false;

        // Ne pas préfixer les routes publiques
        return !NO_PREFIX_ROUTES.some(route =>
            path === route || path.startsWith(`${route}/`)
        );
    };

    /**
     * Construit une URL en fonction du rôle actuel de l'utilisateur
     */
    const buildRoleBasedPath = (path: string): string => {
        // Si pas d'utilisateur ou pas de chemin, retourner le chemin tel quel
        if (!user || !path) return path;

        // Normaliser le chemin (supprimer les slashes au début/fin)
        const normalizedPath = path.startsWith('/') ? path.substring(1) : path;

        // Si c'est une route qui ne nécessite pas de préfixe, retourner le chemin tel quel
        if (!shouldAddPrefix(`/${normalizedPath}`)) return `/${normalizedPath}`;

        // Construire le chemin avec préfixe
        const rolePrefix = ROLE_PREFIXES[user.role as UserRole] || '';

        // Si la page est la racine, retourner simplement le préfixe
        if (normalizedPath === '' || normalizedPath === '/') {
            return `/${rolePrefix}`;
        }

        return `/${rolePrefix}/${normalizedPath}`;
    };

    /**
     * Navigue vers une route en tenant compte du rôle
     */
    const navigateTo = (path: string, options: NavigationOptions = {}) => {
        const roleBasedPath = buildRoleBasedPath(path);

        // Si on doit préserver les query params actuels
        if (options.preserveQuery) {
            const currentQuery = router.query;
            // Fusion des query params actuels avec les nouveaux
            options.query = {
                ...(currentQuery as Record<string, string | number | boolean | string[]>),
                ...options.query
            };
        }

        if (options.query) {
            router.push({
                pathname: roleBasedPath,
                query: options.query
            }, undefined, { shallow: options.shallow });
        } else {
            router.push(roleBasedPath, undefined, { shallow: options.shallow });
        }
    };

    /**
     * Extrait le chemin sans le préfixe de rôle
     */
    const getPathWithoutRolePrefix = (path: string = router.asPath): string => {
        const normalizedPath = path.split('?')[0]; // Ignorer les paramètres de requête

        for (const prefix of Object.values(ROLE_PREFIXES)) {
            if (normalizedPath.startsWith(`/${prefix}/`)) {
                return normalizedPath.substring(prefix.length + 2); // +2 pour les deux slashes
            } else if (normalizedPath === `/${prefix}`) {
                // Cas spécial pour la racine d'un préfixe (ex: /admin, /collaborator)
                return '/';
            }
        }

        return normalizedPath;
    };

    /**
     * Vérifie si le chemin actuel correspond à un chemin donné (sans préfixe de rôle)
     */
    const isCurrentPath = (path: string): boolean => {
        const currentPathWithoutPrefix = getPathWithoutRolePrefix();
        const normalizedPath = path.startsWith('/') ? path : `/${path}`;

        return currentPathWithoutPrefix === normalizedPath;
    };

    return {
        navigateTo,
        buildRoleBasedPath,
        isCurrentPath,
        getPathWithoutRolePrefix,
    };
};