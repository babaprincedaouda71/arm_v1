import {createContext, ReactNode, useContext, useEffect, useState} from "react";

interface User {
    // Définissez ici la structure de votre objet utilisateur, par exemple :
    id: number;
    companyId: number;
    username: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
    // ... autres propriétés de l'utilisateur
}

interface ProfileContextType {
    user: User | null;
    loading: boolean;
    fetchUser: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

interface ProfileProviderProps {
    children: ReactNode;
}

const URL = "http://localhost:8888";

export const ProfileProvider = ({children}: ProfileProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const response = await fetch(`${URL}/api/auth/userProfile`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                }
            });

            if (!response.ok) {
                setUser(null);
            }
            const userData: User = await response.json();
            setUser(userData);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUser()
    }, []);

    const value: ProfileContextType = {
        user,
        loading,
        fetchUser
    };

    return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export const profileAuth = () => {
    const context = useContext(ProfileContext);
    if (context === undefined)
        throw new Error("No user found.");
    return context;
}