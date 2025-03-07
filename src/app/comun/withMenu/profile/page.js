"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../../../components/AuthContext";
import { useRouter } from "next/navigation";
import styles from "./profile.module.css"; 
import { FaEdit, FaChessPawn } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { FcApproval, FcAlarmClock, FcFlashOn, FcBullish, FcRating } from "react-icons/fc";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const Profile = () => {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user && router.pathname !== "/comun/withMenu/initial") {
            router.push("/comun/withMenu/initial");
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

    // 🔹 Datos de puntuación en los últimos juegos (ficticios, pueden ser dinámicos)
    const generateRandomScoreData = () => {
        return Array.from({ length: 10 }, (_, i) => ({
            name: `J${i + 1}`,
            score: Math.floor(Math.random() * (1500 - 1000) + 1000),
        }));
    };

    // 🔹 Modos de juego con datos de puntuación
    const gameModes = [
        { icon: <FaChessPawn className={styles.scoreIcon} style={{ color: "#552003" }} />, name: "Clásica", data: generateRandomScoreData() },
        { icon: <FcApproval className={styles.scoreIcon} />, name: "Principiante", data: generateRandomScoreData() },
        { icon: <FcAlarmClock className={styles.scoreIcon} />, name: "Avanzado", data: generateRandomScoreData() },
        { icon: <FcFlashOn className={styles.scoreIcon} />, name: "Relámpago", data: generateRandomScoreData() },
        { icon: <FcBullish className={styles.scoreIcon} />, name: "Incremento", data: generateRandomScoreData() },
        { icon: <FcRating className={styles.scoreIcon} />, name: "Incremento Exprés", data: generateRandomScoreData() },
    ];

    // 🔹 Historial de partidas con datos ficticios
    const matchHistory = [
        { id: 1, mode: "Clásica", whitePlayer: "Jugador123", blackPlayer: "JugadorX", result: "win", moves: 22, date: "6 mar 2025" },
        { id: 2, mode: "Principiante", whitePlayer: "JugadorY", blackPlayer: "Jugador123", result: "lose", moves: 12, date: "17 feb 2025" },
        { id: 3, mode: "Relámpago", whitePlayer: "Jugador123", blackPlayer: "JugadorZ", result: "win", moves: 12, date: "12 feb 2025" },
        { id: 4, mode: "Incremento", whitePlayer: "JugadorA", blackPlayer: "Jugador123", result: "lose", moves: 42, date: "31 ene 2025" },
        { id: 5, mode: "Avanzado", whitePlayer: "Jugador123", blackPlayer: "JugadorB", result: "win", moves: 32, date: "4 sept 2024" },
    ];
    

    return (
        <div className={styles.profileContainer}>
            {/* 🔹 CONTENEDOR 1 - INFORMACIÓN DEL PERFIL */}
            <div className={styles.profileCard}>
                <button className={styles.editButton}>
                    <FaEdit className={styles.editIcon} /> Editar
                </button>

                <div className={styles.profileHeader}>
                    <div className={styles.profilePhoto}>
                        <p>FOTO</p>
                    </div>

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

                <button className={styles.logoutButton} onClick={logout} title="Cerrar sesión">
                    <FiLogOut className={styles.logoutIcon} />
                </button>
            </div>

            {/* 🔹 CONTENEDOR 2 - PUNTUACIONES POR MODO DE JUEGO CON SCROLL HORIZONTAL */}
            <div className={styles.scoresContainer}>
                {gameModes.map((mode, index) => (
                    <div key={index} className={styles.scoreBox}>
                        {mode.icon}
                        <p>{mode.name}</p>

                        {/* 🔹 Gráfica de puntuación */}
                        <div className={styles.chartContainer}>
                            <ResponsiveContainer width="100%" height={100}>
                                <LineChart data={mode.data}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" hide />
                                    <YAxis hide />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="score" stroke="#00aaff" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                ))}
            </div>

            {/* 🔹 CONTENEDOR 3 - HISTORIAL DE PARTIDAS */}
            <div className={styles.historyContainer}>
                <h3>Historial de Partidas</h3>
                <table className={styles.historyTable}>
                    <thead>
                        <tr>
                            <th>Modo</th>
                            <th>Jugadores</th>
                            <th>Resultado</th>
                            <th>Movimientos</th>
                            <th>Fecha</th>
                            <th>Resumen</th>
                        </tr>
                    </thead>
                    <tbody>
                        {matchHistory.map((match) => (
                            <tr key={match.id}>
                                <td className={styles.modeIcon}>
                                    {gameModes.find(m => m.name === match.mode)?.icon}
                                </td>
                                <td className={styles.playersContainer}>
                                    {/* 🔹 Jugador con blancas (arriba) */}
                                    <div className={styles.playerRow}>
                                        <span className={`${styles.colorIndicator} ${styles.whitePiece}`}></span>
                                        <span>{match.whitePlayer}</span>
                                    </div>
                                    {/* 🔹 Jugador con negras (abajo) */}
                                    <div className={styles.playerRow}>
                                        <span className={`${styles.colorIndicator} ${styles.blackPiece}`}></span>
                                        <span>{match.blackPlayer}</span>
                                    </div>
                                </td>

                                <td className={styles.result}>
                                    {match.result === "win" ? (
                                        <span className={styles.win} title="Victoria">✅</span>
                                    ) : (
                                        <span className={styles.lose} title="Derrota">❌</span>
                                    )}
                                </td>
                                <td>{match.moves}</td>
                                <td>{match.date}</td>
                                <td><button className={styles.watchButton}>Ver Partida</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Profile;
