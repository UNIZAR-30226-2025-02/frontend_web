"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../../../components/AuthContext";
import { useRouter } from "next/navigation";
import styles from "./profile.module.css"; // Importar estilos

const Profile = () => {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("User data:", user);
        if (!user) {
            router.push("/auth/login");
        } else {
            setLoading(false);
        }
    }, [user, router]);

    if (loading) {
        return <p className={styles.loadingText}>Cargando perfil...</p>;
    }

    if (!user) {
        return <p className={styles.redirectText}>Redirigiendo...</p>;
    }

    return (
        <div className={styles.profileContainer}>
            <h2 className={styles.profileTitle}>Perfil de Usuario</h2>

            {/* 🔹 Mostrar los datos en una caja bien estilizada */}
            <div className={styles.profileCard}>
                <p><strong>Nombre:</strong> {user.name || "No disponible"}</p>
                <p><strong>Amigos:</strong> {user.friends || 0}</p>
                <p><strong>Partidas Jugadas:</strong> {user.gamesPlayed || 0}</p>
                <p><strong>Porcentaje de Victoria:</strong> {user.winRate || "0%"}</p>
                <p><strong>Máxima Racha:</strong> {user.maxStreak || 0}</p>
            </div>

            <button className={styles.logoutButton} onClick={logout}>
                Cerrar Sesión
            </button>
        </div>
    );
};

export default Profile;
