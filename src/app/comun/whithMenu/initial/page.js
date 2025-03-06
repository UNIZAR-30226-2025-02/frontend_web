import styles from './initial.module.css';

export default function InitialPage() {
    return (
        <div className={styles.container}>
          {/* Racha */}
            <div className={styles.continerPartidas}>
                <div className={styles.card}>
                    <div className={styles.racha}>
                    <span className={styles.shield}>🛡️</span>
                    <span className={styles.rachaCount}>4</span>
                    <span className={styles.text}>Tu racha</span>
                    <div className={styles.checks}>
                        ✅ ✅ ✅ ✅ ❌
                    </div>
                    </div>
                </div>
            
                {/* Clásica */}
                <div className={styles.card}>
                    <div className={styles.mode}>
                    <span className={styles.icon}>⏰</span>
                    <span className={styles.text}>Clásica</span>
                    <span className={styles.time}>10 min</span>
                    <button className={styles.playButton}>Jugar</button>
                    </div>
                </div>
            
                {/* Relámpago */}
                <div className={styles.card}>
                    <div className={styles.mode}>
                    <span className={styles.icon}>⚡</span>
                    <span className={styles.text}>Relámpago</span>
                    <span className={styles.time}>3 min</span>
                    <button className={styles.playButton}>Jugar</button>
                    </div>
                </div>
            </div>
    
          {/* Buscar Partida */}
          <button className={styles.searchButton}>
            🔍 Buscar Partida
          </button>
        </div>
    );
}
