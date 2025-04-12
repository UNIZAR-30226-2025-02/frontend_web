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

// Simulación de datos
const allUsers = [
    { id: 1, name: "Dani04", isFriend: true },
    { id: 2, name: "Dani0456", isFriend: false },
    { id: 3, name: "Dani0481", isFriend: false },
    { id: 4, name: "Ana01", isFriend: true },
];

export default function FriendPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [socket, setSocket] = useState(null);
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [friends, setFriends] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedRival, setSelectedRival] = useState(null);
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
                const response = await fetch(`https://checkmatex-gkfda9h5bfb0gsed.spaincentral-01.azurewebsites.net/buscarAmigos?id=${userId}`, {
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

 /* useEffect(() => {
    if (user) {
        

        
    }
}, [user]);*/
useEffect(() => {
    const fetchSuggestions = async () => {
        if (!searchTerm) {
            setSuggestions([]);  // limpiar si no busca nada
            return;
        }

        try {
            const response = await fetch(`https://checkmatex-gkfda9h5bfb0gsed.spaincentral-01.azurewebsites.net/buscarUsuarioPorUser?NombreUser=${searchTerm}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "No se pudieron cargar sugerencias");
            }

            // Filtrar para no mostrar a uno mismo ni a amigos
            const filtered = data.filter(u =>
                u.id !== user.id && !friends.find(f => f.id === u.id)
            );

            setSuggestions(filtered);

        } catch (error) {
            console.error("Error al buscar sugerencias:", error);
        }
    };

    fetchSuggestions();

}, [searchTerm, user, friends]);  // dependencias necesarias


  // Pedir amigos y usuarios al backend una vez tengamos el user
  /*useEffect(() => {
    if (socket && user) {
        socket.emit("getFriendsAndUsers", { idJugador: user.id });

        socket.on("friendsAndUsers", (data) => {
            setFriends(data.friends);
            setSuggestions(data.users);
        });

        return () => {
            socket.off("friendsAndUsers");
        };
    }
}, [socket, user]);*/

    const filteredFriends = friends.filter(user =>
        user.nombreAmigo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredSuggestions = suggestions.filter(user =>
        user.NombreUser.toLowerCase().includes(searchTerm.toLowerCase())
    );


    const handleAddFriend = (idAmigo) => {
        if (socket && user) {
            socket.emit("add-friend", {
                idJugador: user.id,
                idAmigo,
            });
        }
    };

    const handleRemoveFriend = (idAmigo) => {
        if (socket && user) {
            socket.emit("remove-friend", {
                idJugador: user.id,
                idAmigo,
            });
        }
    };

    const handleChallenge = (rival) => {
        setSelectedRival(rival);
        setShowModal(true);
    };

    const confirmChallenge = () => {
        if (socket && user && selectedRival) {
            socket.emit("challenge-friend", {
                idRetador: user.id,
                idRetado: selectedRival.id,
                modo: modoMapeado[selectedMode],
            });
        }
        setShowModal(false);
        setSelectedRival(null);
        setSelectedMode("Punt_10");
    };
    

    const cancelChallenge = () => {
        setShowModal(false);
        setSelectedRival(null);
    };
    
    const modoMapeado = {
        "Clásica": "Punt_10",
        "Principiante": "Punt_30",
        "Avanzado": "Punt_5",
        "Relámpago": "Punt_3",
        "Incremento": "Punt_5_10",
        "Incremento exprés": "Punt_3_2"
    };
    
    const icons = {
        "Clásica": <FaChessPawn className={styles.icon} style={{ color: '#552003' }} />,
        "Principiante": <FcApproval className={styles.icon} />,
        "Avanzado": <FcAlarmClock className={styles.icon} />,
        "Relámpago": <FcFlashOn className={styles.icon} />,
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
                                <div key={user.id} className={styles.userCard}>
                                    <div className={styles.userInfo}>
                                        <div className={styles.photo}>
                                                <img
                                                src={`/fotosPerfilWebp/${user.fotoAmigo}` || "/default-avatar.png"}
                                                alt={user.nombreAmigo}
                                                className={styles.image}
                                            /></div>
                                        <span>{user.nombreAmigo}</span>
                                    </div>
                                    <div className={styles.actions}>
                                        <FaChessKnight
                                            className={styles.iconActionCaballo}
                                            title="Desafiar a partida"
                                            onClick={() => handleChallenge(user.id)}
                                        />
                                        <FaUserMinus
                                            className={styles.iconActionNoAmigo}
                                            title="Eliminar amigo"
                                            onClick={() => handleRemoveFriend(user.id)}
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
                                            src={`/fotosPerfilWebp/${user.FotoPerfil}` || "/default-avatar.png"}
                                            alt={user.NombreUser}
                                            className={styles.image}
                                        /></div>
                                        <span>{user.NombreUser}</span>
                                    </div>
                                    <div className={styles.actions}>
                                        <FaChessKnight
                                            className={styles.iconActionCaballo}
                                            title="Desafiar a partida"
                                            onClick={() => handleChallenge(user)}
                                        />
                                        <FaUserPlus
                                            className={styles.iconActionNewAmigo}
                                            title="Agregar amigo"
                                            onClick={() => handleAddFriend(user.id)}
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
                            <p>Selecciona el modo de juego para retar a <strong>{selectedRival.name}</strong>:</p>

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


            </div>
        </div>
    );
}
