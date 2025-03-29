"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./profile.module.css"; 
import { FaEdit, FaChessPawn } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { FcApproval, FcAlarmClock, FcFlashOn, FcBullish, FcRating } from "react-icons/fc";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import {getSocket} from "../../../utils/sockets"; 


/*const token = localStorage.getItem("authToken");
const socket = getSocket(token);*/
export default function Profile() {
    console.log("Llego a la pagina de login")
    const [token, setToken] = useState(null);
    const [socket, setSocket] = useState(null);
    const [user, setUser] = useState(null);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [showConfirm, setShowConfirm] = useState(false);

  // Cargar usuario desde localStorage solo una vez
  
  useEffect(() => {
      if (typeof window !== 'undefined') {
        // Asegurarse de que estamos en el navegador
        const storedToken = localStorage.getItem("authToken");
        setToken(storedToken);
        
        // Crear la conexión del socket solo cuando el token esté disponible
        const socketInstance = getSocket();
        setSocket(socketInstance);
  
        // Conectar el socket solo si no está conectado
        socketInstance.connect();
  
        return () => {
          console.log("🔕 Manteniendo el socket activo al cambiar de pantalla...");
          //socketInstance.disconnect(); // Cerrar la conexión solo si el usuario sale completamente de la aplicación
        };
      }
    }, []);


  // Cargar usuario desde localStorage solo una vez
  useEffect(() => {
      // Verificamos si hay datos en localStorage antes de intentar parsearlos
      const storedUserData = localStorage.getItem("userData");
      console.log("El usuario del perfil es: ", storedUserData);
      if (storedUserData) {
          const parsedUser = JSON.parse(storedUserData);
          setUser(parsedUser.publicUser);
      } else {
          console.log("No se encontraron datos de usuario en localStorage.");
      }
  }, []);
    //const Profile = () => {
    /*const userData = JSON.parse(localStorage.getItem("userData"));
    const user = userData ? userData.publicUser : null;*/
   

   /* useEffect(() => {
        if (!user && router.pathname !== "/") {
            router.replace("/");
        } else {
            setLoading(false);
        }
    }, [user, router]);*/

    const confirmLogout = () => {
        setShowConfirm(true);
    };

    const handleLogout = async () => {
        setShowConfirm(false)
        console.log("Ejecutando handleLogout");
        if (!user) {
            console.log("No hay usuario para cerrar sesión");
            return;
        }

        try {
            console.log("Enviando solicitud de logout al backend");
            console.log("El user es", user.NombreUser);
           // const response = await fetch("http://localhost:3000/logout", {
           const response = await fetch("https://checkmatex-gkfda9h5bfb0gsed.spaincentral-01.azurewebsites.net/logout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ NombreUser: user.NombreUser }),
            });

            console.log("Respuesta del servidor recibida:", response);
            
            localStorage.removeItem("userData");
            localStorage.removeItem("authToken");
            localStorage.removeItem("time");
            console.log("Datos del usuario eliminados de localStorage");
            
            if (!response.ok) {
                console.error("Error al cerrar sesión en el backend");
            } else {
                socket.disconnect();
                router.replace("/");
                console.log("Redirigiendo a la página inicial");
            }
        } catch (error) {
            console.error("Error en la solicitud de logout", error);
        }
    };

    /*if (loading) {
        return <p className={styles.loadingText}>Cargando perfil...</p>;
    }

    if (!user) {
        return <p className={styles.redirectText}>Redirigiendo...</p>;
    }*/


    const generateRandomScoreData = () => {
        return Array.from({ length: 10 }, (_, i) => ({
            name: `J${i + 1}`,
            score: Math.floor(Math.random() * (1500 - 1000) + 1000),
        }));
    };

    const gameModes = [
        { icon: <FaChessPawn className={styles.scoreIcon} style={{ color: "#552003" }} />, name: "Clásica", data: generateRandomScoreData() },
        { icon: <FcApproval className={styles.scoreIcon} />, name: "Principiante", data: generateRandomScoreData() },
        { icon: <FcAlarmClock className={styles.scoreIcon} />, name: "Avanzado", data: generateRandomScoreData() },
        { icon: <FcFlashOn className={styles.scoreIcon} />, name: "Relámpago", data: generateRandomScoreData() },
        { icon: <FcBullish className={styles.scoreIcon} />, name: "Incremento", data: generateRandomScoreData() },
        { icon: <FcRating className={styles.scoreIcon} />, name: "Incremento Exprés", data: generateRandomScoreData() },
    ];

    const matchHistory = [
        { id: 1, mode: "Clásica", whitePlayer: "Jugador123", blackPlayer: "JugadorX", result: "win", moves: 22, date: "6 mar 2025" },
        { id: 2, mode: "Principiante", whitePlayer: "JugadorY", blackPlayer: "Jugador123", result: "lose", moves: 12, date: "17 feb 2025" },
        { id: 3, mode: "Relámpago", whitePlayer: "Jugador123", blackPlayer: "JugadorZ", result: "win", moves: 12, date: "12 feb 2025" },
        { id: 4, mode: "Incremento", whitePlayer: "JugadorA", blackPlayer: "Jugador123", result: "lose", moves: 42, date: "31 ene 2025" },
        { id: 5, mode: "Avanzado", whitePlayer: "Jugador123", blackPlayer: "JugadorB", result: "win", moves: 32, date: "4 sept 2024" },
    ];

    return (
        <div className={styles.profileContainer}>
            <div className={styles.profileCard}>
                <button className={styles.editButton}>
                    <FaEdit className={styles.editIcon} /> Editar
                </button>

                <div className={styles.profileHeader}>
                    <div className={styles.profilePhoto}>
                        <p>FOTO</p>
                    </div>

                    <div className={styles.profileDetails}>
                    <h2 className={styles.profileName}>{user?.NombreUser || "No disponible"}</h2>
                    <div className={styles.profileInfo}>
                            <div className={styles.infoColumn}>
                                <p><strong>Amigos:</strong> 0</p>
                                <p><strong>Partidas Jugadas:</strong> 0</p>
                            </div>
                            <div className={styles.infoColumn}>
                                <p><strong>Porcentaje de Victoria:</strong> 0%</p>
                                <p><strong>Máxima Racha:</strong> 0</p>
                            </div>
                        </div>
                    </div>
                </div>

                <button className={styles.logoutButton} onClick={confirmLogout} title="Cerrar sesión">
                    <FiLogOut className={styles.logoutIcon} />
                </button>
            </div>
            {showConfirm && (
                <div className={styles.confirmOverlay}>
                    <div className={styles.confirmBox}>
                        <p className={styles.confirmText}>¿Estás seguro de que quieres cerrar sesión?</p>
                        <div className={styles.confirmButtons}>
                            <button className={styles.confirmYes} onClick={handleLogout}>Sí</button>
                            <button className={styles.confirmNo} onClick={() => setShowConfirm(false)}>No</button>
                        </div>
                    </div>
                </div>
            )}

            <div className={styles.scoresContainer}>
                {gameModes.map((mode, index) => (
                    <div key={index} className={styles.scoreBox}>
                        {mode.icon}
                        <p>{mode.name}</p>
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
                                    <div className={styles.playerRow}>
                                        <span className={`${styles.colorIndicator} ${styles.whitePiece}`}></span>
                                        <span>{match.whitePlayer}</span>
                                    </div>
                                    <div className={styles.playerRow}>
                                        <span className={`${styles.colorIndicator} ${styles.blackPiece}`}></span>
                                        <span>{match.blackPlayer}</span>
                                    </div>
                                </td>
                                <td className={styles.result}>
                                    {match.result === "win" ? "✅" : "❌"}
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
    //};
}
