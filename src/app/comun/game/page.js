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
  const [winner, setWinner] = useState(null);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [legalMoves, setLegalMoves] = useState([]);

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

  // Función para manejar el movimiento de las piezas
  const handleMove = (sourceSquare, targetSquare) => {
    if (winner) return; // Evita movimientos si ya hay un ganador

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
      setSelectedSquare(null);
      setLegalMoves([]);

      // Verifica si hay jaque mate
      if (gameCopy.isCheckmate()) {
        setWinner(move.color === "w" ? "Negro" : "Blanco");
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

   // Manejar el envío de mensaje con Enter
   const handleKeyDown = (event) => {
    if (event.key === "Enter" && message.trim() !== "") {
      event.preventDefault();
      handleSendMessage();
    }
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
