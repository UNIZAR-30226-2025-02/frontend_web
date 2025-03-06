"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../../../components/AuthContext";
import { useRouter } from "next/navigation";
import styles from "./profile.module.css"; // Importar estilos
import { FaEdit } from "react-icons/fa"; // Icono de lápiz para Editar
import { FaChessPawn } from "react-icons/fa6";
import { FcApproval, FcAlarmClock, FcFlashOn, FcBullish, FcRating } from "react-icons/fc";

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

    // 🔹 Lista de modos de juego con iconos
    const gameModes = [
        { icon: <FaChessPawn className={styles.scoreIcon} style={{ color: "#552003" }} />, name: "Clásica", time: "10 min" },
        { icon: <FcApproval className={styles.scoreIcon} />, name: "Principiante", time: "30 min" },
        { icon: <FcAlarmClock className={styles.scoreIcon} />, name: "Avanzado", time: "5 min" },
        { icon: <FcFlashOn className={styles.scoreIcon} />, name: "Relámpago", time: "3 min" },
        { icon: <FcBullish className={styles.scoreIcon} />, name: "Incremento", time: "15min + 10seg" },
        { icon: <FcRating className={styles.scoreIcon} />, name: "Incremento Exprés", time: "3min + 2seg" },
    ];

    return (
        <div className={styles.profileContainer}>
            {/* 🔹 CONTENEDOR 1 - INFORMACIÓN DEL PERFIL */}
            <div className={styles.profileCard}>
                {/* Botón Editar arriba a la derecha */}
                <button className={styles.editButton}>
                    <FaEdit className={styles.editIcon} /> Editar
                </button>

                <div className={styles.profileHeader}>
                    {/* Foto del usuario */}
                    <div className={styles.profilePhoto}>
                        <p>FOTO</p>
                    </div>

                    {/* Contenedor con el nombre y la información en columnas */}
                    <div className={styles.profileDetails}>
                        <h2 className={styles.profileName}>{user.name || "No disponible"}</h2>
                        <div className={styles.profileInfo}>
                            <div className={styles.infoColumn}>
                                <p><strong>Amigos:</strong> {user.friends || 0}</p>
                                <p><strong>Partidas Jugadas:</strong> {user.gamesPlayed || 0}</p>
                            </div>
                            <div className={styles.infoColumn}>
                                <p><strong>Porcentaje de Victoria:</strong> {user.winRate || "0%"}</p>
                                <p><strong>Máxima Racha:</strong> {user.maxStreak || 0}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Botón Cerrar Sesión alineado a la derecha abajo */}
                <button className={styles.logoutButton} onClick={logout}>
                    Cerrar Sesión
                </button>
            </div>

            {/* 🔹 CONTENEDOR 2 - PUNTUACIONES POR MODO DE JUEGO CON SCROLL HORIZONTAL */}
            <div className={styles.scoresContainer}>
                {gameModes.map((mode, index) => (
                    <div key={index} className={styles.scoreBox}>
                        {mode.icon}
                        <p>{mode.name}</p>
                        <p>{mode.time}</p>
                    </div>
                ))}
            </div>

            {/* 🔹 CONTENEDOR 3 - HISTORIAL DE PARTIDAS */}
            <div className={styles.historyContainer}>
                <h3>Historial de partidas</h3>
            </div>
        </div>
    );
};

export default Profile;
