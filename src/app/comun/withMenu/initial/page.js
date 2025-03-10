"use client";

import styles from './initial.module.css';
import Link from "next/link";
import { FcSearch, FcRating, FcFlashOn, FcAlarmClock, FcApproval, FcBullish } from "react-icons/fc";
import { FaChessPawn, FaFire   } from "react-icons/fa";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { useAuth } from '@/app/components/AuthContext';



export default function InitialPage() {

    const { user } = useAuth(); // Obtenemos info del usuario
    
    // Descripciones de los modos de juego
    const descriptions = {
        "Clásica": "Modo tradicional de ajedrez. Cada jugador consta de 10 min para realizar sus movimientos.",
        "Principiante": "Ideal para quienes están aprendiendo. Cada jugador consta de 30 min para realizar sus movimientos.",
        "Avanzado": "Para jugadores experimentados. Cada jugador consta de 5 min para realizar sus movimientos.",
        "Relámpago": "Modo para expertos. El tiempo es muy limitado, cada jugador cuenta con 3 minutos.",
        "Incremento": "El tiempo aumenta 10 seg con cada jugada, partiendo de 15 min iniciales.",
        "Incremento exprés": "Versión rápida del incremento. Partiendo de 3 + 2 seg por jugada."
    };

    const icons = {
        "Clásica": <FaChessPawn className={styles.icon} style={{ color: '#552003' }} />,
        "Principiante": <FcApproval className={styles.icon} />,
        "Avanzado": <FcAlarmClock className={styles.icon} />,
        "Relámpago": <FcFlashOn className={styles.icon} />,
        "Incremento": <FcBullish className={styles.icon} />,
        "Incremento exprés": <FcRating className={styles.icon} />
    };


    return (
        <div className={styles.container}>
            {/* 🔹 Racha (Solo si el usuario ha iniciado sesión) */}
            <div className={styles.containerPartidas}>
                {user && (
                        <div className={styles.cardRacha}>
                            <div className={styles.racha}>
                                <FaFire className={styles.shield} style={{ color: '#ff8000' }} />
                                <span className={styles.text}>Tu racha</span>
                                <span className={styles.rachaCount}>{user.maxStreak || 0}</span>
                                <div className={styles.checks}>
                                    ✅ ✅ ✅ ✅ ❌
                                </div>
                            </div>
                        </div>
                )}
                
                   {['Clásica', 'Principiante', 'Avanzado', 'Relámpago', 'Incremento', 'Incremento exprés'].map((mode, index) => (
                    <div key={index} className={styles.card}>
                        <div className={styles.mode}>
                        {/* Icono */}
                        {icons[mode]}
                        <span className={styles.text}>{mode}</span>

                        {/* Icono de información */}
                        <div className={styles.iconoInfo}>
                            <IoIosInformationCircleOutline className={styles.iconoInfo} />
                            
                            {/* Descripción de la ventana emergente */}
                            <div
                            className={`${styles.infoPopup}`}
                            style={{
                                top: '100%',  // Esto coloca el popup justo debajo del icono
                                left: '0',    // Ajusta la posición según sea necesario
                            }}
                            >
                            <h3 className={styles.title}>{mode}:</h3> {/* Título */}
                            <p className={styles.description}>{descriptions[mode]}</p> {/* Descripción */}
                            </div>
                        </div>

                        <span className={styles.time}>
                            {index === 0 ? '10 min' : index === 1 ? '30 min' : index === 2 ? '5 min' : index === 3 ? '3 min' : index === 4 ? '15min + 10seg' : '3min + 2seg'}
                        </span>
                        <button className={styles.playButton}>Jugar</button>
                        </div>
                    </div>
                    ))}

            </div>
          {/* Buscar Partida */}
          <Link href="/comun/game">
            <button className={styles.searchButton}>
                    <FcSearch  className={styles.iconSearch} /> Buscar Partida
            </button>
          </Link>
        </div>
    );
}
