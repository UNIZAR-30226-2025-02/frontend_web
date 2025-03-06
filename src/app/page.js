"use client";
import { motion } from "framer-motion";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <div className={styles.page}>
      {/* Fondo Animado */}
      <motion.div
        className={styles.animatedBackground}
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

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
        <a href="/auth/login" className={`${styles.button} ${styles.primary}`}>
          Iniciar Sesión
        </a>
        <a href="/auth/register" className={`${styles.button} ${styles.secondary}`}>
          Registrarse
        </a>
      </div>

      {/* Contenedor del botón "Entrar como invitado" */}
      <div className={styles.guestContainer}>
        <a href="/comun/withMenu/initial" className={styles.guest}>Entrar como invitado</a>
      </div>
    </div>
  );
}
