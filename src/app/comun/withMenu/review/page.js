"use client";
import { useEffect, useState, useRef } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import styles from "./review.module.css";
import { useRouter } from "next/navigation";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function ReviewPage() {
  const router = useRouter();
  const [game, setGame] = useState(new Chess());
  const [moves, setMoves] = useState([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [fen, setFen] = useState("start");
  const [datosPartida, setDatosPartida] = useState(null);
  const [showReviewEnd, setShowReviewEnd] = useState(false);

  // Estados para análisis de Stockfish
  const [evalCp, setEvalCp] = useState(0);
  const engineRef = useRef(null);
  const initedRef = useRef(false);
  const depthRef = useRef(0);
  const fenRef = useRef(fen);
  
  const [miNombre, setMiNombre] = useState("");
  const [miElo, setMiElo] = useState("");
  const [miFoto, setMiFoto] = useState("");
  const [rivalNombre, setRivalNombre] = useState("");
  const [rivalElo, setRivalElo] = useState("");
  const [rivalFoto, setRivalFoto] = useState("");
  const [esBlancas, setEsBlancas] = useState(true);

  useEffect(() => {
    fenRef.current = fen;
  }, [fen]);
  // 1) Inicializa Stockfish y procesa info depth...score
  useEffect(() => {
    const TARGET_DEPTH = 15;
    const engine = new Worker("/stockfish/stockfish-nnue-16-single.js");
    engine.onmessage = ({ data }) => {
      if (data === "uciok") {
        engine.postMessage("isready");
        return;
      }
      if (data === "readyok") {
        initedRef.current = true;
        return;
      }
      if (!initedRef.current || !data.startsWith("info")) return;
  
      const m = data.match(/info depth (\d+).*score (cp|mate) (-?\d+)/);
      if (!m) return;
      const depth = parseInt(m[1], 10);
      const kind  = m[2];       // "cp" o "mate"
      const val   = parseInt(m[3], 10);
      if (depth < TARGET_DEPTH) return;
      // ----
      if (kind === "cp") {
        // cp siempre es desde la perspectiva blancas
        setEvalCp(val);
      } else {
        // mate: val>0 ⇒ side-to-move puede dar mate; val<0 ⇒ side-to-move se va a ser mateado
        const stm = fenRef.current.split(" ")[1]; // "w" o "b"
        // si stm==="w" y val>0 ⇒ blancas matan; stm==="b" y val>0 ⇒ negras matan
        // por tanto:
        let whiteVal;
        if (val > 0) {
          whiteVal = stm === "b" ? 10000 : -10000;
        } else {
          whiteVal = stm === "b" ? -10000 : 10000;
        }
        setEvalCp(whiteVal);
      }
    };
  
    engine.postMessage("uci");
    engineRef.current = engine;
    return () => engine.terminate();
  }, []);
  


  // Cada vez que cambie la posición, solicita análisis
  useEffect(() => {
    if (!engineRef.current || !initedRef.current || fen === "start" ) return;
    depthRef.current = 0;
    engineRef.current.postMessage(`position fen ${fen}`);
    engineRef.current.postMessage("go depth 15");
console.log("evalCp:", evalCp, "fen:", fen);

  }, [fen]);

  // 3) Carga PGN y extrae jugadas + tags
  useEffect(() => {
    const raw = localStorage.getItem("partidaParaRevisar");
    if (!raw) return;
    const match = JSON.parse(raw);

    const temp = new Chess();
    if (/\d+\.\s/.test(match.PGN)) temp.loadPgn(match.PGN);
    const hist = temp.history();
    temp.reset();

    setMoves(hist);
    setFen(temp.fen());

    const tag = (t) => {
      const mm = match.PGN.match(
        new RegExp(`\\[${t} "(.*?)"\\]`)
      );
      return mm?.[1] || "";
    };
    const wName = tag("White Alias"),
      bName = tag("Black Alias"),
      wElo = tag("White Elo"),
      bElo = tag("Black Elo"),
      wId = tag("White"),
      bId = tag("Black");
    const user =
      JSON.parse(localStorage.getItem("userData"))
        ?.publicUser || {};
    const isW = wId === user.id || wName === user.NombreUser;

    setMiNombre(isW ? wName : bName);
    setRivalNombre(isW ? bName : wName);
    setMiElo(isW ? wElo : bElo);
    setRivalElo(isW ? bElo : wElo);
    setMiFoto(user.FotoPerfil);
    setEsBlancas(isW);
  }, []);

  // Navegación de jugadas
  const goToMove = (index) => {
    const tempGame = new Chess();
    for (let i = 0; i < index; i++) tempGame.move(moves[i]);
    //setGame(tempGame);
    setFen(tempGame.fen());
    setCurrentMoveIndex(index);
    setShowReviewEnd(index === moves.length);
  };

  // Fetch de info del rival
  useEffect(() => {
    const fetchRivalInfo = async () => {
      const partida = JSON.parse(localStorage.getItem("partidaParaRevisar"));
      if (!partida) return;

      const whiteId = partida.PGN.match(/\[White "(.*?)"\]/)?.[1];
      const blackId = partida.PGN.match(/\[Black "(.*?)"\]/)?.[1];
      const myId = JSON.parse(localStorage.getItem("userData"))?.publicUser?.id;
      if (!whiteId || !blackId || !myId) return;

      const rivalId = whiteId === myId ? blackId : whiteId;
      try {
        const res = await fetch(`${BACKEND_URL}/getUserInfo?id=${rivalId}`);
        if (!res.ok) throw new Error("Error al obtener la info del rival");
        const rivalData = await res.json();
        setRivalFoto(rivalData.FotoPerfil);
      } catch (error) {
        console.error(error);
      }
    };
    fetchRivalInfo();
  }, []);

  return (
    <div className={styles.reviewContainer}>
      <div className={styles.gameBody}>
        <div className={styles.boardContainer}>
          {/* Info rival arriba */}
          <div className={styles.playerInfoTop}>
            <div className={styles.playerName}>
              {rivalFoto ? (
                <img
                  src={`/fotosPerfilWebp/${rivalFoto}`}
                  className={styles.profilePicture}
                  alt="Rival"
                />
              ) : (
                <span className={styles.greenDot}></span>
              )}
              <span className={styles.userName}>{rivalNombre}</span>
              <span className={styles.userElo}>
                ({rivalElo ? Math.round(rivalElo) : "?"})
              </span>
            </div>
          </div>

          {/* Contenedor flex para barra de análisis y tablero */}
          {/* … dentro de .boardContainer … */}
          <div className={styles.boardAndAnalysis}>
          <div className={styles.evalBarVertical}>
  {(() => {
    // 1) Calcula un ratio [0..1] desde la perspectiva de Blancas:
    let ratio;
    if      (evalCp >=  10000) ratio = 1;   // mate Blancas
    else if (evalCp <= -10000) ratio = 0;   // mate Negras
    else {
      const cp = Math.max(-1000, Math.min(1000, evalCp));
      ratio = (cp + 1000) / 2000;
    }

    // 2) Siempre pintamos primero la parte clara y luego la oscura:
    return (
      <>
        <div className={styles.whiteAdv} style={{ flex: 1 - ratio     }} />
        <div className={styles.blackAdv} style={{ flex: ratio }} />
      </>
    );
  })()}
</div>






            <Chessboard
              position={fen}
              boardOrientation={esBlancas ? "white" : "black"}
              animationDuration={200}
              arePiecesDraggable={false}
            />
          </div>


          {/* Info local abajo */}
          <div className={styles.playerInfoBottom}>
            <div className={styles.playerName}>
              {miFoto ? (
                <img
                  src={`/fotosPerfilWebp/${miFoto}`}
                  className={styles.profilePicture}
                  alt="Yo"
                />
              ) : (
                <span className={styles.orangeDot}></span>
              )}
              <span className={styles.userName}>{miNombre}</span>
              <span className={styles.userElo}>
                ({miElo ? Math.round(miElo) : "?"})
              </span>
            </div>
          </div>
        </div>

        {/* Panel de jugadas y navegación */}
        <div className={styles.movesPanel}>
          <h3>Jugadas</h3>
          <div className={styles.movesList}>
            {moves.length === 0 ? (
              <div
                style={{ textAlign: "center", fontWeight: "bold", color: "#ccc", marginTop: 20 }}
              >
                Esta partida no tiene jugadas para revisar.
              </div>
            ) : (
              moves.map((move, idx) => (
                <div
                  key={idx}
                  className={`${styles.moveItem} ${
                    idx === currentMoveIndex - 1 ? styles.active : ""
                  }`}
                >
                  {Math.floor(idx / 2) + 1}. {move}
                </div>
              ))
            )}
          </div>

          <div className={styles.navigation}>
            <button onClick={() => goToMove(currentMoveIndex - 1)} disabled={currentMoveIndex === 0}>
              ⬅
            </button>
            <button
              onClick={() => goToMove(currentMoveIndex + 1)}
              disabled={currentMoveIndex === moves.length}
            >
              ➡
            </button>
          </div>
          <button onClick={() => router.push("/comun/withMenu/profile")} className={styles.backButtonMoves}>
            Volver
            </button>
        </div>
      </div>

      {showReviewEnd && (
        <div className={styles.winnerOverlay}>
          <h2>Fin de la revisión</h2>
          <span className={styles.trophy}>🏁</span>
          <p>Has llegado al final de la partida.</p>
          <div className={styles.winnerActions}>
            <button
              className={styles.newGameButton}
              onClick={() => {
                setCurrentMoveIndex(0);
                goToMove(0);
                setShowReviewEnd(false);
              }}
            >
              Volver a ver
            </button>
            <button className={styles.rematchButton} onClick={() => router.back()}>
              Salir
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
