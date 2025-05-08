"use client"

import styles from './friend.module.css';
import { useState, useEffect } from 'react';
import { FcConferenceCall } from "react-icons/fc";
import { FaUserPlus, FaUserMinus, FaChessKnight } from "react-icons/fa";
import {getSocket} from "../../../utils/sockets"; 
import {
    FcApproval, FcAlarmClock, FcFlashOn, FcBullish, FcRating
} from "react-icons/fc";
import { FaChessPawn } from "react-icons/fa";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;



export default function FriendPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [socket, setSocket] = useState(null);
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [friends, setFriends] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedRival, setSelectedRival] = useState(null);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [showPreview, setShowPreview] = useState(null);
    const [showPreviewAdd, setShowPreviewAdd] = useState(null);
    const [selectedMode, setSelectedMode] = useState("Clásica");


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
        const currentUser = parsedUser.publicUser;
        
        setUser(currentUser);

        const fetchFriends = async () => {
            const userId = parsedUser?.publicUser?.id;
            console.log("Mi id es: ", userId);
            try {
                const response = await fetch(`${BACKEND_URL}/buscarAmigos?id=${userId}`, {
                    method: "GET",
                    headers: {
                            "Content-Type": "application/json",
                        },
                });
                const data = await response.json();
                if (!response.ok) {
                    throw new Error("No se pudieron cargar los amigos");
                }
                setFriends(data);
            } catch (error) {
                console.error("Error al obtener amigos:", error);
            }
        };
        fetchFriends();
    } else {
        console.log("No se encontraron datos de usuario en localStorage.");
    }
  }, []);

  useEffect(() => {
    if (user) {
        if (!user) {
          console.log("❌ No hay usuario aún. Esperando...");
          return;
        }
    
        console.log("🟢 Usuario detectado:", user);
    
        if (!socket) {
            console.error("❌ ERROR: socket no está definido.");
            return;
        }
        socket.on("friendRequestAccepted", (data) => {
            console.log("Solicitud de amistad aceptada:", data);
            window.location.reload();
        });

        socket.on("friendRemoved", (data) => {
            console.log("Amigo eliminado:", data);
            window.location.reload();
        });

        socket.on("errorMessage", (data) => {
            console.log("❌❌Error: ", data);
        });

        return () => {
            socket.off("friendRequestAccepted");
            socket.off("friendRemoved");
        }; 
    }
}, [user]);

