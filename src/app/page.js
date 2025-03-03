import styles from "./page.module.css";

export default function HomePage() {
  return (
    <div className={styles.page}>
      {/* Sección de Título */}
      <div className={styles.textSection}>
        <h1>Bienvenido a CheckMateX</h1>
        <p>Juega, aprende y mejora tu ajedrez con jugadores de todo el mundo.</p>
      </div>

      {/* Imagen de Ajedrez */}
      <div className={styles.imageSection}>
        <img src="/logo.png" alt="Chess Illustration" />
      </div>

      <div className={styles.ctas}>
        <a href="/loginregister/login" className={`${styles.button} ${styles.primary}`}>
          Iniciar Sesión
        </a>
        <a href="/loginregister/register" className={`${styles.button} ${styles.secondary}`}>
          Registrarse
        </a>
      </div>

      {/* Contenedor del botón "Entrar como invitado" */}
      <div className={styles.guestContainer}>
        <a href="/guest" className={styles.guest}>Entrar como invitado</a>
      </div>
    </div>
  );
}
