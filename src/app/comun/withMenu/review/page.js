"use client";
import { useEffect, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import styles from "./review.module.css";
import { useRouter } from "next/navigation";

export default function ReviewPage() {
  const router = useRouter();
  const [game, setGame] = useState(new Chess());
  const [moves, setMoves] = useState([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [fen, setFen] = useState("start");
  const [datosPartida, setDatosPartida] = useState(null);
  const [showReviewEnd, setShowReviewEnd] = useState(false);

  const [miNombre, setMiNombre] = useState("");
  const [miElo, setMiElo] = useState("");
  const [miFoto, setMiFoto] = useState("");
  const [rivalNombre, setRivalNombre] = useState("");
  const [rivalElo, setRivalElo] = useState("");
  const [rivalFoto, setRivalFoto] = useState("");
  const [esBlancas, setEsBlancas] = useState(true);

  useEffect(() => {
    const partidaGuardada = localStorage.getItem("partidaParaRevisar");
    if (!partidaGuardada) return;

    const match = JSON.parse(partidaGuardada);
    setDatosPartida(match);

    const tempGame = new Chess();
    tempGame.loadPgn(match.PGN);
    const history = tempGame.history();
    tempGame.reset();
    setMoves(history);
    setGame(tempGame);
    setFen(tempGame.fen());

    const extractTag = (tag) => {
      const result = match.PGN.match(new RegExp(`\\[${tag} "(.*?)"\\]`));
      return result?.[1] || null;
    };

    const whiteName = extractTag("White Alias");
    const blackName = extractTag("Black Alias");
    const whiteElo = extractTag("White Elo");
    const blackElo = extractTag("Black Elo");
    const whiteId = extractTag("White");
    const blackId = extractTag("Black");

    const userData = JSON.parse(localStorage.getItem("userData"));
    const userId = userData?.publicUser?.id;
    const userPhoto = userData?.publicUser?.FotoPerfil;
    const userName = userData?.publicUser?.NombreUser;

    const esUserBlancas = whiteId === userId || whiteName === userName;
    const rivalId = esUserBlancas ? blackId : whiteId;

    setMiNombre(esUserBlancas ? whiteName : blackName);
    setRivalNombre(esUserBlancas ? blackName : whiteName);
    setMiElo(esUserBlancas ? whiteElo : blackElo);
    setRivalElo(esUserBlancas ? blackElo : whiteElo);
    setMiFoto(userPhoto);
    setEsBlancas(esUserBlancas);
  }, []);

  const goToMove = (index) => {
    const tempGame = new Chess();
    for (let i = 0; i < index; i++) {
      tempGame.move(moves[i]);
    }
    setGame(tempGame);
    setFen(tempGame.fen());
    setCurrentMoveIndex(index);

    // Mostrar popup si llegas al final, ocultarlo si no
    if (index === moves.length) {
        setShowReviewEnd(true);
    } else {
        setShowReviewEnd(false);
    }
  };

  useEffect(() => {
    const fetchRivalInfo = async () => {
        const partida = JSON.parse(localStorage.getItem("partidaParaRevisar"));
        if (!partida) return;

        const match = partida;
        const whiteId = match.PGN.match(/\[White "(.*?)"\]/)?.[1];
        const blackId = match.PGN.match(/\[Black "(.*?)"\]/)?.[1];

        const storedUserData = JSON.parse(localStorage.getItem("userData"));
        const myId = storedUserData?.publicUser?.id;

        if (!whiteId || !blackId || !myId) return;

        const isWhite = whiteId === myId;
        const rivalId = isWhite ? blackId : whiteId;

        try {
            const response = await fetch(`https://checkmatex-gkfda9h5bfb0gsed.spaincentral-01.azurewebsites.net/getUserInfo?id=${rivalId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                console.error("Error al obtener la info del rival");
                return;
            }

            const rivalData = await response.json();
            setRivalFoto(rivalData.FotoPerfil); // o lo que devuelva

        } catch (error) {
            console.error("Error al traer datos del rival:", error);
        }
    };

    fetchRivalInfo();
}, []);


  return (
    <div className={styles.reviewContainer}>
      <div className={styles.gameBody}>
        <div className={styles.boardContainer}>
          <div className={styles.playerInfoTop}>
            <div className={styles.playerName}>
              {rivalFoto ? (
                <img src={`/fotosPerfilWebp/${rivalFoto}`} className={styles.profilePicture} alt="Rival" />
              ) : (
                <span className={styles.greenDot}></span>
              )}
              <span className={styles.userName}>{rivalNombre ?? "Rival"}</span>
              <span className={styles.userElo}>
                ({rivalElo ? Math.round(rivalElo) : "?"})
                </span>

            </div>
          </div>

          <Chessboard
            position={fen}
            boardOrientation={esBlancas ? "white" : "black"}
            animationDuration={200}
            arePiecesDraggable={false}
          />

          <div className={styles.playerInfoBottom}>
            <div className={styles.playerName}>
              {miFoto ? (
                <img src={`/fotosPerfilWebp/${miFoto}`} className={styles.profilePicture} alt="Yo" />
              ) : (
                <span className={styles.orangeDot}></span>
              )}
              <span className={styles.userName}>{miNombre ?? "Yo"}</span>
              <span className={styles.userElo}>
                ({miElo ? Math.round(miElo) : "?"})
                </span>

            </div>
          </div>
        </div>

        <div className={styles.movesPanel}>
          <h3>Jugadas</h3>
          <div className={styles.movesList}>
            {moves.map((move, idx) => (
              <div key={idx} className={`${styles.moveItem} ${idx === currentMoveIndex - 1 ? styles.active : ""}`}>
                {Math.floor(idx / 2) + 1}. {move}
              </div>
            ))}
          </div>

          <div className={styles.navigation}>
            <button onClick={() => goToMove(currentMoveIndex - 1)} disabled={currentMoveIndex === 0}>⬅</button>
            <button onClick={() => goToMove(currentMoveIndex + 1)} disabled={currentMoveIndex === moves.length}>➡</button>
          </div>
        </div>
      </div>
      {showReviewEnd && (
        <div className={styles.winnerOverlay}>
            <h2>Fin de la revisión</h2>
            <span className={styles.trophy}>🏁</span>
            <p>Has llegado al final de la partida.</p>
            <div className={styles.winnerActions}>
            <button className={styles.newGameButton} onClick={() => {
                setCurrentMoveIndex(0);
                goToMove(0);
                setShowReviewEnd(false);
            }}>
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
