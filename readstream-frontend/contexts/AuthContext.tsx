"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface User {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    token?: string;
    language?: string;
    history?: any[];
    bookmarks?: any[];
    preferences?: {
        categories?: string[];
        sources?: string[];
        readingTime?: string;
    };
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (userData: any) => void;
    signup: (userData: any) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkUser = async () => {
            const storedUser = localStorage.getItem("user");
            const storedToken = localStorage.getItem("token");

            if (storedUser && storedToken) {
                setUser(JSON.parse(storedUser));
                // Verify token with backend if needed, or just set it
                // For now, simple persistence
            }
            setLoading(false);
        };
        checkUser();
    }, []);

    const login = (data: any) => {
        localStorage.setItem("user", JSON.stringify(data));
        localStorage.setItem("token", data.token);
        setUser(data);
        router.push("/");
    };

    const signup = (data: any) => {
        localStorage.setItem("user", JSON.stringify(data));
        localStorage.setItem("token", data.token);
        setUser(data);
        router.push("/");
    };

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};
