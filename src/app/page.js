"use client";
import { motion } from "framer-motion";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import {getSocket} from "../app/utils/sockets"; 
import { FaSquareXTwitter, FaInstagram, FaTiktok  } from "react-icons/fa6";
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;


  export default function Home() {
    const router = useRouter();

    const handleInvitado = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/crearInvitado`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });
        const data = await response.json();  // Parseamos la respuesta como JSON
        //console.log("Respuesta del servidor:", data); // Debug para ver la respuesta exacta
        const token = data.accessToken;
            
        if (!response.ok) {
            //console.log("Error en el login de invitado:", data);
            throw new Error(data.message || data.error || "Error desconocido en el login");
        }
        if (token) {
          //console.log('Login exitoso. Token recibido:', token);
          localStorage.setItem("authToken", token);
            localStorage.setItem("soyInvitado", "si");
          localStorage.setItem("userData", JSON.stringify(data));
          const socket = getSocket(token);
          router.push("/comun/withMenu/initial");
        } else {
          throw new Error("⚠️ Respuesta inesperada del servidor");
        }
      } catch (error) {
      //console.log("Error durante el proceso de login:", error.message); // Mostramos solo el mensaje
      }
    };
  
    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <img src="/logoNombre.png" alt="Logo" className={styles.logo} />
          <div>
            <a href="/auth/login" className={styles.btn}>Iniciar sesión</a>
            <a href="/auth/register" className={styles.btn}>Registrarse</a>
          </div>
        </header>
  
        <section className={styles.hero}>
          <div className={styles.heroText}>
            <h1>CheckMateX</h1>
            <p>
            Tu nueva forma de jugar ajedrez online. Rápido, moderno y con análisis en tiempo real.<br /><br />
            Si eres principiante, aprende las reglas y las mejores aperturas para mejorar tu nivel y desafiar a tus amigos.<br />
            Con esta aplicación no tienes techo, observa los rankings de los distintos modos de juego y lucha por llegar a lo más alto,
            analizando tus errores y tus mejores jugadas.<br /><br />
            ¡Es hora de pasarlo bien jugando al ajedrez!
          </p>

            <button className={styles.primaryBtn} onClick={handleInvitado}><strong>Probar como invitado</strong></button>
          </div>
          <img src="/logo.png" alt="Vista de la app" className={styles.heroImg} />
        </section>
  
        <section className={styles.features}>
          <div className={styles.feature}>
            <h3>Partidas en tiempo real</h3>
            <p>Juega con amigos o rivales aleatorios en partidas de distintos modos, desde los modos mas clásicos a los mas innovadores.</p>
            <img src="/partidaChat.png" alt="Jugar" />
          </div>
          <div className={styles.feature}>
            <h3>Ranking global</h3>
            <p>Sube en la clasificación ganando partidas y comprueba quienes son los mejores en cada modo de juego.</p>
            <img src="/ranking.png" alt="Ranking" />
          </div>
          <div className={styles.feature}>
            <h3>Análisis automático</h3>
            <p>Revisa tus jugadas, errores y mejores movimientos después de cada partida. Disfruta de tus mejores jugadas!</p>
            <img src="/analisis.png" alt="Análisis" />
          </div>
          <div className={styles.feature}>
            <h3>Gestión de amigos</h3>
            <p>Añade y elimina tus amigos fácilmente desde tu perfil para poder desafiarlos a partidas.</p>
            <img src="/amigos.png" alt="Amigos" />
          </div>
        </section>
  
        <footer className={styles.footer}>
          <p>© 2025 CheckMateX. Todos los derechos reservados.</p>
          <nav>
          <ul className={styles.links}>
            <li><FaTiktok className={styles.iconoTiktok}/></li>
            <li><FaInstagram className={styles.iconoInsta}/></li>
            <li><FaSquareXTwitter className={styles.iconoX}/></li>
          </ul>
        </nav>
        </footer>
      </div>
    );
  }