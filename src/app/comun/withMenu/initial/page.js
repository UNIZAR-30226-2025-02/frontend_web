"use client";

import styles from './initial.module.css';
import Link from "next/link";
import io from 'socket.io-client';  // Importar cliente de socket.io
import { useState, useEffect} from "react"; // Importar useState para manejar estado 
import { FcSearch, FcRating, FcFlashOn, FcAlarmClock, FcApproval, FcBullish } from "react-icons/fc";
import { FaChessPawn, FaFire } from "react-icons/fa";
import { IoIosInformationCircleOutline } from "react-icons/io";
import {getSocket} from "../../../utils/sockets"; // Importamos el socket global
import { useRouter } from "next/navigation";

export default function InitialPage() {
    const [user, setUser] = useState(null);
    const [searching, setSearching] = useState(false);
    const router = useRouter();
    const [playerColor, setPlayerColor] = useState(null);
    const [token, setToken] = useState(null);
    const [socket, setSocket] = useState(null);
    const [racha, setRacha] = useState(null);
    const [ultimasPartidas, setUltimasPartidas] = useState([]);

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
        if (typeof window !== 'undefined') {
          const storedUserData = localStorage.getItem("userData");
          if (storedUserData) {
            const parsedUser = JSON.parse(storedUserData);
            setUser(parsedUser.publicUser);
          }
        }
      }, []);

      //Obtengo los datos del usuario y los actualizo en loscalStorage
        useEffect(() => {
            const fetchUserInfo = async () => {
                const storedUserData = localStorage.getItem("userData");
                if (!storedUserData) {
                    console.log("No hay userData en localStorage");
                    return;
                }

                const parsedUser = JSON.parse(storedUserData);
                const userId = parsedUser?.publicUser?.id;

                if (!userId) {
                    console.log("No se encontró el id del usuario");
                    return;
                }

                try {
                    //console.log("Voy a buscar info del usuario con id: ", userId);
                    const response = await fetch(`https://checkmatex-gkfda9h5bfb0gsed.spaincentral-01.azurewebsites.net/getUserInfo?id=${userId}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        console.error("Error al obtener info del usuario: ", data);
                        return;
                    }
                    
                    setUser(data); // ya te devuelve publicUser directamente
                    setRacha(data.actualStreak);
                    localStorage.setItem("userData", JSON.stringify({ publicUser: data }));

                } catch (error) {
                    console.error("Error en fetchUserInfo:", error);
                }
            };

            fetchUserInfo();
        }, [user]);
   
        useEffect(() => {
            const fetchUltimasPartidas = async () => {
              if (!user?.id) return;
          
              try {
                const response = await fetch(`https://checkmatex-gkfda9h5bfb0gsed.spaincentral-01.azurewebsites.net/buscarUlt5PartidasDeUsuario?id=${user.id}`);
                if (!response.ok) {
                  console.error("Error al obtener las últimas partidas");
                  return;
                }
                const data = await response.json();
                setUltimasPartidas(data);
              } catch (error) {
                console.error("Error en fetchUltimasPartidas:", error);
              }
            };
          
            fetchUltimasPartidas();
          }, [user]);
          
    // Función para buscar partida
    const handleSearchGame = async (tipoPartida) => {
        if (!socket) return; // Asegurarse de que el socket esté conectado
        setSearching(true);
        console.log("🔍 Buscando partida cuando el usuario es: ", user);
        const dataToSend = { 
            idJugador: user?.id, 
            mode: tipoPartida
        };
        
        console.log("🔍 Enviando datos:", dataToSend); // Verificar datos antes de enviar
        console.log("Voy a buscar partida del tipo: ", tipoPartida);
        console.log("👤 Usuario antes de enviar:", user);
        console.log("🔍 Enviando datos:", dataToSend);
        socket.emit("find-game", dataToSend);
        console.log("✅ Lo he lanzado");
        let idPartidaCopy;
        // Escuchar la respuesta del servidor
        socket.on('game-ready', (data) => {
            console.log("🟢 Partida encontrada con ID:", data.idPartida);
            setSearching(false);
            console.log("Estoy buscando partida", user.NombreUser);
            console.log("he encontrado partida", user.NombreUser); 
            localStorage.setItem("tipoPartida",tipoPartida);
            idPartidaCopy = data.idPartida; 
          
        });
        console.log("🎧 Ahora escuchando evento 'color'...");
        socket.on("color", (data) => {
            console.log("🎨 Recibido evento 'color' con datos:", data);

            if (!data || !data.jugadores) {
                console.error("❌ No se recibió información válida de colores.");
                return;
            }
            
            const jugadorActual = data.jugadores.find(jugador => jugador.id === user.id);
            console.log("Mi id es: ",user.id, "y jugador.id es: ", jugadorActual.id);
            const jugadorRival = data.jugadores.find(jugador => jugador.id !== user.id);
            console.log("Mi id es: ",user.id, "y mi rival es: ", jugadorRival);
            if (!jugadorActual) {
                console.error("❌ No se encontró al usuario en la lista de jugadores.");
                return;
            }

            setPlayerColor(jugadorActual.color);
            console.log(`✅ Color asignado a ${user.NombreUser}: ${jugadorActual.color}`);
            localStorage.setItem("colorJug",jugadorActual.color);
            console.log("🌈Guardo id rival: ", jugadorRival.id, "Con el eloW: ", jugadorRival.eloW, "y el eloB: ", jugadorRival.eloB);
            if(jugadorActual.color === "black"){
                localStorage.setItem("eloRival", jugadorRival.eloW);
                localStorage.setItem("nombreRival", jugadorRival.nombreW);
                localStorage.setItem("eloJug", jugadorActual.eloB);
                localStorage.setItem("fotoRival", jugadorRival.fotoBlancas);
            } else {
                localStorage.setItem("eloRival", jugadorRival.eloB);
                localStorage.setItem("nombreRival", jugadorRival.nombreB);
                localStorage.setItem("eloJug", jugadorActual.eloW);
                localStorage.setItem("fotoRival", jugadorRival.fotoNegras);
            }
            localStorage.setItem("idPartida", idPartidaCopy);
            router.push(`/comun/game?id=${idPartidaCopy}`);
        });
        
        // Escuchar errores del backend
        socket.on('error', (errorMessage) => {
            setSearching(false);
            console.error("❌ Error al unirse a la partida:", errorMessage);
            alert(`Error: ${errorMessage}`); // Muestra un mensaje al usuario
        });
    };

    const handleCancelSearch = () => {
        if (!socket || !searching) return;
        socket.emit('cancel-pairing', { idJugador: user?.id });
        setSearching(false);
        console.log("❌ Búsqueda cancelada por el usuario");
    };
    

    // Descripciones de los modos de juego
    const descriptions = {
        "Clásica": "Modo tradicional de ajedrez. Cada jugador consta de 10 min para realizar sus movimientos.",
        "Principiante": "Ideal para quienes están aprendiendo. Cada jugador consta de 30 min para realizar sus movimientos.",
        "Avanzado": "Para jugadores experimentados. Cada jugador consta de 5 min para realizar sus movimientos.",
        "Relámpago": "Modo para expertos. El tiempo es muy limitado, cada jugador cuenta con 3 minutos.",
        "Incremento": "El tiempo aumenta 5 seg con cada jugada, partiendo de 10 min iniciales.",
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
                            <div className={styles.textWithCount}>
                                <span className={styles.text}>Tu racha</span>
                                <span className={styles.rachaCount}>{racha || 0}</span>
                            </div>
                        </div>
                        <div className={styles.checks}>  
                                {ultimasPartidas.map((partida, index) => {
                                const victoria = (partida.Ganador === user.id);
                                const derrota = (partida.Ganador !== user.id && partida.Ganador !== null);
                                return (
                                    <span key={index} className={styles.resultIcon}>
                                    {victoria ? '✅' : derrota ? '❌' : '➖'}
                                    </span>
                                );
                                })}
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
                                {index === 0 ? '10 min' : index === 1 ? '30 min' : index === 2 ? '5 min' : index === 3 ? '3 min' : index === 4 ? '10min + 5seg' : '3min + 2seg'}
                            </span>
                            <button
                                className={styles.playButton}
                                onClick={() => handleSearchGame(
                                    index === 0 ? 'Punt_10' :
                                    index === 1 ? 'Punt_30' :
                                    index === 2 ? 'Punt_5' :
                                    index === 3 ? 'Punt_3' :
                                    index === 4 ? 'Punt_5_10' :
                                    'Punt_3_2'
                                )}
                                >
                                Jugar
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Buscar Partida */}
            <div className={styles.searchWrapper}>
                <div className={styles.searchButtonContainer}>
                    <button className={styles.searchButton} onClick={() => handleSearchGame("Punt_10")} >
                        {!searching && <FcSearch className={styles.iconSearch} />}
                        {searching && <div className={styles.loader}></div>}
                        <span className={searching ? styles.hiddenText : ''}>Buscar Partida Clasica</span>
                        <span className={!searching ? styles.hiddenText : ''}>Emparejando...</span>
                    </button>
                </div>
                <div className={styles.botonCancelar}>
                {searching && (
                    <button className={styles.cancelButton} onClick={handleCancelSearch} title="Cancelar búsqueda">
                        ❌
                    </button>
                )}
                </div>
            </div>
        </div>
    );
}
