import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { type User } from "../types/interfaces"
import { api } from "../api/axios"
import { logoutUser } from "../api/auth";

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    setUser: (user: User | null) => void;
    checkAuth: () => Promise<void>;
    logout:() =>Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const checkAuth = async () => {
        try {
            const response = await api.get("/me"); 
            setUser(response.data.user);
        } catch (error) {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };
    const logout = async () => {
        try {
            await logoutUser()
        }finally {
            setUser(null)
        }
    }

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ user, isLoading, setUser, checkAuth, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};