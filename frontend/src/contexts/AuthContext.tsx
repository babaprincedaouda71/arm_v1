// src/contexts/AuthContext.tsx
import {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {AUTH_URLS, USERS_URLS} from "@/config/urls";

// Liste des routes publiques
const PUBLIC_ROUTES = [
    '/signin',
    '/forgot-password',
    '/account-creation',
    '/account-creation/first-step',
    '/account-creation/general-infos',
    '/account-creation/setting-password',
    '/account-creation/activation-email',
    'setting-user-password',
    '/public/attendance/scan/[token]',
    '/public/f4-evaluation/scan/[token]',
];

export enum UserRole {
    Admin = "Admin",
    User = "User",
    Collaborateur = "Collaborateur",
    Manager = "Manager",
    Formateur = "Formateur",
}

export interface User {
    id: number;
    managerId: number;
    firstName: string;
    lastName: string;
    email: string;
    gender: string;
    address: string;
    birthDate: string;
    phoneNumber: string;
    cin: string;
    companyId: number;
    username: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; data?: any; error?: string }>;
    logout: () => Promise<void>;
    fetchUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({children}: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Vérifie si la route actuelle est publique
    const isPublicRoute = PUBLIC_ROUTES.includes(router.pathname);

    // Fonction pour récupérer le profil utilisateur
    const fetchUserProfile = async () => {
        try {
            const response = await fetch(USERS_URLS.fetchProfile, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const userData: User = await response.json();
                setUser(userData);
            } else if (response.status === 401) {
                // Token expiré ou invalide
                setUser(null);
                // Redirection vers signin avec la page actuelle en paramètre
                const currentPath = router.asPath;
                await router.push(`/signin?redirect=${encodeURIComponent(currentPath)}`);
            } else {
                setUser(null);
                throw new Error('Failed to fetch user profile');
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    // Fonction de connexion
    const login = async (email: string, password: string) => {
        try {
            const response = await fetch(AUTH_URLS.login, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({email, password}),
            });

            if (response.ok) {
                const data = await response.json();
                await fetchUserProfile();

                // Rediriger vers la page d'origine si spécifiée
                const {redirect} = router.query;
                if (redirect && typeof redirect === 'string') {
                    router.push(decodeURIComponent(redirect));
                } else {
                    router.push('/'); // Page par défaut si pas de redirection spécifiée
                }

                return {success: true, data};
            } else {
                const errorData = await response.json();
                return {success: false, error: errorData.message || 'Email ou mot de passe incorrect'};
            }
        } catch (error) {
            console.error('Login error:', error);
            return {success: false, error: 'Une erreur s\'est produite lors de la connexion'};
        }
    };

    // Fonction de déconnexion
    const logout = async () => {
        try {
            await fetch(AUTH_URLS.logout, {
                method: 'POST',
                credentials: 'include',
            });

            setUser(null);
            router.push('/signin'); // Rediriger vers la page de connexion après déconnexion
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    // Vérifier l'authentification au chargement de l'application
    useEffect(() => {
        if (!isPublicRoute) {
            fetchUserProfile();
        } else {
            // Sur les routes publiques, définissez simplement loading à false
            setLoading(false);
        }
    }, [router.pathname]); // Réexécuter si le chemin change

    // Exposer les fonctions et états du contexte
    const value: AuthContextType = {
        user,
        loading,
        login,
        logout,
        fetchUserProfile, // Utile pour rafraîchir les données utilisateur
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personnalisé pour utiliser le contexte
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    // Fonction pour vérifier si l'utilisateur a un rôle spécifique
    const hasRole = (requiredRole: UserRole) => {
        return context.user?.role === requiredRole;
    };

    return {
        ...context,
        hasRole, // Exposer la fonction hasRole
    };
};