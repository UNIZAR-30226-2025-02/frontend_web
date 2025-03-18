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
  const [game, setGame] = useState("");
  const [user, setUser] = useState(null);
  const [fen, setFen] = useState(""); // Posición actual del tablero
  let [turn, setTurn] = useState("w"); // Controla el turno
  const [whiteTime, setWhiteTime] = useState(600); // Tiempo en segundos
  const [blackTime, setBlackTime] = useState(600);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [winner, setWinner] = useState(null);
  const [loser, setLoser] = useState(null);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [legalMoves, setLegalMoves] = useState([]);
  const [playerColor, setPlayerColor] = useState(null); // Color asignado al 
  const searchParams = useSearchParams();
  const idPartida = searchParams.get("id"); // Obtener el ID de la URL
  //const gameCopy = new Chess(game.fen());
  //const gameRef = useRef(game); // Referencia del estado de 'game'
  const gameCopy = useRef(new Chess()); // Referencia única del juego

  // Actualiza el valor de gameRef siempre que 'game' cambie
useEffect(() => {
  setFen(gameCopy.current.fen()); // Iniciar con el FEN correcto
  setTurn(gameCopy.current.turn());
}, []);

  useEffect(() => {
    console.log("🔄 Buscando usuario en localStorage...");
    const storedUserData = localStorage.getItem("userData");
    const color = localStorage.getItem("colorJug");
    if (storedUserData) {
      const parsedUser = JSON.parse(storedUserData);
      console.log("✅ Usuario encontrado:", parsedUser);
      setUser(parsedUser);
      setPlayerColor(color);
      console.log("Asigno el color:", color);
      console.log("Y mi color es: ", playerColor);
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
    //socket.off("new-move");
    // Recibir movimientos del otro jugador
    socket.on('new-move', (data) => {
      console.log("♟️ Movimiento recibido:", data.movimiento);
      console.log("Turno en gameCopy: ", gameCopy.current.turn());   
      console.log("Turno de: ", turn); 
      //setGame((prevGame) => {
        //const newGame = new Chess(prevGame.fen());
        gameCopy.current.move(data.movimiento);
        setFen(gameCopy.current.fen());
        setTurn(gameCopy.current.turn());
        console.log("Esta es la partida:", gameCopy);
        console.log("Turno en gameCopy: ", gameCopy.current.turn());   
        console.log("Turno de: ", turn); 
        //turn = gameCopy.turn();
        console.log("Turno despues de tal: ", turn); 
        if (gameCopy.current.isCheckmate()) {
          setLoser(playerColor === "white" ? "Blanco" : "Negro");
        } 
        //return gameCopy;
      //});
    });

        /*socket.on('new-message', (data)=>{
          console.log("♟️ Mensaje recibido:", data.message);
        })*/

  
      return () => {
          console.log("🧹 Limpiando eventos de socket en pantalla de partida...");
          //socket.off("color");
          socket.off("new-move");
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
    console.log("Es el turno de: ", turn);
    console.log("Deberia de ser el de gameCopy: ", gameCopy.current.turn());
    if (colorTurn !== gameCopy.current.turn()) {
      console.log(`❌ No es tu turno. Te toca jugar con: ${playerColor}, turno actual: ${gameCopy.turn()}`);
      return;
    }
    console.log("El id de la partida es:", idPartida);
    //gameCopy = new Chess(game.fen());
    //setGame((prevGame) => {
      //const newGame = new Chess(prevGame.fen());
    try{
      const move = gameCopy.current.move({ from: sourceSquare, to: targetSquare});
      //console.log("Doy error");

      if (move) {
        console.log("Estado actual del juego:",gameCopy.current.fen());
          // Si se ha realizado un enroque, actualizar la posición correctamente
        if (move.san.includes("O-O")) {
          console.log("♜ Enroque realizado!");
        }
        setFen(gameCopy.current.fen());
        setTurn(gameCopy.current.turn());
        console.log("Esta es la partida:", gameCopy);
        setSelectedSquare(null);
        setLegalMoves([]);
        socket.emit("make-move", { movimiento: move.san, idPartida, idJugador: user.id });
  
        if (gameCopy.current.isCheckmate()) {
          setWinner(move.color === "w" ? "Negro" : "Blanco");
        }

        //return gameCopy;
      }
    } catch (error){
      console.log("⚠️ Error al intentar mover: Movimiento inválido.", error);
      //return prevGame; // No hacer nada si hay error
    }
      
//});
  };

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      const newMessage = { Id_partida:idPartida, Id_usuario: user.id,  Mensaje: message};
      setMessages([...messages, newMessage]);
      console.log("♟️ Mensaje enviado:", newMessage);
      socket.emit("send-message", newMessage);
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

    //const gameCopy = new Chess(game.fen());
    const piece = gameCopy.current.get(square); // Obtener la pieza en la casilla seleccionada
    
     // Verificar si hay una pieza en la casilla y si pertenece al jugador actual
    /*if (!piece || piece.color !== (playerColor === "white" ? "w" : "b")) {
      console.log("❌ No puedes seleccionar una pieza rival.");
      return;
    }*/

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
  const resetGame = () => {
    setGame(new Chess());
    setFen(new Chess().fen());
    setTurn("w");
    setWhiteTime(600);
    setBlackTime(600);
    setWinner(null);
    setLoser(null);
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
          <div className={styles.winnerActions}>
            <button className={styles.newGameButton} onClick={resetGame}>
              Buscar otra partida
            </button>
            <button className={styles.reviewButton} onClick={resetGame}>
              Revisar Partida
            </button>
          </div>
        </div>
      )}
      {loser && (
        <div className={styles.winnerOverlay}>
          <h2>¡Has perdido!</h2>
          <span className={styles.trophy}>❌</span>
          <div className={styles.winnerActions}>
            <button className={styles.newGameButton} onClick={resetGame}>
              Buscar otra partida
            </button>
            <button className={styles.reviewButton} onClick={resetGame}>
              Revisar Partida
          </button>
          </div>
        </div>
      )}
      <div className={styles.gameBody}>
        {/* Panel de Jugadas */}
        <div className={styles.movesPanel}>
          {/*<h3>JUGADAS</h3>
          <ul>
            {game.history().map((move, index) => (
              <li key={index}>{move}</li>
            ))}
          </ul>*/}
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
