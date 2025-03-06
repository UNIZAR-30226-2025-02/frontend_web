"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const router = useRouter();

    const login = (username, password) => {
        if (username === "admin" && password === "1234") {
            const fakeUser = {
                id: 1,
                name: "Jugador123",
                username: "admin",
                friends: 10,
                gamesPlayed: 100,
                winRate: "55%",
                maxStreak: 5,
            };
            setUser(fakeUser);
            localStorage.setItem("user", JSON.stringify(fakeUser));
            router.push("/comun/withMenu/profile");
        } else {
            alert("Usuario o contraseña incorrectos");
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        router.push("/auth/login");
    };

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe usarse dentro de un AuthProvider");
    }
    return context;
};
