"use client";
import { motion } from "framer-motion";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import {getSocket} from "../app/utils/sockets"; 

  export default function Home() {
    const router = useRouter();

    const handleInvitado = async () => {
      try {
        const response = await fetch("https://checkmatex-gkfda9h5bfb0gsed.spaincentral-01.azurewebsites.net/crearInvitado", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });
        const data = await response.json();  // Parseamos la respuesta como JSON
        console.log("Respuesta del servidor:", data); // Debug para ver la respuesta exacta
        const token = data.accessToken;
            
        if (!response.ok) {
            console.log("Error en el login de invitado:", data);
            throw new Error(data.message || data.error || "Error desconocido en el login");
        }
        if (token) {
          console.log('Login exitoso. Token recibido:', token);
          localStorage.setItem("authToken", token);
            localStorage.setItem("soyInvitado", "si");
          localStorage.setItem("userData", JSON.stringify(data));
          const socket = getSocket(token);
          router.push("/comun/withMenu/initial");
        } else {
          throw new Error("⚠️ Respuesta inesperada del servidor");
        }
      } catch (error) {
      console.log("Error durante el proceso de login:", error.message); // Mostramos solo el mensaje
      }
    };

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
          <button onClick={handleInvitado} className={styles.guest}>
            Entrar como invitado
          </button>
        </div>
      </div>
    );
}
