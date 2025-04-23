"use client";

import styles from './ranking.module.css';
import { useEffect, useState } from "react";
import {
  FaChessPawn,
  FaFire
} from "react-icons/fa";
import {
  FcApproval,
  FcAlarmClock,
  FcFlashOn,
  FcBullish,
  FcRating
} from "react-icons/fc";
import { IoMdTrophy } from "react-icons/io";
import { IoMdClose } from "react-icons/io";

export default function RankingPage() {
  const [user, setUser] = useState(null);
  const [rankings, setRankings] = useState({});
  const [userRankings, setUserRankings] = useState({});
  const [selectedModo, setSelectedModo] = useState(null);

  const modos = [
    { nombre: "Rápida", id: "Punt_10", icon: <FaChessPawn style={{ color: '#552003' }} /> },
    { nombre: "Clásica", id: "Punt_30", icon: <FcApproval /> },
    { nombre: "Blitz", id: "Punt_5", icon: <FcAlarmClock /> },
    { nombre: "Bullet", id: "Punt_3", icon: <FcFlashOn /> },
    { nombre: "Incremento", id: "Punt_5_10", icon: <FcBullish /> },
    { nombre: "Incremento exprés", id: "Punt_3_2", icon: <FcRating /> },
  ];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserData = localStorage.getItem("userData");
      if (storedUserData) {
        const parsedUser = JSON.parse(storedUserData);
        setUser(parsedUser.publicUser);
      }
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    modos.forEach(async ({ id }) => {
      try {
        const [rankingRes, userRes] = await Promise.all([
          fetch(`https://checkmatex-gkfda9h5bfb0gsed.spaincentral-01.azurewebsites.net/rankingPorModo?modo=${id}`),
          fetch(`https://checkmatex-gkfda9h5bfb0gsed.spaincentral-01.azurewebsites.net/rankingUserPorModo?modo=${id}&user=${user.NombreUser}`)
        ]);

        const rankingData = await rankingRes.json();
        const userData = await userRes.json();

        setRankings(prev => ({ ...prev, [id]: rankingData }));
        setUserRankings(prev => ({ ...prev, [id]: userData }));
      } catch (error) {
        console.error("Error cargando ranking:", error);
      }
    });
  }, [user]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        <IoMdTrophy style={{ color: "gold", fontSize: '45px' }} /> RANKING
      </h2>

      {modos.map(({ nombre, id, icon }) => (
        <div key={id} className={styles.rankingBox} onClick={() => setSelectedModo(id)} style={{ cursor: 'pointer' }}>
          <div className={styles.modeIcon}>{icon}</div>
          <div className={styles.rankingContent}>
            <div className={styles.rankingList}>
              {rankings[id]?.slice(0, 4).map((jugador) => (
                <div key={jugador.id} className={styles.rankingItem}>
                  <span className={`${styles.medal} ${styles[`medal${jugador.rank}`]}`}>
                    {jugador.rank}º
                  </span>
                  <span className={styles.name}>{jugador.nombre}</span>
                  <span className={styles.score}>{Math.round(jugador.puntuacion)}</span>
                </div>
              ))}
            </div>

            {userRankings[id] && (
              <div className={styles.userCard}>
                <img
                  src={`/fotosPerfilWebp/${user.FotoPerfil}`}
                  alt="Foto de perfil"
                  className={styles.userAvatar}
                />
                <div className={styles.userInfo}>
                  <span className={styles.userName}>{userRankings[id].nombre}</span>
                  <div>
                    <span className={styles.userPos}>#{userRankings[id].rank}</span>
                    <span className={styles.userScore}>{Math.round(userRankings[id].puntuacion)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      {selectedModo && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button className={styles.closeButton} onClick={() => setSelectedModo(null)}>
              <IoMdClose size={24} />
            </button>
            <h3 className={styles.modalTitle}>Top 10 - {modos.find(m => m.id === selectedModo)?.nombre}</h3>
            <div className={styles.modalRankingList}>
              {rankings[selectedModo]?.slice(0, 10).map((jugador) => (
                <div key={jugador.id} className={styles.rankingItem}>
                  <span className={`${styles.medal} ${styles[`medal${jugador.rank}`]}`}>
                    {jugador.rank}º
                  </span>
                  <span className={styles.name}>{jugador.nombre}</span>
                  <span className={styles.score}>{Math.round(jugador.puntuacion)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
