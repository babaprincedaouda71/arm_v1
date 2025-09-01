// components/ProtectedRoute.tsx
import {ReactNode, useEffect} from 'react';
import {useRouter} from 'next/router';
import {useAuth, UserRole} from '@/contexts/AuthContext';
import LoadingSpinner from "@/components/LoadingSpinner";

interface ProtectedRouteProps {
    children: ReactNode;
    requiredRoles?: UserRole[];
    requiredRole?: UserRole;
    redirectPath?: string; // Nouveau prop pour personnalisation
}

export default function ProtectedRoute({
                                           children,
                                           requiredRoles,
                                           requiredRole,
                                           redirectPath = '/signin' // Valeur par défaut
                                       }: ProtectedRouteProps) {
    const {user, loading} = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (loading) return;

        // Si utilisateur non connecté
        if (!user) {
            const currentPath = router.asPath;
            router.push(`${redirectPath}?redirect=${encodeURIComponent(currentPath)}`);
            return;
        }

        // Si rôles spécifiés
        if (requiredRole || requiredRoles?.length) {
            const userRole = user.role as UserRole;
            const isAuthorized =
                (requiredRole && userRole === requiredRole) ||
                (requiredRoles && requiredRoles.includes(userRole));

            if (!isAuthorized) {
                router.push('/unauthorized');
            }
        }
    }, [loading, user, router, requiredRole, requiredRoles, redirectPath]);

    // Utilise le même LoadingSpinner que AuthProvider
    if (loading) {
        return <LoadingSpinner/>;
    }

    // Ne render que si toutes les conditions sont remplies
    return user ? <>{children}</> : null;
}