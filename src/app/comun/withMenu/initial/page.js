import styles from './initial.module.css';
import Link from "next/link";
import { FcSearch, FcRating, FcFlashOn, FcAlarmClock, FcApproval, FcBullish } from "react-icons/fc";
import { FaChessPawn, FaFire   } from "react-icons/fa";


export default function InitialPage() {
    return (
        <div className={styles.container}>
          {/* Racha */}
            <div className={styles.containerPartidas}>
                <div className={styles.cardRacha}>
                    <div className={styles.racha}>
                    <FaFire  className={styles.shield}  style={{ color: '#ff8000'}}/>
                    <span className={styles.text}>Tu racha</span>
                    <span className={styles.rachaCount}>4</span>
                    <div className={styles.checks}>
                        ✅ ✅ ✅ ✅ ❌
                    </div>
                    </div>
                </div>
            
                {/* Clásica */}
                <div className={styles.card}>
                    <div className={styles.mode}>
                    <FaChessPawn  className={styles.icon} style={{ color: '#552003'}}/>
                    <span className={styles.text}>Clásica</span>
                    <span className={styles.time}>10 min</span>
                    <button className={styles.playButton}>Jugar</button>
                    </div>
                </div>

                <div className={styles.card}>
                    <div className={styles.mode}>
                    <FcApproval  className={styles.icon}/>
                    <span className={styles.text}> Principiante</span>
                    <span className={styles.time}>30 min</span>
                    <button className={styles.playButton}>Jugar</button>
                    </div>
                </div>

                <div className={styles.card}>
                    <div className={styles.mode}>
                    <FcAlarmClock className={styles.icon}/>
                    <span className={styles.text}> Avanzado</span>
                    <span className={styles.time}>5 min</span>
                    <button className={styles.playButton}>Jugar</button>
                    </div>
                </div>
            
                {/* Relámpago */}
                <div className={styles.card}>
                    <div className={styles.mode}>
                    <FcFlashOn  className={styles.icon}/>
                    <span className={styles.text}>Relámpago</span>
                    <span className={styles.time}>3 min</span>
                    <button className={styles.playButton}>Jugar</button>
                    </div>
                </div>     

                <div className={styles.card}>
                    <div className={styles.mode}>
                    <FcBullish className={styles.icon}/>
                    <span className={styles.text}> Incremento</span>
                    <span className={styles.time}>15min + 10seg</span>
                    <button className={styles.playButton}>Jugar</button>
                    </div>
                </div>

                <div className={styles.card}>
                    <div className={styles.mode}>
                    <FcRating className={styles.icon}/>
                    <span className={styles.text}> Incremento exprés</span>
                    <span className={styles.time}>3min + 2seg</span>
                    <button className={styles.playButton}>Jugar</button>
                    </div>
                </div>  
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
