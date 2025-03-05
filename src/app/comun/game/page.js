"use client"; // Necesario para Next.js 13+

import { useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import styles from "./game.module.css";

export default function Game() {
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState(game.fen()); // Posición actual del tablero
  const [turn, setTurn] = useState("w"); // Controla el turno

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
      if (gameCopy.inCheckmate()) {
        alert(`¡Jaque mate! Gana el jugador ${move.color === "w" ? "blanco" : "negro"}`);
      } else if (gameCopy.inCheck()) {
        alert("¡Jaque!");
      }
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
          <h3 className={styles.playerName}>
            <span className={styles.greenDot}></span> {turn === "w" ? "Turno de Blancas" : "Turno de Negras"}
          </h3>
          <Chessboard
            position={fen}
            onPieceDrop={handleMove} // Llama a la función cuando una pieza se mueve
            boardStyle={{ borderRadius: "5px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)" }}
            arePiecesDraggable={true} // Permite mover piezas
            animationDuration={200} // Animación fluida al mover piezas
          />
        </div>

        {/* Panel de Chat */}
        <div className={styles.chatPanel}>
          <h3>Chat 💬</h3>
          <div className={styles.chatMessages}>
            <p>
              <span className={styles.greenDot}></span> Hola!
            </p>
            <p>
              <span className={styles.orangeDot}></span> Buenas!
            </p>
          </div>
          <div className={styles.chatInputContainer}>
            <input type="text" placeholder="Escribe un mensaje..." className={styles.chatInput} />
            <button className={styles.sendButton}>➤</button>
          </div>
        </div>
      </div>
    </div>
  );
}
