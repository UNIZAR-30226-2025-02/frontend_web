"use client";

import { useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import styles from "./game.module.css";

export default function Game() {
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState(game.fen()); // Posición actual del tablero
  const [turn, setTurn] = useState("w"); // Controla el turno
  const [whiteTime, setWhiteTime] = useState(600); // Tiempo en segundos
  const [blackTime, setBlackTime] = useState(600);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  // Función para formatear el tiempo en mm:ss
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Función para manejar el movimiento de las piezas
  const handleMove = (sourceSquare, targetSquare) => {
    const gameCopy = new Chess(game.fen());
    const move = gameCopy.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // Siempre promociona a reina (puedes cambiarlo)
    });

    if (move) {
      setGame(gameCopy);
      setFen(gameCopy.fen()); // Actualiza la posición del tablero
      setTurn(gameCopy.turn()); // Cambia el turno del jugador

      // Verifica si hay jaque o jaque mate
      if (gameCopy.isCheckmate()) {
        alert(`¡Jaque mate! Gana el jugador ${move.color === "w" ? "blanco" : "negro"}`);
      } else if (gameCopy.isCheck()) {
        alert("¡Jaque!");
      }
    }
  };

  // Manejar el envío de mensajes en el chat
  const handleSendMessage = () => {
    if (message.trim() !== "") {
      setMessages([...messages, { text: message, sender: turn === "w" ? "Blanco" : "Negro" }]);
      setMessage("");
    }
  };

  return (
    <div className={styles.gameContainer}>
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
          <div className={`${styles.playerInfoTop} ${turn === "b" ? styles.activePlayer : styles.inactivePlayer}`}>
            <div className={styles.playerName}>
              <span className={styles.greenDot}></span> NombreJugador
            </div>
            <div className={styles.playerTime}>{formatTime(blackTime)}</div>
          </div>
          <Chessboard
            position={fen}
            onPieceDrop={handleMove} // Llama a la función cuando una pieza se mueve
            boardStyle={{ borderRadius: "5px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)" }}
            arePiecesDraggable={true} // Permite mover piezas
            animationDuration={200} // Animación fluida al mover piezas
          />
          <div className={`${styles.playerInfoBottom} ${turn === "w" ? styles.activePlayer : styles.inactivePlayer}`}>
            <div className={styles.playerName}>
              <span className={styles.orangeDot}></span> NombreJugador
            </div>
            <div className={styles.playerTime}>{formatTime(whiteTime)}</div>
          </div>
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
            />
            <button className={styles.sendButton} onClick={handleSendMessage}>➤</button>
          </div>
        </div>
      </div>
    </div>
  );
}
