"use client";

import styles from './initial.module.css';
import Link from "next/link";
import io from 'socket.io-client';  // Importar cliente de socket.io
import { useState, useEffect} from "react"; // Importar useState para manejar estado 
import { FcSearch, FcRating, FcFlashOn, FcAlarmClock, FcApproval, FcBullish } from "react-icons/fc";
import { FaChessPawn, FaFire } from "react-icons/fa";
import { IoIosInformationCircleOutline } from "react-icons/io";

export default function InitialPage() {
    const [user, setUser] = useState(null);
    const [searching, setSearching] = useState(false);
    const [socket, setSocket] = useState(null);


    // Cargar usuario desde localStorage solo una vez
    useEffect(() => {
        // Conectamos al servidor de sockets (ajusta la URL según tu configuración)
        const socketConnection = io("http://localhost:3000"); // Ajusta según tu servidor
        setSocket(socketConnection);

        const userData = JSON.parse(localStorage.getItem("userData"));
        setUser(userData);

        return () => {
            socketConnection.close(); // Cerrar la conexión cuando el componente se desmonte
        };
    }, []);
    console.log("Usuario desde localStorage:", user);

    // Función para buscar partida
    const handleSearchGame = async () => {
        if (!socket) return; // Asegurarse de que el socket esté conectado

        setSearching(true);
        console.log("Voy a lanzar evento");

        // Emitir el evento 'find-game' con los datos del usuario
        socket.emit('find-game', { username: user?.NombreUser || 'Invitado' });
        console.log("Lo he lanzado");

        // Escuchar la respuesta del servidor
        socket.on('game-found', (data) => {
            setSearching(false);
            console.log("Estoy buscando partida", user.NombreUser);

            if (data.partidaEncontrada) {
                console.log("he encontrado partida", user.NombreUser);
                window.location.href = "/comun/game"; // Redirigir a la partida
            } else {
                alert("Aún no se ha encontrado un oponente. Inténtalo en un momento.");
            }
        });
    };

    // Descripciones de los modos de juego
    const descriptions = {
        "Clásica": "Modo tradicional de ajedrez. Cada jugador consta de 10 min para realizar sus movimientos.",
        "Principiante": "Ideal para quienes están aprendiendo. Cada jugador consta de 30 min para realizar sus movimientos.",
        "Avanzado": "Para jugadores experimentados. Cada jugador consta de 5 min para realizar sus movimientos.",
        "Relámpago": "Modo para expertos. El tiempo es muy limitado, cada jugador cuenta con 3 minutos.",
        "Incremento": "El tiempo aumenta 10 seg con cada jugada, partiendo de 15 min iniciales.",
        "Incremento exprés": "Versión rápida del incremento. Partiendo de 3 + 2 seg por jugada."
    };

    const icons = {
        "Clásica": <FaChessPawn className={styles.icon} style={{ color: '#552003' }} />,
        "Principiante": <FcApproval className={styles.icon} />,
        "Avanzado": <FcAlarmClock className={styles.icon} />,
        "Relámpago": <FcFlashOn className={styles.icon} />,
        "Incremento": <FcBullish className={styles.icon} />,
        "Incremento exprés": <FcRating className={styles.icon} />
    };

    return (
        <div className={styles.container}>
            {/* 🔹 Mostrar nombre del usuario (solo si el usuario ha iniciado sesión) */}
            {user ? (
                <div className={styles.welcomeMessage}>
                    {/* Log para verificar si el nombre del usuario está presente */}
                    {console.log("Nombre del usuario:", user.NombreUser)}
                    <h2>Bienvenido, {user.NombreUser}!</h2>
                </div>
            ) : (
                <div className={styles.welcomeMessage}>
                    <h2>Bienvenido, invitado!</h2>
                </div>
            )}

            {/* 🔹 Racha (Solo si el usuario ha iniciado sesión) */}
            <div className={styles.containerPartidas}>
                {user && (
                    <div className={styles.cardRacha}>
                        <div className={styles.racha}>
                            <FaFire className={styles.shield} style={{ color: '#ff8000' }} />
                            <span className={styles.text}>Tu racha</span>
                            <span className={styles.rachaCount}>{user.maxStreak || 0}</span>
                            <div className={styles.checks}>
                                ✅ ✅ ✅ ✅ ❌
                            </div>
                        </div>
                    </div>
                )}

                {['Clásica', 'Principiante', 'Avanzado', 'Relámpago', 'Incremento', 'Incremento exprés'].map((mode, index) => (
                    <div key={index} className={styles.card}>
                        <div className={styles.mode}>
                            {/* Icono */}
                            {icons[mode]}
                            <span className={styles.text}>{mode}</span>

                            {/* Icono de información */}
                            <div className={styles.iconoInfo}>
                                <IoIosInformationCircleOutline className={styles.iconoInfo} />

                                {/* Descripción de la ventana emergente */}
                                <div
                                    className={`${styles.infoPopup}`}
                                    style={{
                                        top: '100%',  // Esto coloca el popup justo debajo del icono
                                        left: '0',    // Ajusta la posición según sea necesario
                                    }}
                                >
                                    <h3 className={styles.title}>{mode}:</h3> {/* Título */}
                                    <p className={styles.description}>{descriptions[mode]}</p> {/* Descripción */}
                                </div>
                            </div>

                            <span className={styles.time}>
                                {index === 0 ? '10 min' : index === 1 ? '30 min' : index === 2 ? '5 min' : index === 3 ? '3 min' : index === 4 ? '15min + 10seg' : '3min + 2seg'}
                            </span>
                            <button className={styles.playButton}>Jugar</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Buscar Partida */}
            <button className={styles.searchButton} onClick={handleSearchGame} disabled={searching}>
                {searching ? "Buscando..." : <><FcSearch className={styles.iconSearch} /> Buscar Partida</>}
            </button>
        </div>
    );
}
