"use client";

import { useState, useEffect, useRef} from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import styles from "./game.module.css";
import io from 'socket.io-client';  // Importar cliente de socket.
import {getSocket} from "../../utils/sockets"; 
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import usePreventExit from "../../components/usePreventExit"; // Importar el hook



export default function Game() {
  const [game, setGame] = useState("");
  const [user, setUser] = useState(null);
  const [rival, setRival] = useState(null);
  const [fen, setFen] = useState(""); // Posición actual del tablero
  let [turn, setTurn] = useState("w"); // Controla el turno
  let colorTurn;
  const [whiteTime, setWhiteTime] = useState(600); // Tiempo en segundos
  const [blackTime, setBlackTime] = useState(600);
  const [miElo, setMiElo] = useState(null);
  const [nuevoInicio, setNuevoInicio] = useState(null);
  const [eloRival, setEloRival] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [winner, setWinner] = useState(null);
  const [loser, setLoser] = useState(null);
  const [tablas, setTablas] = useState(null);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [legalMoves, setLegalMoves] = useState([]);
  const [drawOfferReceived, setDrawOfferReceived] = useState(false);
  const [confirmDraw, setConfirmDraw] = useState(false);
  const [confirmResign, setConfirmResign] = useState(false);
  const [pendingPromotion, setPendingPromotion] = useState(null);
  const [showPromotionPopup, setShowPromotionPopup] = useState(false);
  const [partidaAcabada, setPartidaAcabada] = useState(false);
  let piezaLlega = null;
  let piezaElejida = null;
  const [idPartida, setIdPartida] = useState(null); // Color asignado al 
  const [playerColor, setPlayerColor] = useState(null); // Color asignado al 
  const [tiempoPartida, setTiempoPartida] = useState(null); // Color asignado al
  const [tipoPartida, setTipoPartida] = useState(null); // Color asignado al  
  const [fotoContrincante, setFotoContrincante] = useState(null); // Color asignado al  
  const [searching, setSearching] = useState(false);
  const gameCopy = useRef(new Chess()); // Referencia única del juego
  const [token, setToken] = useState(null);
  const [socket, setSocket] = useState(null);
  const router = useRouter();
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
    }, [idPartida]);

  // Actualiza el valor de gameRef siempre que 'game' cambie
  useEffect(() => {
    const pgn = localStorage.getItem("pgn");
    setNuevoInicio(true);

    if (pgn) {
      const success = gameCopy.current.loadPgn(pgn);
      if (success) {
        console.log("♻️ PGN cargado correctamente:", gameCopy.current.fen());
      } else {
        console.warn("⚠️ No se pudo cargar el PGN. Usando posición inicial.");
      }
      localStorage.removeItem("pgn");
    } else {
      console.log("🔰 No hay PGN, usando juego nuevo.");
    }
    setFen(gameCopy.current.fen()); // Iniciar con el FEN correcto
    setTurn(gameCopy.current.turn());
    
  }, []);

  usePreventExit({
    onConfirm: () => {
      if (socket) {
        console.log("🚪 Salida confirmada. Enviando resign y redirigiendo...");
       // socket.emit("resign", { idPartida, idJugador: user.id });
      }
    
     /* setTimeout(() => {
        router.replace('/comun/withMenu/initial');
      }, 50); // Pequeño delay para estabilizar navegación*/
    }
      
  });

  useEffect(() => {
    console.log("🔄 Buscando usuario en localStorage...");
    const storedUserData = localStorage.getItem("userData");
    const color = localStorage.getItem("colorJug");
    const tipoPartidaLocal = localStorage.getItem("tipoPartida");
    console.log("El tipode partida es: ", tipoPartidaLocal);
    const nombreRival = localStorage.getItem("nombreRival");
    const eloRival = localStorage.getItem("eloRival");
    const eloJug = localStorage.getItem("eloJug");
    const tiempoBlancas = localStorage.getItem("timeW");
    const tiempoNegras = localStorage.getItem("timeB");
    const partidaLocalSto = localStorage.getItem("idPartida");
    const fotoRival = localStorage.getItem("fotoRival");
    if (storedUserData) {
      const parsedUser = JSON.parse(storedUserData);
      console.log("✅ Usuario encontrado:", parsedUser, "con elo: ", eloJug, "y el elo del rival:",eloRival);
      setIdPartida(partidaLocalSto);
      setUser(parsedUser.publicUser);
      setPlayerColor(color);
      setRival(nombreRival);
      setMiElo(eloJug);
      setEloRival(eloRival);
      setTipoPartida(tipoPartidaLocal);
      setFotoContrincante(fotoRival);

      if(tiempoBlancas === null){
        if (tipoPartidaLocal === "Punt_10"){
          setTiempoPartida(10);
        } else if(tipoPartidaLocal === "Punt_30"){
          setTiempoPartida(30);
        } else if(tipoPartidaLocal === "Punt_5"){
          setTiempoPartida(5);
        } else if(tipoPartidaLocal === "Punt_3"){
          setTiempoPartida(3);
        } else if(tipoPartidaLocal === "Punt_5_10"){
          setTiempoPartida(10);
        } else if(tipoPartidaLocal === "Punt_3_2"){
          setTiempoPartida(3);
        }
      } else {
        console.log("⬜El tiempo de blancas recuperado es: ", tiempoBlancas);
        setWhiteTime(tiempoBlancas);
        setBlackTime(tiempoNegras);
      }
    } else {
      console.log("⚠️ No se encontraron datos de usuario en localStorage.");
    }
  }, [idPartida, nuevoInicio]);

  useEffect(() => {
    if (tiempoPartida !== null) {
      console.log("⌚La partida que vamos a hacer es de: ", tiempoPartida);
      setBlackTime(60 * tiempoPartida);
      setWhiteTime(60 * tiempoPartida);
    }
  }, [tiempoPartida]); // Este useEffect se ejecuta cada vez que 'tiempoPartida' cambie

  useEffect(() => {
    // Definir el intervalo de restar tiempo
    const interval = setInterval(() => {
      if(partidaAcabada===false){
        if (gameCopy.current.turn()==="w") {
          setWhiteTime((prevTime) => prevTime - 1);
        } else {
          setBlackTime((prevTime) => prevTime - 1);
        }
      }
    }, 1000);

    return () => clearInterval(interval); // Limpiar el intervalo cuando el componente se desmonte
  }, [gameCopy.current.turn(), partidaAcabada]); // Solo se vuelve a ejecutar cuando el turno o el color del jugador cambia


  colorTurn = playerColor === "black" ? "b" : "w";
  useEffect(() => {
      console.log("🔄 useEffect ejecutándose en pantalla de partida...");
  
      if (!user) {
          console.log("❌ No hay usuario aún. Esperando...");
          return;
      }
  
      console.log("🟢 Usuario detectado:", user);
  
      if (!socket) {
          console.error("❌ ERROR: socket no está definido.");
          return;
      }
  
      console.log("🔎 Verificando conexión del socket...");

      if (!socket.connected) {
        console.log("🚀 Intentando conectar al socket en pantalla de partida...");
        socket.connect();
    } else {
        console.log("✅ Socket ya estaba conectado con ID:", socket.id);
    }

    const handleBeforeUnload = (e) => {
      // Realiza la petición al servidor antes de que la página se cierre
      console.log("🚪 Enviando datos de cierre de sesión al servidor...");
      const data = JSON.stringify({ NombreUser: user.NombreUser });
      navigator.sendBeacon("https://checkmatex-gkfda9h5bfb0gsed.spaincentral-01.azurewebsites.net/logout", data);

      // Prevenir la acción por defecto para mostrar el mensaje de advertencia
      e.preventDefault();
      e.returnValue = ''; // Este valor es requerido para activar el mensaje de advertencia en algunos navegadores
    };

    // Escuchar el evento 'beforeunload'
    window.addEventListener('beforeunload', handleBeforeUnload);

  
    // Recibir movimientos del otro jugador
    socket.on('new-move', (data) => {
      console.log("♟️ Movimiento recibido:", data.movimiento);
    
      const moveStr = data.movimiento;
      const isPromotionMove = moveStr.length === 5; // ej: "e7e8q"
    
      const moveConfig = {
        from: moveStr.slice(0, 2), // "e7"
        to: moveStr.slice(2, 4),   // "e8"
      };
    
      if (isPromotionMove) {
        moveConfig.promotion = moveStr[4]; // "q", "r", "n", "b"
      }
    
      const moveResult = gameCopy.current.move(moveConfig);
      
      if (moveResult) {
        if (tipoPartida === "Punt_3_2"){
          if (colorTurn === "b"){
            console.log("⬜Voy a actualizar el tiempo de blanco que recibo su movimiento", whiteTime);
            setWhiteTime((prevTime) => prevTime + 2);
          } else {
            console.log("⬛Voy a actualizar el tiempo de blanco que recibo su movimiento", blackTime);
            setBlackTime((prevTime) => prevTime + 2);
          }
        } else if (tipoPartida === "Punt_5_10"){
          if (colorTurn === "b"){
            console.log("⬜Voy a actualizar el tiempo de blanco que recibo su movimiento", whiteTime);
            setWhiteTime((prevTime) => prevTime + 5);
          } else {
            console.log("⬛Voy a actualizar el tiempo de blanco que recibo su movimiento", blackTime);
            setBlackTime((prevTime) => prevTime + 5);
          }
        }
        setFen(gameCopy.current.fen());
        setTurn(gameCopy.current.turn());
      } else {
        console.error("Movimiento no válido:", moveStr);
      }
    });
    
    socket.on('requestTie', (data) => {
      console.log('📩 Petición de tablas recibida:', data);
      setDrawOfferReceived(true); // Mostrar el modal al jugador
    });

    socket.on('player-surrendered', (data) => {
      setWinner(true)
      console.log('Rival se ha rendido:', data);
    });

    socket.on('gameOver', (data) => {
      localStorage.removeItem("timeW");
      localStorage.removeItem("timeB");
      localStorage.removeItem("idPartida");
      localStorage.removeItem("nombreRival");
      localStorage.removeItem("eloRival");
      localStorage.removeItem("eloJug");
      localStorage.removeItem("tipoPartida");
      localStorage.removeItem("colorJug");
      setPartidaAcabada(true);
      console.log("Llega final de partida", data);
      if(data.winner === "draw"){
        console.log("Tablas");
        setTablas(true)
      }else if(data.winner === user.id){
        setWinner(true)
      } else{
        console.log("Mi id es: ", user.id);
        console.log("Y el data es: ", data);
        setLoser(true);
      }

    });

    socket.on('new-message', (data)=>{
      console.log("♟️ Mensaje recibido:", data.message);

      // Añadir el mensaje recibido al chat
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: data.message, // o data.text si así lo envías
          sender: "rival",
        },
      ]);
      
    })
    
    return () => {
        console.log("🧹 Limpiando eventos de socket en pantalla de partida...");
        //socket.off("color");
        socket.off("new-move");
        socket.off("new-message");
        socket.off("requestTie");
        window.removeEventListener('beforeunload', handleBeforeUnload);

    };
}, [user]); // Se ejecuta solo cuando `user` cambia y está definido.
  
  useEffect(() => {
    if (whiteTime !== null && socket) {
      socket.on('get-game-status', () => {
        console.log('👾 Obteniendo estado de la partida...');
        console.log('Tiempo restante blancas:', whiteTime, 'y este el de negras: ', blackTime);
        console.log('Estado de la partida:', 'ingame');
        localStorage.removeItem("timeW");
        localStorage.removeItem("timeB");
        localStorage.removeItem("idPartida");
        localStorage.removeItem("nombreRival");
        localStorage.removeItem("eloRival");
        localStorage.removeItem("eloJug");
        localStorage.removeItem("tipoPartida");
        localStorage.removeItem("colorJug");
        socket.emit('game-status', { timeLeftW: whiteTime, timeLeftB: blackTime, estadoPartida: 'ingame', gameMode: tipoPartida});
      });
  
      return () => {
        socket.off('get-game-status');
      };
    }
  }, [whiteTime, blackTime, socket]);


  useEffect(()=>{
    console.log("Estos mensajes hay: ", messages);
    return ()=>{};
  }, [messages]);
    
    
    const handleMove = (sourceSquare, targetSquare) => {
        
      console.log("colorTurn es ", colorTurn);
      if (winner) return;
      if (colorTurn !== gameCopy.current.turn()) {
        console.log(`❌ No es tu turno. Te toca jugar con: ${colorTurn}, turno actual: ${gameCopy.current.turn()}`);
        return;
      }
    
      const piece = gameCopy.current.get(sourceSquare);
        // Obtener movimientos legales para la casilla de origen
      const legalMoves = gameCopy.current.moves({ square: sourceSquare, verbose: true });

      // Verificar si el targetSquare está en los movimientos legales
      const isValidMove = legalMoves.some(move => move.to === targetSquare);
      if (!isValidMove) {
          console.log("⚠️ Movimiento no permitido.");
          return;
      }

      const isPawnPromotion = 
          piece && piece.type === "p" &&
          ((piece.color === "w" && targetSquare[1] === "8") || (piece.color === "b" && targetSquare[1] === "1"));
  
      if (isPawnPromotion && !piezaLlega) {
        // Mostrar popup de promoción manualmente (tu modal personalizado)
        //setShowPromotionPopup(true);
        //setPendingPromotion({ from: sourceSquare, to: targetSquare, color: piece.color });
        return;
      }
  
      try {
        const move = gameCopy.current.move({
          from: sourceSquare,
          to: targetSquare,
          promotion: piezaElejida || undefined,
        });
  
        if (move) {
          if (tipoPartida === "Punt_3_2"){
            if (colorTurn === "w"){
              setWhiteTime((prevTime) => prevTime + 2);
            } else {
              setBlackTime((prevTime) => prevTime + 2);
            }
          } else if (tipoPartida === "Punt_5_10"){
            if (colorTurn === "w"){
              setWhiteTime((prevTime) => prevTime + 5);
            } else {
              setBlackTime((prevTime) => prevTime + 5);
            }
          }
          console.log("✔️ Movimiento exitoso:", move);
          //if(tiempoPartida)
          setFen(gameCopy.current.fen());
          setTurn(gameCopy.current.turn());
          setSelectedSquare(null);
          setLegalMoves([]);
          // setPendingPromotion(null);
          //setShowPromotionPopup(false);
  
          const movimiento = move.from + move.to + (move.promotion || "");
          socket.emit("make-move", { 
            movimiento,
            idPartida, 
            idJugador: user.id 
          });
          console.log("✔️ Movimiento enviado:", move, "Con idPartida:", idPartida);

        }
      } catch (error) {
        console.log("⚠️ Movimiento inválido", error);
      }
    };
  
  const handlePromotion = (promotionPiece) => {
      if (!promotionPiece) return;
      console.log("➡️ Seleccionaste:", promotionPiece);
  
      // Normalizamos la pieza
      let pieza = "";
      if (promotionPiece.endsWith("R")) pieza = "r";
      if (promotionPiece.endsWith("Q")) pieza = "q";
      if (promotionPiece.endsWith("B")) pieza = "b";
      if (promotionPiece.endsWith("N")) pieza = "n";
  
      piezaLlega = promotionPiece;
      piezaElejida = pieza;
      
      // Hacemos la jugada pendiente
      if (pendingPromotion) {
        const { from, to } = pendingPromotion;
        //setShowPromotionPopup(false);
        //setPendingPromotion(null);
        handleMove(from, to); // Aquí reintentas con la pieza seleccionada ya seteada
      }
      return true;
  };
    

  const handleSendMessage = () => {
    console.log("📤Voy a enviar un mensaje: ", message);
    const newMessage = {
      text: message,
      sender: "yo", // puedes usar "Blanco"/"Negro" si prefieres
    };
    
    setMessages([...messages, newMessage]);
    
    socket.emit("send-message", {
      message,
      game_id: idPartida,
      user_id: user.id,
    });
    
    setMessage("");
  };

  // Función para formatear el tiempo en mm:ss
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Función para manejar la selección de una pieza
  const handleSquareClick = (square) => {
    if (winner) return; // No permitir selección si el juego terminó

    //const gameCopy = new Chess(game.fen());
    const piece = gameCopy.current.get(square); // Obtener la pieza en la casilla seleccionada
    
     // Verificar si hay una pieza en la casilla y si pertenece al jugador actual
    if (!piece || piece.color !== (playerColor === "white" ? "w" : "b")) {
      console.log("❌ No puedes seleccionar una pieza rival.",  piece);
      return;
    }

    if (selectedSquare === square ) {
      setSelectedSquare(null);
      setLegalMoves([]);
      return;
    }
    
    const moves = gameCopy.current.moves({ square, verbose: true });
    if (moves.length > 0) {
      setSelectedSquare(square);
      setLegalMoves(moves.map(move => move.to));
    }
  };

  
  
  // Función para reiniciar la partida
  const resetGame = (tiempoEnMinutos = 10) => {
    const nuevaPartida = new Chess();
    gameCopy.current = nuevaPartida;
    setGame(nuevaPartida);
    setFen(nuevaPartida.fen());
    setTurn("w");
    setWhiteTime(tiempoEnMinutos * 60);
    setBlackTime(tiempoEnMinutos * 60);
    setWinner(null);
    setLoser(null);
    setTablas(null);
    setMessages([]);
    setMessage("");
    setSelectedSquare(null);
    setLegalMoves([]);
    setPendingPromotion(null);
    setShowPromotionPopup(false);
    setPartidaAcabada(false);
  };
  

  // Función para mover la pieza si se hace clic en una casilla permitida
  const handleMoveClick = (targetSquare) => {
    if (!selectedSquare || !legalMoves.includes(targetSquare)) return;
    const piece = gameCopy.current.get(selectedSquare);
    if (!piece) return;

    // 🔍 Verificar si es promoción de peón
    const isPawnPromotion =
        piece.type === "p" &&
        ((piece.color === "w" && targetSquare[1] === "8") || (piece.color === "b" && targetSquare[1] === "1"));

    if (isPawnPromotion) {
        console.log("♟️ Se requiere promoción.");
        // 🔹 Simular el comportamiento de `onPromotionPieceSelect`
       // const fakePieceData = piece.color + "Q"; // Se usará la pieza correcta luego
        //handlePromotion(fakePieceData);
       // handleMove(selectedSquare, targetSquare); 
        return true;
    }
    handleMove(selectedSquare, targetSquare);
  };

  const handleOfferDraw = () => {
    setConfirmDraw(true); // Mostrar modal de confirmación
  };
  
  const handleResign = () => {
    setConfirmResign(true); // Mostrar modal de confirmación
  };

  const acceptDraw = () => {
    socket.emit('draw-accept', { idPartida, idJugador: user.id });
    setDrawOfferReceived(false);
  };
  
  const declineDraw = () => {
    socket.emit('draw-declined', { idPartida, idJugador: user.id });
    setDrawOfferReceived(false);
  };

  const confirmSendDrawOffer = () => {
    socket.emit("draw-offer", { idPartida, idJugador: user.id });
    setConfirmDraw(false);
  };
  
  const confirmSendResign = () => {
    localStorage.removeItem("time");
    setPartidaAcabada(true);
    socket.emit("resign", { idPartida, idJugador: user.id });
    setConfirmResign(false);
  };
  
  const getMovePairs = () => {
    const history = gameCopy.current.history();
    const moves = [];
  
    for (let i = 0; i < history.length; i += 2) {
      moves.push([history[i], history[i + 1] || ""]);
    }
  
    return moves;
  };
  const handleGoInit = () => {
    console.log("🧠Voy a volver a inicio");
    router.push(`/comun/withMenu/initial`);
  }

  const handleCancelSearch = () => {
    if (!socket || !searching) return;
    socket.emit('cancel-pairing', { idJugador: user?.id });
    setSearching(false);
    console.log("❌ Búsqueda cancelada por el usuario");
  };
  // Función para buscar partida
  const handleSearchOtherGame = async (tipoPartida) => {
    if (!socket) return; // Asegurarse de que el socket esté conectado
    setSearching(true);
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
        //localStorage.setItem("tipoPartida",tipoPartida);
        setWinner(false);
        setLoser(false);
        setTablas(false);
        resetGame(10);
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
        console.log("Mi ide es: ",user.id, "y jugador.id es: ", jugadorActual.id);
        const jugadorRival = data.jugadores.find(jugador => jugador.id !== user.id);
        console.log("Mi ide es: ",user.id, "y mi rival es: ", jugadorRival);
        if (!jugadorActual) {
            console.error("❌ No se encontró al usuario en la lista de jugadores.");
            return;
        }

        setPlayerColor(jugadorActual.color);
        console.log(`✅ Color asignado a ${user.NombreUser}: ${jugadorActual.color}`);
        localStorage.setItem("colorJug",jugadorActual.color);
        console.log("Guardo id rival: ", jugadorRival.id);
        if(jugadorActual.color === "black"){
            localStorage.setItem("eloRival", jugadorRival.eloW);
            localStorage.setItem("nombreRival", jugadorRival.nombreW);
            localStorage.setItem("eloJug", jugadorActual.eloB);
        } else {
            localStorage.setItem("eloRival", jugadorRival.eloB);
            localStorage.setItem("nombreRival", jugadorRival.nombreB);
            localStorage.setItem("eloJug", jugadorActual.eloW);
        }
        idPartidaCopy =  localStorage.getItem("idPartida");
        setIdPartida(idPartidaCopy);
        setPartidaAcabada(false);
        router.push(`/comun/game?id=${idPartidaCopy}`);
        //window.location.href = `/comun/game?id=${idPartidaCopy}`; // recarga limpia
        //router.refresh();
    });
    // Escuchar errores del backend
    socket.on('error', (errorMessage) => {
        setSearching(false);
        console.error("❌ Error al unirse a la partida:", errorMessage);
        alert(`Error: ${errorMessage}`); // Muestra un mensaje al usuario
    });
};
  
  return (
    <div className={styles.gameContainer}>
      {winner && (
        <div className={styles.winnerOverlay}>
        {searching && (
          <h2>Buscando una nueva partida...</h2>
        )}
        {!searching && (
          <h2>¡Has ganado!</h2>
        )}
        {searching && (
          <div className={styles.loader}></div>
        )}
        {!searching && (
          <span className={styles.trophy}>🏆</span>
        )}
        <div className={styles.winnerActions}>
        {searching && (
            <button className={styles.newGameButtonCancel} onClick={handleCancelSearch} title="Cancelar búsqueda">
              Cancelar búsqueda
            </button>)}
          {!searching && (
            <button className={styles.newGameButton} onClick={() => handleSearchOtherGame(tipoPartida)}>
              Buscar otra partida
            </button>)}
          {!searching && (
            <button className={styles.reviewButton} onClick={resetGame}>
            Revisar Partida
            </button>
          ) }
        </div>
        {!searching && (
          <button className={styles.rematchButton} onClick={handleGoInit}>
            Volver Inicio
          </button>
        ) }
      </div>
      )}
      {loser && (
        <div className={styles.winnerOverlay}>
        {searching && (
          <h2>Buscando una nueva partida...</h2>
        )}
        {!searching && (
          <h2>¡Has perdido!</h2>
        )}
        {searching && (
          <div className={styles.loader}></div>
        )}
        {!searching && (
          <span className={styles.trophy}>❌</span>
        )}
        <div className={styles.winnerActions}>
        {searching && (
            <button className={styles.newGameButtonCancel} onClick={handleCancelSearch} title="Cancelar búsqueda">
                Cancelar búsqueda
            </button>)}
          {!searching && (
            <button className={styles.newGameButton} onClick={() => handleSearchOtherGame(tipoPartida)}>
              Buscar otra partida
            </button>)}
          {!searching && (
            <button className={styles.reviewButton} onClick={resetGame}>
            Revisar Partida
            </button>
          ) }
        </div>
        {!searching && (
          <button className={styles.rematchButton} onClick={handleGoInit}>
            Volver Inicio
          </button>
        ) }
      </div>
      )}
      {tablas && (
        <div className={styles.winnerOverlay}>
          {searching && (
            <h2>Buscando una nueva partida...</h2>
          )}
          {!searching && (
            <h2>!Has llegado a tablas!</h2>
          )}
          {searching && (
            <div className={styles.loader}></div>
          )}
          {!searching && (
            <span className={styles.trophy}>🤝</span>
         )}
          <div className={styles.winnerActions}>
          {searching && (
              <button className={styles.newGameButtonCancel} onClick={handleCancelSearch} title="Cancelar búsqueda">
                  Cancelar búsqueda
              </button>)}
            {!searching && (
              <button className={styles.newGameButton} onClick={() => handleSearchOtherGame(tipoPartida)}>
                Buscar otra partida
              </button>)}
            {!searching && (
              <button className={styles.reviewButton} onClick={resetGame}>
              Revisar Partida
              </button>
            ) }
          </div>
          {!searching && (
            <button className={styles.rematchButton} onClick={handleGoInit}>
              Volver Inicio
            </button>
          ) }
        </div>
      )}
      {drawOfferReceived && (
        <div className={styles.winnerOverlay}>
          <h2>Tu rival ha ofrecido tablas</h2>
          <div className={styles.winnerActions}>
            <button onClick={acceptDraw} className={styles.newGameButton}>Aceptar</button>
            <button onClick={declineDraw} className={styles.reviewButton}>Rechazar</button>
        </div>
      </div>
    )}

{confirmDraw && (
  <div className={styles.winnerOverlay}>
    <h2>¿Deseas ofrecer tablas?</h2>
    <div className={styles.winnerActions}>
      <button className={styles.newGameButton} onClick={confirmSendDrawOffer}>Sí</button>
      <button className={styles.reviewButton} onClick={() => setConfirmDraw(false)}>No</button>
    </div>
  </div>
)}

{confirmResign && (
  <div className={styles.winnerOverlay}>
    <h2>¿Estás seguro de que quieres rendirte?</h2>
    <div className={styles.winnerActions}>
      <button className={styles.newGameButton} onClick={confirmSendResign}>Sí</button>
      <button className={styles.reviewButton} onClick={() => setConfirmResign(false)}>No</button>
    </div>
  </div>
)}
      
      <div className={styles.gameBody}>
        {/* Panel de Jugadas */}
        <div className={styles.movesPanel}>
          <h3>Jugadas</h3>
          <div className={styles.movesList}>
            {getMovePairs().map((pair, index) => (
              <div key={index} className={styles.moveRow}>
                <span className={styles.moveNumber}>{index + 1}.</span>
                <span className={styles.whiteMove}>{pair[0]}</span>
                <span className={styles.blackMove}>{pair[1]}</span>
              </div>
            ))}
          </div>
        </div>


        {/* Tablero de Ajedrez */}
              <div className={styles.boardContainer}>
               <div className={`${styles.playerInfoTop} ${gameCopy.current.turn() !== colorTurn ? styles.activePlayer : styles.inactivePlayer}`}>
                 <div className={styles.playerName}>
                 {fotoContrincante ? (
                <img src={`/fotosPerfilWebp/${fotoContrincante}`} alt="Foto de perfil" className={styles.profilePicture} />
                ) : (
                <span className={styles.greenDot}></span> 
                )}
                <span className={styles.userName}>{rival ? rival : "NuevoJugador"}</span> 
                <span className={styles.userElo}>{eloRival ? `(${Math.round(eloRival)})` : "(miElo)"}</span>
                </div>
                 <div className={styles.playerTime}>{"b" === colorTurn ? formatTime(whiteTime) : formatTime(blackTime)}</div>
               </div>
              <Chessboard
                position={fen}
                boardOrientation={playerColor === "white" ? "white" : "black"}
                onSquareClick={(square) => {
              if (legalMoves.includes(square)) {
                handleMoveClick(square);
              } else {
                handleSquareClick(square);
              }
            }}
            customPromotionDialog={true} // <- Desactivas el popup nativo
            onPieceClick={handleSquareClick} // Permite seleccionar la pieza al hacer clic en ella
            onPieceDrop={(sourceSquare, targetSquare) => handleMove(sourceSquare, targetSquare)}
            //onPromotionPieceSelect={(piece) => handlePromotion(piece)}
            //onPromotionPieceSelect={null}
            onPromotionPieceSelect={(piece) =>handlePromotion(piece)} // Usar el popup de promoción de la librería
            customSquareStyles={
              legalMoves.reduce((acc, square) => {
                acc[square] = {
                  backgroundColor: "rgba(98, 189, 255, 0.59)", // Color más visible
                  boxShadow: "0px 0px 5px 3px rgba(98, 189, 255, 0.59) inset", // Añade un efecto más notable
                  borderRadius: "50%" // Se mantiene el borde redondeado
                };
                return acc;
              }, 
              selectedSquare ? { [selectedSquare]: { backgroundColor: "rgba(98, 189, 255, 0.59)" } } : {})
            }
            boardStyle={{ borderRadius: "5px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)" }}
             // Mantiene la opción de arrastrar piezas
            animationDuration={200}
            />
            <div className={`${styles.playerInfoBottom} ${gameCopy.current.turn() === colorTurn ? styles.activePlayer : styles.inactivePlayer}`}>
            
            <div className={styles.playerName}>
            {user?.FotoPerfil ? (
              <img src={`/fotosPerfilWebp/${user?.FotoPerfil}`} alt="Foto de perfil" className={styles.profilePicture} />
            ) : (
              <span className={styles.orangeDot}></span>
            )}
            <span className={styles.userName}>{user ? user.NombreUser : "NuevoJugador"}</span> 
            <span className={styles.userElo}>{miElo ? `(${Math.round(miElo)})` : "(miElo)"}</span>       
            </div>
              <div className={styles.playerTime}>{"w" === colorTurn ? formatTime(whiteTime) : formatTime(blackTime)}</div>
            </div>
  
        </div>

        {/* Panel de Chat */}
              <div className={styles.chatPanel}>
              <div className={styles.inlineButtons}>
              <button className={styles.iconButtonTablas} onClick={handleOfferDraw}  title="Solicitar tablas">🤝</button>
              <button className={styles.iconButtonAbandono} onClick={handleResign} title="Abandonar partida">🏳️</button>
              </div>

              <h3>Chat 💬</h3>
              <div className={styles.chatMessages}>
              {messages.map((msg, index) => (
                <div
                key={index}
                className={msg.sender === "yo" ? styles.messageRowRight : styles.messageRowLeft}
                >
                {msg.sender !== "yo" && (
              <img
                src={`/fotosPerfilWebp/${fotoContrincante}`}
                alt="Foto de perfil del rival"
                className={styles.profilePicture}
              />
                )}
                <div className={msg.sender === "yo" ? styles.whiteMessage : styles.blackMessage}>
              {msg.text}
                </div>
                {msg.sender === "yo" && (
                  <img
                  src={`/fotosPerfilWebp/${user?.FotoPerfil}`}
                  alt="Tu foto de perfil"
                  className={styles.profilePicture}
                  />
                )}
                </div>
              ))}
              </div>
              <div className={styles.chatInputContainer}>
                <input
                type="text"
                placeholder="Escribe un mensaje..."
                className={styles.chatInput}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              //onKeyDown={(e) => handleKeyDown(e)} // Detecta la tecla Enter
            />
            <button className={styles.sendButton} onClick={handleSendMessage}>➤</button>
          </div>
        </div>
      </div>
    </div>
  );
}
