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
  const [tablas, setTablas] = useState(null);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [legalMoves, setLegalMoves] = useState([]);
  const [pendingPromotion, setPendingPromotion] = useState(null);
  const [showPromotionPopup, setShowPromotionPopup] = useState(false)
  let piezaLlega = null;
  let piezaElejida = null;
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
        setFen(gameCopy.current.fen());
        setTurn(gameCopy.current.turn());
      } else {
        console.error("Movimiento no válido:", moveStr);
      }
    });
    

    socket.on('gameOver', (data) => {
      console.log("Llega final de partida", data);
      if(data.result === "draw"){
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
    
    
      const handleMove = (sourceSquare, targetSquare) => {
        let colorTurn = playerColor === "black" ? "b" : "w";
        if (winner) return;
        if (colorTurn !== gameCopy.current.turn()) {
          console.log(`❌ No es tu turno. Te toca jugar con: ${playerColor}, turno actual: ${gameCopy.current.turn()}`);
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
            console.log("✔️ Movimiento exitoso:", move);
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
    if (!piece || piece.color !== (playerColor === "white" ? "w" : "b")) {
      console.log("❌ No puedes seleccionar una pieza rival.");
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
      {tablas && (
        <div className={styles.winnerOverlay}>
          <h2>¡Has llegado a tablas!</h2>
          <span className={styles.trophy}>🚫</span>
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
            arePiecesDraggable={true} // Mantiene la opción de arrastrar piezas
            animationDuration={200}
          />
         {/*} {showPromotionPopup && (
                <div className="promotion-modal">
                    <p>Selecciona una pieza para promocionar:</p>
                    {["Q", "R", "B", "N"].map((piece) => (
                        <button key={piece} onClick={() => handlePromotion(piece)}>
                            {piece}
                        </button>
                    ))}
                </div>
            )}*/}
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
