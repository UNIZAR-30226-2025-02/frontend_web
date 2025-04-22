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
    const [editing, setEditing] = useState(false);
    const [newNombreUser, setNewNombreUser] = useState("");
    const [newFotoPerfil, setNewFotoPerfil] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [ultimasPartidas, setUltimasPartidas] = useState([]);
    const [partidasClasica, setPartidasClasica] = useState([]);
    const [partidasPrincipiante, setPartidasPrincipiante] = useState([]);
    const [partidasAvanzado, setPartidasAvanzado] = useState([]);
    const [partidasRelampago, setPartidasRelampago] = useState([]);
    const [partidasIncremento, setPartidasIncremento] = useState([]);
    const [partidasExpres, setPartidasExpres] = useState([]);



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
  /*useEffect(() => {
      // Verificamos si hay datos en localStorage antes de intentar parsearlos
      const storedUserData = localStorage.getItem("userData");
      console.log("El usuario del perfil es: ", storedUserData);
      if (storedUserData) {
          const parsedUser = JSON.parse(storedUserData);
          setUser(parsedUser.publicUser);
      } else {
          console.log("No se encontraron datos de usuario en localStorage.");
      }
  }, []);*/
   
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
            const response = await fetch(`https://checkmatex-gkfda9h5bfb0gsed.spaincentral-01.azurewebsites.net/getUserInfo?id=${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                console.error("Error al obtener info del usuario");
                return;
            }

            const data = await response.json();
            setUser(data); // ya te devuelve publicUser directamente
            localStorage.setItem("userData", JSON.stringify({ publicUser: data }));

        } catch (error) {
            console.error("Error en fetchUserInfo:", error);
        }
    };

    fetchUserInfo();
}, []);


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

    const handleEditProfile = async () => {
        setErrorMsg("");
    
        if (newNombreUser.length < 4 || newFotoPerfil.length < 4) {
            setErrorMsg("Nombre y Foto deben tener al menos 4 caracteres.");
            return;
        }
    
        try {
            const response = await fetch("https://checkmatex-gkfda9h5bfb0gsed.spaincentral-01.azurewebsites.net/editUser", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: user.id,
                    NombreUser: newNombreUser,
                    FotoPerfil: newFotoPerfil,
                }),
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                setErrorMsg(data.error || "Error al editar usuario");
                return;
            }
    
            // Actualizamos el usuario en estado y localStorage
            setUser(data.publicUser);
            localStorage.setItem("userData", JSON.stringify({ publicUser: data.publicUser }));
            window.location.reload();
            setEditing(false);
        } catch (err) {
            console.error("Error al editar usuario:", err);
            setErrorMsg("Error al conectar con el servidor");
        }
    };
    
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
            console.log("🗳️Las ultimas partidas son: ", data);
            setUltimasPartidas(data);
          } catch (error) {
            console.error("Error en fetchUltimasPartidas:", error);
          }
        };
      
        fetchUltimasPartidas();

        const fetchUltimasPartidasPorModo = async () => {
            if (!user?.id) return;
        
            try {
              const modos = ["Punt_10", "Punt_5", "Punt_3", "Punt_5_10", "Punt_3_2", "Punt_30"];
        
              // Hacemos las peticiones en paralelo con Promise.all
              const respuestas = await Promise.all(
                modos.map((modo) =>
                  fetch(`https://checkmatex-gkfda9h5bfb0gsed.spaincentral-01.azurewebsites.net/buscarUlt5PartidasDeUsuarioPorModo?id=${user.id}&modo=${modo}`)
                )
              );
        
              // Comprobamos si alguna falló
              if (respuestas.some((res) => !res.ok)) {
                console.error("Error al obtener partidas por modo");
                return;
              }
        
              // Obtenemos los JSON de todas las respuestas
              const [partidasPunt_10, partidasPunt_5, partidasPunt_3, partidasPunt_5_10, partidasPunt_3_2, partidasPunt_30] = await Promise.all(
                respuestas.map((res) => res.json())
              );
        
              // Aquí puedes guardar cada set de partidas en un estado distinto
              setPartidasClasica(partidasPunt_10);
              setPartidasPrincipiante(partidasPunt_30);
              setPartidasAvanzado(partidasPunt_5);
              setPartidasRelampago(partidasPunt_3);
              setPartidasIncremento(partidasPunt_5_10);
              setPartidasExpres(partidasPunt_3_2);
        
            } catch (error) {
              console.error("Error en fetchUltimasPartidasPorModo:", error);
            }
          };
        
          fetchUltimasPartidasPorModo();

      }, [user]);
      

    const generateRandomScoreData = () => {
        return Array.from({ length: 10 }, (_, i) => ({
            name: `J${i + 1}`,
            score: Math.floor(Math.random() * (1500 - 1000) + 1000),
        }));
    };

      const modoMapeado = {
        "Clásica": "Punt_10",
        "Principiante": "Punt_30",
        "Avanzado": "Punt_5",
        "Relámpago": "Punt_3",
        "Incremento": "Punt_5_10",
        "Incremento exprés": "Punt_3_2"
      };
      const modoMapeadoReverse = Object.fromEntries(
        Object.entries(modoMapeado).map(([front, back]) => [back, front])
      );
      
      const iconsByMode = {
        "Clásica": <FaChessPawn className={styles.scoreIcon} style={{ color: "#552003" }} />,
        "Principiante": <FcApproval className={styles.scoreIcon} />,
        "Avanzado": <FcAlarmClock className={styles.scoreIcon} />,
        "Relámpago": <FcFlashOn className={styles.scoreIcon} />,
        "Incremento": <FcBullish className={styles.scoreIcon} />,
        "Incremento exprés": <FcRating className={styles.scoreIcon} />,
      };

    const extraerNombres = (pgn) => {
      if (!pgn) {
        return { nombreBlancas: "Desconocido", nombreNegras: "Desconocido" };
      }
      const regexWhiteAlias = /\[White Alias "(.*?)"\]/;
      const regexBlackAlias = /\[Black Alias "(.*?)"\]/;

      const nombreBlancas = pgn.match(regexWhiteAlias)?.[1] || "Desconocido";
      const nombreNegras = pgn.match(regexBlackAlias)?.[1] || "Desconocido";

      return { nombreBlancas, nombreNegras };
    };
      
      const extraerElo = (pgn, userId) => {
        if (!pgn) {
            return { miElo: 1000, rivalElo: 0 };
          }
        const regexWhite = /\[White "(.*?)"\]/;
        const regexWhiteElo = /\[White Elo "(.*?)"\]/;
        const regexBlack = /\[Black "(.*?)"\]/;
        const regexBlackElo = /\[Black Elo "(.*?)"\]/;
        const regexWhiteAlias = /\[White Alias "(.*?)"\]/;
        const regexBlackAlias = /\[Black Alias "(.*?)"\]/;

        const nombreBlancas = pgn.match(regexWhiteAlias)?.[1] || "Desconocido";
        const nombreNegras = pgn.match(regexBlackAlias)?.[1] || "Desconocido";

        const whiteId = pgn.match(regexWhite)?.[1];
        const whiteElo = Math.round(parseFloat(pgn.match(regexWhiteElo)?.[1] || 0));
      
        const blackId = pgn.match(regexBlack)?.[1];
        const blackElo = Math.round(parseFloat(pgn.match(regexBlackElo)?.[1] || 0));
      
        const esBlancas = userId === whiteId;
      
        return {
          miElo: esBlancas ? whiteElo : blackElo,
          rivalElo: esBlancas ? blackElo : whiteElo
        };
      };
      
      const modosUnicos = Object.keys(modoMapeado);

      const partidasPorModo = {
        Punt_10: partidasClasica,
        Punt_30: partidasPrincipiante,
        Punt_5: partidasAvanzado,
        Punt_3: partidasRelampago,
        Punt_5_10: partidasIncremento,
        Punt_3_2: partidasExpres
      };
      
      const gameModes = modosUnicos.map((modoFront) => {
        const modoBack = modoMapeado[modoFront];
        
        const partidasModo = partidasPorModo[modoBack] || [];
        
        const data = partidasModo.map((p, index) => {
            const { miElo } = extraerElo(p.PGN, user.id);
            return {
            name: `P${index + 1}`,
            score: miElo
            };
        });
        
        return {
            icon: iconsByMode[modoFront],
            name: modoFront,
            data: data.length > 0
            ? data
            : Array.from({ length: 5 }, (_, i) => ({
                name: `P${i + 1}`,
                score: 1000
                }))
        };
        });      


    const imagenesDisponibles = Array.from({ length: 33 }, (_, i) => `/fotosPerfilWebp/avatar_${i + 1}.webp`);
    return (
        <div className={styles.profileContainer}>
            <div className={styles.profileCard}>
            <button className={styles.editButton} onClick={() => {
                setEditing(true);
                setNewNombreUser(user?.NombreUser || "");
                setNewFotoPerfil(user?.FotoPerfil || "");
            }}>
                <FaEdit className={styles.editIcon} /> Editar
            </button>

                <div className={styles.profileHeader}>
                <div className={styles.profilePhoto}>
                    {editing ? (
                        <img src={`/fotosPerfilWebp/${newFotoPerfil}`} alt="Preview" className={styles.profileImage} />
                    ) : (
                        user?.FotoPerfil ? (
                            <img src={`/fotosPerfilWebp/${user.FotoPerfil}`} alt="Foto de perfil" className={styles.profileImage} />
                        ) : (
                        <p>FOTO</p>
                        )
                    )}
                    </div>

                    <div className={styles.profileDetails}>
                    <h2 className={styles.profileName}>{user?.NombreUser || "No disponible"}</h2>
                    <div className={styles.profileInfo}>
                            <div className={styles.infoColumn}>
                                <p><strong>Amigos:</strong> {user?.amistades?.length ?? 0}</p>
                                <p><strong>Partidas Jugadas:</strong> {user?.totalGames ?? "No disponible"}</p>
                            </div>
                            <div className={styles.infoColumn}>
                                <p><strong>Porcentaje de Victoria: </strong> 
                                    {user?.totalGames && user?.totalWins 
                                        ? `${((user.totalWins / user.totalGames) * 100).toFixed(0)}%` 
                                        : "No disponible"}
                                </p>
                                <p><strong>Máxima Racha:</strong> {user?.maxStreak ?? "No disponible"}</p>
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
            {editing && (
                <div className={styles.confirmOverlay}>
                    <div className={styles.editProfileBox}>
                        <h3>Editar Perfil</h3>
                        <label>
                            Nombre de Usuario:
                            <input 
                                type="text" 
                                value={newNombreUser} 
                                onChange={(e) => setNewNombreUser(e.target.value)} 
                            />
                        </label>

                        <label>Selecciona tu nueva foto de perfil:</label>
                        <div className={styles.avatarGallery}>
                            {imagenesDisponibles.map((url, index) => (
                                <img 
                                    key={index}
                                    src={url}
                                    alt={`Avatar ${index + 1}`}
                                    className={`${styles.avatarOption} ${newFotoPerfil === url ? styles.avatarSelected : ""}`}
                                    onClick={() => {
                                        const fileName = url.split("/").pop(); // obtiene solo el nombre del archivo
                                        setNewFotoPerfil(fileName);
                                      }}
                                      
                                />
                            ))}
                        </div>

                        {errorMsg && <p className={styles.editError}>{errorMsg}</p>}
                        <div className={styles.editButtons}>
                            <button className={styles.saveEditBtn} onClick={handleEditProfile}>Guardar</button>
                            <button className={styles.cancelEditBtn} onClick={() => setEditing(false)}>Cancelar</button>
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
                    <LineChart data={mode.data.slice().reverse()}>
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
                        {ultimasPartidas.map((match, index) => {
                            const { nombreBlancas, nombreNegras } = extraerNombres(match.PGN);
                            return (
                                <tr key={index}>
                                    <td className={styles.modeIcon} title={modoMapeadoReverse[match.Modo]}>
                                        {iconsByMode[modoMapeadoReverse[match.Modo]]}
                                    </td>
                                    <td className={styles.playersContainer}>
                                        <div className={`${styles.playerRow} ${nombreBlancas === user?.NombreUser ? styles.highlightedPlayer : ''}`}>
                                            <span className={`${styles.colorIndicator} ${styles.whitePiece}`}></span>
                                            <span>{nombreBlancas}</span>
                                        </div>
                                        <div className={`${styles.playerRow} ${nombreNegras === user?.NombreUser ? styles.highlightedPlayer : ''}`}>
                                            <span className={`${styles.colorIndicator} ${styles.blackPiece}`}></span>
                                            <span>{nombreNegras}</span>
                                        </div>
                                    </td>
                                    <td className={styles.result}>
                                        {match.Ganador === null ? '🤝' : match.Ganador === user.id ? '✅' : '❌'}
                                    </td>
                                    <td>{match.movimientos}</td>
                                    <td>{new Date(match.created_at).toLocaleDateString()}</td>
                                    <td><button className={styles.watchButton}>Ver Partida</button></td>
                                </tr>
                            );
                        })}
                    </tbody>

                </table>
            </div>
        </div>
    );
    //};
}