useEffect(() => {
    const fetchSuggestions = async () => {
        if (!searchTerm) {
            setSuggestions([]);  // limpiar si no busca nada
            return;
        }

        try {
            const response = await fetch(`${BACKEND_URL}/buscarUsuarioPorUser?NombreUser=${searchTerm}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "No se pudieron cargar sugerencias");
            }

            // Filtrar para no mostrar a uno mismo ni a amigos
            const filtered = data.filter(u =>
                u.id !== user.id &&                   // excluirse a uno mismo
                (!Array.isArray(friends) || !friends.find(f => f.amigoId === u.id)) // excluir amigos
            );

            setSuggestions(filtered);

        } catch (error) {
            console.error("Error al buscar sugerencias:", error);
        }
    };

    fetchSuggestions();

}, [searchTerm, user, friends]);  // dependencias necesarias

    const filteredFriends = Array.isArray(friends)
    ? friends.filter(user =>
        user.nombreAmigo.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : [];


    const filteredSuggestions = suggestions.filter(user =>
        user.NombreUser.toLowerCase().includes(searchTerm.toLowerCase())
    );


    const handleAddFriend = () => {
        console.log("💩 Voy a agregar al amigo", selectedFriend.id);
        if (socket && user) {
            socket.emit("add-friend", {
                idJugador: user.id,
                idAmigo: selectedFriend.id,
            });
        }
        setShowPreviewAdd(false);
        setSelectedFriend(null);
    };

    const handleRemoveFriend = () => {
        console.log("💩 Voy a eliminar al amigo", selectedFriend.amigoId);
        if (socket && user) {
            socket.emit("remove-friend", {
                idJugador: user.id,
                idAmigo : selectedFriend.amigoId,
            });
        }
        setShowPreview(false);
        setSelectedFriend(null);
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    };

    const handleRemoveFriendPreview = (rival) => {
        console.log("🧙‍♂️ El amigo seleccionado para eliminar es: ", rival);
        setSelectedFriend(rival);
        setShowPreview(true);
    };

    const handleAddFriendPreview = (rival) => {
        console.log("🧙‍♂️ El usuario seleccionado para añadir es: ", rival);
        setSelectedFriend(rival);
        setShowPreviewAdd(true);
    };

    const handleChallenge = (rival) => {
        setSelectedRival(rival);
        setShowModal(true);
    };

    const confirmChallenge = () => {
        console.log("🧙‍♂️ El rival seleccionado para una partida es: ", selectedRival, "de: ", modoMapeado[selectedMode]);
        if (socket && user && selectedRival) {
            socket.emit("challenge-friend", {
                idRetador: user.id,
                idRetado: selectedRival.amigoId,
                modo: modoMapeado[selectedMode],
            });
        }
        localStorage.setItem("tipoPartida", modoMapeado[selectedMode]); // Guardar el tipo de partida en localStorage
        setShowModal(false);
        setSelectedRival(null);
        setSelectedMode("Punt_10");
    };
    
    
    const cancelElimination = () => {
        setShowPreview(false);
        setSelectedFriend(null);
    };

    const cancelSolicitud = () => {
        setShowPreviewAdd(false);
        setSelectedFriend(null);
    };

    const cancelChallenge = () => {
        setShowModal(false);
        setSelectedRival(null);
    };
    
    const modoMapeado = {
        "Rápida": "Punt_10",
        "Clásica": "Punt_30",
        "Blitz": "Punt_5",
        "Bullet": "Punt_3",
        "Incremento": "Punt_5_10",
        "Incremento exprés": "Punt_3_2"
    };
    
    const icons = {
        "Rápida": <FaChessPawn className={styles.icon} style={{ color: '#552003' }} />,
        "Clásica": <FcApproval className={styles.icon} />,
        "Blitz": <FcAlarmClock className={styles.icon} />,
        "Bullet": <FcFlashOn className={styles.icon} />,
        "Incremento": <FcBullish className={styles.icon} />,
        "Incremento exprés": <FcRating className={styles.icon} />
    };

    const modosDeJuego = Object.keys(modoMapeado);

    return (
        <div className={styles.container}>
            <div className={styles.contanierMedidas}>
                <div className={styles.tituloPagina}>
                    <FcConferenceCall className={styles.iconGeneral} />
                    <h2>Social</h2>
                </div>

                <div className={styles.contanierOscuro}>
                    <div className={styles.searchBar}>
                        <input
                            type="text"
                            placeholder="Buscar amigos..."
                            className={styles.searchInput}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {filteredFriends.length > 0 && (
                        <div className={styles.section}>
                            <h3>Amigos</h3>
                            {filteredFriends.map(user => (
                                <div key={user.amigoId} className={styles.userCard}>
                                    <div className={styles.userInfo}>
                                        <div className={styles.photo}>
                                                <img
                                                src={`/fotosPerfilWebp/${user.fotoAmigo}` || "/torre_azul.webp"}
                                                onError={(e) => { e.currentTarget.src = "/torre_azul.webp"; }}
                                                alt={user.nombreAmigo}
                                                className={styles.image}
                                            /></div>
                                        <span>{user.nombreAmigo}</span>
                                    </div>
                                    <div className={styles.actions}>
                                        <FaChessKnight
                                            className={styles.iconActionCaballo}
                                            title="Desafiar a partida"
                                            onClick={() => handleChallenge(user)}
                                        />
                                        <FaUserMinus
                                            className={styles.iconActionNoAmigo}
                                            title="Eliminar amigo"
                                            onClick={() => handleRemoveFriendPreview(user)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {searchTerm && filteredSuggestions.length > 0 && (
                        <div className={styles.section}>
                            <h3>Sugerencias</h3>
                            {filteredSuggestions.map(user => (
                                <div key={user.id} className={styles.userCard}>
                                    <div className={styles.userInfo}>
                                        <div className={styles.photo}>
                                            <img
                                            src={user.FotoPerfil ? `/fotosPerfilWebp/${user.FotoPerfil}` : "/torre_azul.webp"}
                                            onError={(e) => { e.currentTarget.src = "/torre_azul.webp"; }}
                                            alt={user.NombreUser}
                                            className={styles.image}
                                        /></div>
                                        <span>{user.NombreUser}</span>
                                    </div>
                                    <div className={styles.actions}>
                                        <FaUserPlus
                                            className={styles.iconActionNewAmigo}
                                            title="Agregar amigo"
                                            onClick={() => handleAddFriendPreview(user)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {showModal && selectedRival && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modal}>
                            <p>Selecciona el modo de juego para retar a <strong>{selectedRival.nombreAmigo}</strong>:</p>

                            <div className={styles.modeSelector}>
                                {modosDeJuego.map((modo) => (
                                    <button
                                        key={modo}
                                        className={`${styles.modeButton} ${selectedMode === modo ? styles.activeMode : ''}`}
                                        onClick={() => setSelectedMode(modo)}
                                    >
                                        {icons[modo]} {modo}
                                    </button>
                                ))}
                            </div>

                            <div className={styles.modalButtons}>
                                <button onClick={confirmChallenge} className={styles.btnConfirm}>Retar</button>
                                <button onClick={cancelChallenge} className={styles.btnCancel}>Cancelar</button>
                            </div>
                        </div>
                    </div>
                )}

                {showPreview && selectedFriend && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modal}>
                            <p>Estas seguro de que quieres eliminar de amigos a <strong>{selectedFriend.nombreAmigo}</strong>?</p>
                            <div className={styles.modalButtons}>
                                <button onClick={handleRemoveFriend} className={styles.btnConfirm}>Eliminar</button>
                                <button onClick={cancelElimination} className={styles.btnCancel}>Cancelar</button>
                            </div>
                        </div>
                    </div>
                )}

                {showPreviewAdd && selectedFriend && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modal}>
                            <p>Quieres enviar solicitud de amistad a <strong>{selectedFriend.NombreUser}</strong>?</p>
                            <div className={styles.modalButtons}>
                                <button onClick={handleAddFriend} className={styles.btnConfirm}>Enviar</button>
                                <button onClick={cancelSolicitud} className={styles.btnCancel}>Cancelar</button>
                            </div>
                        </div>
                    </div>
                )}


            </div>
        </div>
    );
}
