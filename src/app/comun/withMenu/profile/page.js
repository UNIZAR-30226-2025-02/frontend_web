"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./profile.module.css"; 
import { FaEdit, FaChessPawn } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { FcApproval, FcAlarmClock, FcFlashOn, FcBullish, FcRating } from "react-icons/fc";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import {getSocket} from "../../../utils/sockets"; 

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;


export default function Profile() {
    //console.log("Llego a la pagina de login")
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
          //console.log("🔕 Manteniendo el socket activo al cambiar de pantalla...");
          //socketInstance.disconnect(); // Cerrar la conexión solo si el usuario sale completamente de la aplicación
        };
      }
    }, []);

   
  //Obtengo los datos del usuario y los actualizo en loscalStorage
  useEffect(() => {
    const fetchUserInfo = async () => {
        const storedUserData = localStorage.getItem("userData");

        if (!storedUserData) {
            //console.log("No hay userData en localStorage");
            return;
        }

        const parsedUser = JSON.parse(storedUserData);
        const userId = parsedUser?.publicUser?.id;

        if (!userId) {
            //console.log("No se encontró el id del usuario");
            return;
        }

        try {
            const response = await fetch(`${BACKEND_URL}/getUserInfo?id=${userId}`, {
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
        //console.log("Ejecutando handleLogout");
        if (!user) {
            //console.log("No hay usuario para cerrar sesión");
            return;
        }

        try {
            //console.log("Enviando solicitud de logout al backend");
            //console.log("El user es", user.NombreUser);
           // const response = await fetch("http://localhost:3000/logout", {
           const response = await fetch(`${BACKEND_URL}/logout`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ NombreUser: user.NombreUser }),
            });

            //console.log("Respuesta del servidor recibida:", response);
            
            localStorage.removeItem("userData");
            localStorage.removeItem("authToken");
            localStorage.removeItem("time");
            localStorage.clear();
            //console.log("Datos del usuario eliminados de localStorage");
            
            if (!response.ok) {
                console.error("Error al cerrar sesión en el backend");
            } else {
                socket.disconnect();
                router.replace("/");
                //console.log("Redirigiendo a la página inicial");
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
            const response = await fetch(`${BACKEND_URL}/editUser`, {
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
            const response = await fetch(`${BACKEND_URL}/buscarUlt10PartidasDeUsuario?id=${user.id}`);
            if (!response.ok) {
              console.error("Error al obtener las últimas partidas");
              return;
            }
            const data = await response.json();
            //console.log("🗳️Las ultimas partidas son: ", data);
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
                  fetch(`${BACKEND_URL}/buscarUlt5PartidasDeUsuarioPorModo?id=${user.id}&modo=${modo}`)
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
        "Rápida": "Punt_10",
        "Clásica": "Punt_30",
        "Blitz": "Punt_5",
        "Bullet": "Punt_3",
        "Incremento": "Punt_5_10",
        "Incremento Exprés": "Punt_3_2"
      };
      const modoMapeadoReverse = Object.fromEntries(
        Object.entries(modoMapeado).map(([front, back]) => [back, front])
      );
      
      const iconsByMode = {
        "Rápida": <FaChessPawn className={styles.scoreIcon} style={{ color: "#552003" }} />,
        "Clásica": <FcApproval className={styles.scoreIcon} />,
        "Blitz": <FcAlarmClock className={styles.scoreIcon} />,
        "Bullet": <FcFlashOn className={styles.scoreIcon} />,
        "Incremento": <FcBullish className={styles.scoreIcon} />,
        "Incremento Exprés": <FcRating className={styles.scoreIcon} />,
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
      
    const extraerElo = (pgn, userId, match) => {
        if (!pgn) {
          return { miElo: 1000, rivalElo: 0 };
        }
      
        const getTag = (tag) => {
          const matchResult = pgn.match(new RegExp(`\\[${tag} "(.*?)"\\]`));
          return matchResult?.[1] || "";
        };
      
        const whiteId = getTag("White");
        const blackId = getTag("Black");
        const whiteAlias = getTag("White Alias");
        const blackAlias = getTag("Black Alias");
      
        const whiteElo = Math.round(parseFloat(getTag("White Elo") || 0));
        const blackElo = Math.round(parseFloat(getTag("Black Elo") || 0));
      
        const esBlancas = [whiteId, whiteAlias].includes(userId);
      
        const miEloBase = esBlancas ? whiteElo : blackElo;
        const variacion = esBlancas ? match?.Variacion_JW : match?.Variacion_JB;
        
        const miElo = miEloBase + (parseFloat(variacion) || 0);
        const rivalElo = esBlancas ? blackElo : whiteElo;
      
        //console.log("Mi Elo es: ", miElo);
        return {
          miElo: Math.round(miElo),
          rivalElo
        };
      };
      
      const extraerVariacion = (userId, match) => {
        if (!userId || !match) return 0;
        //console.log("El jugador blancas es: ", match.JugadorB);
        const esBlancas = match.JugadorB === userId;
        const variacion = esBlancas ? match.Variacion_JB : match.Variacion_JW;
      
        return Math.round(parseFloat(variacion) || 0);
      };
      
      const contarJugadas = (pgn) => {
        if (!pgn) return 0;
        const partes = pgn.split("\n\n");
        const movimientosRaw = partes[1]?.trim();
        if (!movimientosRaw) return 0;
        const regexTurnos = /\d+\./g;
        const turnos = movimientosRaw.match(regexTurnos);
        return turnos ? turnos.length : 0;
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
        
        let data = partidasModo.map((p, index) => {
            const { miElo } = extraerElo(p.PGN, user.id, p);
            return {
            name: `P${index + 1}`,
            score: miElo
            };
        });
        
            // Si solo hay una partida, agregamos un punto inicial con score 1000, ya que se inicia en 1000 puntos
            if (data.length >= 1 && data.length <= 4) {
                data = [
                    ...data,
                { name: "P0", score: 1000 }
                ];
            }

        return {
            icon: iconsByMode[modoFront],
            name: modoFront,
            data: data.length > 0
            ? data
            : [{ name: "P1", score: 1000 }]
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
                    <p className={styles.profileCorreo}><em>({user?.Correo || "No disponible"})</em></p> 
                    <div className={styles.profileInfo}>
                            <div className={styles.infoColumn}>
                                <p><strong>Amigos:</strong> {user?.Amistades ?? 0}</p>
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
                            <th>Jugadas</th>
                            <th>Fecha</th>
                            <th>Resumen</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ultimasPartidas.map((match, index) => {
                            const { nombreBlancas, nombreNegras } = extraerNombres(match.PGN);
                            const whiteElo = match.PGN.match(/\[White Elo "(.*?)"\]/)?.[1];
                            const blackElo = match.PGN.match(/\[Black Elo "(.*?)"\]/)?.[1];
                            const finalWhiteElo = Math.round((parseFloat(whiteElo) || 0));
                            const finalBlackElo = Math.round((parseFloat(blackElo) || 0));
                            return (
                                <tr key={index}>
                                    <td className={styles.modeIcon} title={modoMapeadoReverse[match.Modo]}>
                                        {iconsByMode[modoMapeadoReverse[match.Modo]]}
                                    </td>
                                    <td className={styles.playersContainer}>
                                        <div className={`${styles.playerRow} ${nombreBlancas === user?.NombreUser ? styles.highlightedPlayer : ''}`}>
                                            <span className={`${styles.colorIndicator} ${styles.whitePiece}`}></span>
                                            <span>{nombreBlancas} ({finalWhiteElo})</span>
                                        </div>
                                        <div className={`${styles.playerRow} ${nombreNegras === user?.NombreUser ? styles.highlightedPlayer : ''}`}>
                                            <span className={`${styles.colorIndicator} ${styles.blackPiece}`}></span>
                                            <span>{nombreNegras} ({finalBlackElo})</span>
                                        </div>
                                    </td>
                                    <td className={styles.result}>
                                        {match.Ganador === null ? '🤝' : match.Ganador === user.id ? '✅' : '❌'}
                                        {" "}
                                        <span className={styles.variacionPunt}>
                                            ({extraerVariacion(user.id, match) >= 0 ? "+" : ""}
                                            {extraerVariacion(user.id, match)})
                                        </span>
                                    </td>
                                    <td>{contarJugadas(match.PGN)}</td>
                                    <td>{new Date(match.created_at).toLocaleDateString()}</td>
                                    <td><button className={styles.watchButton} 
                                        onClick={() => {
                                            localStorage.setItem("partidaParaRevisar", JSON.stringify({PGN: match.PGN}));
                                            router.push("/comun/withMenu/review");
                                        }}><strong>Ver Partida</strong>
                                        </button></td>
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
