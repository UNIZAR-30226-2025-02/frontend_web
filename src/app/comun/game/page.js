"use client";

import { useState, useEffect, useRef} from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import styles from "./game.module.css";
import io from 'socket.io-client';  // Importar cliente de socket.
import socket from "../../utils/sockets"; 
import { useSearchParams } from "next/navigation";
console.log("📡 Estado del socket al importar en Game.js:", socket);


export default function Game() {
  const [game, setGame] = useState(new Chess());
  const [user, setUser] = useState(null);
  const [fen, setFen] = useState(game.fen()); // Posición actual del tablero
  const [turn, setTurn] = useState("w"); // Controla el turno
  const [whiteTime, setWhiteTime] = useState(600); // Tiempo en segundos
  const [blackTime, setBlackTime] = useState(600);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [winner, setWinner] = useState(null);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [legalMoves, setLegalMoves] = useState([]);
  const [playerColor, setPlayerColor] = useState(null); // Color asignado al 
  const searchParams = useSearchParams();
  const idPartida = searchParams.get("id"); // Obtener el ID de la URL
  const gameCopy = new Chess(game.fen());
  const gameRef = useRef(game); // Referencia del estado de 'game'

// Actualiza el valor de gameRef siempre que 'game' cambie
useEffect(() => {
  gameRef.current = game;
  
  console.log("Hago la copia de la partida");

}, [game]);

  useEffect(() => {
    console.log("🔄 Buscando usuario en localStorage...");
    const storedUserData = localStorage.getItem("userData");
  
    if (storedUserData) {
      const parsedUser = JSON.parse(storedUserData);
      console.log("✅ Usuario encontrado:", parsedUser);
      setUser(parsedUser);
    } else {
      console.log("⚠️ No se encontraron datos de usuario en localStorage.");
    }
  }, []);


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

    // 💡 Asegurar que el evento "color" se escuche DESPUÉS de que el socket se reconect
        
        console.log("🎧 Ahora escuchando evento 'color'...");
        socket.on("color", (data) => {
            console.log("🎨 Recibido evento 'color' con datos:", data);

            if (!data || !data.jugadores) {
                console.error("❌ No se recibió información válida de colores.");
                return;
            }

            const jugadorActual = data.jugadores.find(jugador => jugador.id === user.id);
            
            if (!jugadorActual) {
                console.error("❌ No se encontró al usuario en la lista de jugadores.");
                return;
            }

            setPlayerColor(jugadorActual.color);
            console.log(`✅ Color asignado a ${user.NombreUser}: ${jugadorActual.color}`);
        });

        // Recibir movimientos del otro jugador
        socket.on('new-move', (data) => {
          console.log("♟️ Movimiento recibido:", data.movimiento);
          console.log("Voy a copiar el movimiento en mi partida");
          //gameCopy = new Chess(game.fen());
          gameCopy.move(data.movimiento);
          
          console.log("Hago la copia de la");
          setGame(gameCopy);
          setFen(gameCopy.fen());
          setTurn(gameCopy.turn());
        });

  
      return () => {
          console.log("🧹 Limpiando eventos de socket en pantalla de partida...");
          socket.off("color");
      };
  }, [user]); // Se ejecuta solo cuando `user` cambia y está definido.
  
  
      
  /*
      // Recibir mensajes del chat
      socket.on("chatMessage", (msg) => {
        setMessages((prev) => [...prev, msg]);
      });
  
      // Recibir actualización de tiempo
      socket.on("updateTime", ({ white, black }) => {
        setWhiteTime(white);
        setBlackTime(black);
      });*/
  
      /*return () => {
        socket.off("assignColor");
        socket.off("move");
        socket.off("chatMessage");
        socket.off("updateTime");
      };*/
    
    // El resto del código perm

  const handleMove = (sourceSquare, targetSquare) => {
    let colorTurn;
    console.log("Vamo a juga");
    if (playerColor === "black"){
      colorTurn = "b";
    } else {
      colorTurn = "w";
    }
    if (winner) return; // Bloquear si no es el turno
    if (colorTurn !== turn) {
      console.log(`❌ No es tu turno. Te toca jugar con: ${playerColor}, turno actual: ${turn}`);
      return;
  }
  console.log("El id de la partida es:", idPartida);
    //gameCopy = new Chess(game.fen());
    const move = gameCopy.move({ from: sourceSquare, to: targetSquare, promotion: "q" });

    if (move) {
      console.log("Estado actual del juego:", gameCopy.fen());
      setGame(gameCopy);
      setFen(gameCopy.fen());
      setTurn(gameCopy.turn());
      setSelectedSquare(null);
      setLegalMoves([]);
      console.log("♟️ Movimiento enviado:", move.san, idPartida, user.id)
      socket.emit("make-move", { movimiento: move.san, idPartida: idPartida, idJugador: user.id});

      if (gameCopy.isCheckmate()) {
        setWinner(move.color === "w" ? "Negro" : "Blanco");
      }
    }
  };

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      const newMessage = { text: message, sender: playerColor === "w" ? "Blanco" : "Negro" };
      setMessages([...messages, newMessage]);
      socket.emit("chatMessage", newMessage);
      setMessage("");
    }
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

    const gameCopy = new Chess(game.fen());
    if (selectedSquare === square) {
      setSelectedSquare(null);
      setLegalMoves([]);
      return;
    }
    
    const moves = gameCopy.moves({ square, verbose: true });
    if (moves.length > 0) {
      setSelectedSquare(square);
      setLegalMoves(moves.map(move => move.to));
    }
  };
  
  // Función para reiniciar la partida
  const resetGame = () => {
    setGame(new Chess());
    setFen(new Chess().fen());
    setTurn("w");
    setWhiteTime(600);
    setBlackTime(600);
    setWinner(null);
    setMessages([]);
    setMessage("");
  };

  // Función para mover la pieza si se hace clic en una casilla permitida
  const handleMoveClick = (targetSquare) => {
    if (!selectedSquare || !legalMoves.includes(targetSquare)) return;
    handleMove(selectedSquare, targetSquare);
  };

  return (
    <div className={styles.gameContainer}>
      {winner && (
        <div className={styles.winnerOverlay}>
          <h2>¡Has ganado!</h2>
          <span className={styles.trophy}>🏆</span>
          <button className={styles.reviewButton} onClick={resetGame}>
            Revisar Partida
          </button>
          <div className={styles.winnerActions}>
            <button className={styles.newGameButton} onClick={resetGame}>
              Buscar otra partida
            </button>
            <button className={styles.rematchButton} onClick={resetGame}>
              Pedir Revancha
            </button>
          </div>
        </div>
      )}
      <div className={styles.gameBody}>
        {/* Panel de Jugadas */}
        <div className={styles.movesPanel}>
          <h3>JUGADAS</h3>
          <ul>
            {game.history().map((move, index) => (
              <li key={index}>{move}</li>
            ))}
          </ul>
        </div>

        {/* Tablero de Ajedrez */}
        <div className={styles.boardContainer}>
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
            onPieceClick={handleSquareClick} // Permite seleccionar la pieza al hacer clic en ella
            onPieceDrop={(sourceSquare, targetSquare) => handleMove(sourceSquare, targetSquare)}
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
            arePiecesDraggable={true} // Mantiene la opción de arrastrar piezas
            animationDuration={200}
          />
        </div>

        {/* Panel de Chat */}
        <div className={styles.chatPanel}>
          <h3>Chat 💬</h3>
          <div className={styles.chatMessages}>
            {messages.map((msg, index) => (
              <p key={index} className={msg.sender === "Blanco" ? styles.whiteMessage : styles.blackMessage}>
                <span className={msg.sender === "Blanco" ? styles.orangeDot : styles.greenDot}></span> {msg.text}
              </p>
            ))}
          </div>
          <div className={styles.chatInputContainer}>
            <input
              type="text"
              placeholder="Escribe un mensaje..."
              className={styles.chatInput}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e)} // Detecta la tecla Enter
            />
            <button className={styles.sendButton} onClick={handleSendMessage}>➤</button>
          </div>
        </div>
      </div>
    </div>
  );
}
