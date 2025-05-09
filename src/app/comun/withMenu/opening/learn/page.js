"use client";

import { useEffect, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import styles from "./learn.module.css"; // Usaremos tu mismo estilo
import { useRouter } from "next/navigation";

export default function LearnPage() {
  const router = useRouter();
  const [game, setGame] = useState(new Chess());
  const [moves, setMoves] = useState([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [fen, setFen] = useState("start");
  const [apertura, setApertura] = useState(null);
  const [mostrarMovimientos, setMostrarMovimientos] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 1000);
    };
  
    checkScreenSize(); // Comprobamos al montar
  
    window.addEventListener('resize', checkScreenSize); // Comprobamos en cada resize
  
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  useEffect(() => {
    const aperturaGuardada = localStorage.getItem("aperturaSeleccionada");
    if (!aperturaGuardada) return;

    const aperturaObj = JSON.parse(aperturaGuardada);
    setApertura(aperturaObj);

    const tempMoves = aperturaObj.movimientos.filter(mov => Object.keys(mov)[0] !== "FIN").map(mov => Object.keys(mov)[0]);
    setMoves(tempMoves);
  }, []);

  const goToMove = (index) => {
    const tempGame = new Chess();
    for (let i = 0; i < index; i++) {
      const move = moves[i];
      const [from, to] = move.split(" ");
      tempGame.move({ from, to });
    }
    setGame(tempGame);
    setFen(tempGame.fen());
    setCurrentMoveIndex(index);
  };
  

  if (!apertura) return <div className={styles.reviewContainer}>Cargando apertura...</div>;

  return (
    <div className={styles.reviewContainer}>
      <div className={styles.gameBody}>
        <div className={styles.boardContainer}>
          <h2 className={styles.title}>{apertura.nombre}</h2>
          <Chessboard
            position={fen}
            animationDuration={400}
            arePiecesDraggable={false}
          />
        </div>
        {isMobile && (
            <button
                className={styles.toggleMovimientosButton}
                onClick={() => setMostrarMovimientos(!mostrarMovimientos)}
            >
                {mostrarMovimientos ? "Ocultar movimientos ▲" : "Ver movimientos ▼"}
            </button>
            )}

        <div className={`${styles.movesPanel} ${mostrarMovimientos ? styles.visible : ""}`}>
          <h3>Movimientos</h3>
          <div className={styles.movesList}>
            {apertura.movimientos.map((movimiento, idx) => {
                const move = Object.keys(movimiento)[0];
                const descripcion = Object.values(movimiento)[0];
                if (move === "FIN") return null;
                const isWhiteMove = idx % 2 === 0; // Indices pares: blancas
                return (
                <div
                    key={idx}
                    className={`${styles.moveItem} ${isWhiteMove ? styles.whiteMove : styles.blackMove} ${idx === currentMoveIndex - 1 ? styles.active : ""}`}
                >
                    <b>{move}</b> - {descripcion}
                </div>
                );
            })}
            </div>


          <div className={styles.navigation}>
            <button onClick={() => goToMove(currentMoveIndex - 1)} disabled={currentMoveIndex === 0}>⟵</button>
            <button onClick={() => goToMove(currentMoveIndex + 1)} disabled={currentMoveIndex === moves.length}>⟶</button>
          </div>
          <button onClick={() => router.back()} className={styles.backButtonMoves}>
            Volver
            </button>
        </div>
      </div>
    </div>
  );
}
