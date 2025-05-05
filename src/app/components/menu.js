"use client";
import Link from "next/link";
import styles from "./menu.module.css";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {getSocket} from "../utils/sockets"; 
import {
  IoMdTrophy
} from "react-icons/io";
import {
  FcRules,
  FcConferenceCall,
  FcHome,
  FcSettings,
  FcPuzzle,
} from "react-icons/fc";
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function Menu() {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [invitado, setInvitado] = useState(null);
  const [token, setToken] = useState(null);
  const [socket, setSocket] = useState(null);
  const [user, setUser] = useState(null);
  const router = useRouter(); 
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Asegurarse de que estamos en el navegador
      const storedToken = localStorage.getItem("authToken");
      setToken(storedToken);
      
      // Crear la conexión del socket solo cuando el token esté disponible
      const socketInstance = getSocket();
      setSocket(socketInstance);

      // Conectar el socket solo si no está conectado
      socketInstance.connect();

      return () => {
        console.log("🔕 Manteniendo el socket activo al cambiar de pantalla...");
        //socketInstance.disconnect(); // Cerrar la conexión solo si el usuario sale completamente de la aplicación
      };
    }
  }, []);


// Cargar usuario desde localStorage solo una vez
useEffect(() => {
    // Verificamos si hay datos en localStorage antes de intentar parsearlos
    const storedUserData = localStorage.getItem("userData");
    console.log("El usuario del perfil es: ", storedUserData);
    if (storedUserData) {
        const parsedUser = JSON.parse(storedUserData);
        setUser(parsedUser.publicUser);
    } else {
        console.log("No se encontraron datos de usuario en localStorage.");
    }
}, []);

  useEffect(() => {
    const storedInvitado = localStorage.getItem("soyInvitado");
    setInvitado(storedInvitado);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1000);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    console.log("Ejecutando handleLogout");
    if (!user) {
        console.log("No hay usuario para cerrar sesión");
        return;
    }

    try {
        console.log("Enviando solicitud de logout al backend");
        console.log("El user es", user.NombreUser);
       // const response = await fetch("http://localhost:3000/logout", {
       const response = await fetch(`${BACKEND_URL}/logout`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ NombreUser: user.NombreUser }),
        });

        console.log("Respuesta del servidor recibida:", response);
        
        localStorage.removeItem("userData");
        localStorage.removeItem("authToken");
        localStorage.removeItem("time");
        console.log("Datos del usuario eliminados de localStorage");
        
        if (!response.ok) {
            console.error("Error al cerrar sesión en el backend");
        } else {
            socket.disconnect();
            router.replace("/");
            console.log("Redirigiendo a la página inicial");
        }
    } catch (error) {
        console.error("Error en la solicitud de logout", error);
    }
};


  const renderLinks = () => (
    <ul className={styles.menu}>
      <li>
        <Link
          href="/comun/withMenu/initial"
          className={`${styles.menuItem} ${
            pathname === "/comun/withMenu/initial" ? styles.active : ""
          }`}
        >
          <FcHome className={styles.icon} /> Inicio
        </Link>
      </li>
      <li>
        <Link href="/comun/withMenu/ranking" className={styles.menuItem}>
          <IoMdTrophy className={styles.icon} style={{ color: "gold" }} /> Ranking
        </Link>
      </li>
      <li>
        <Link 
            href={invitado ? "/auth/login" : "/comun/withMenu/friend"}
            className={`${styles.menuItem} ${
              pathname === "/comun/withMenu/friend" && !invitado ? styles.active : ""
            }`}
        >
          <FcConferenceCall className={styles.icon} /> Social
        </Link>
      </li>
      <li>
        <Link href="/comun/withMenu/rules" className={styles.menuItem}>
          <FcPuzzle className={styles.icon} /> Reglas
        </Link>
      </li>
      <li>
        <Link href="/comun/withMenu/opening" className={styles.menuItem}>
          <FcRules className={styles.icon} /> Aperturas
        </Link>
      </li>
      <li onClick={() => setShowSettings(!showSettings)}>
          <div className={`${styles.menuItem} ${showSettings ? styles.active : ""}`}>
          <FcSettings className={styles.icon} /> Ajustes
          </div>
          {showSettings && (
            <div className={styles.popup}>
              <div className={styles.triangle}></div>
              <ul className={styles.popupList}>
                <li>
                <button
                  onClick={() => router.push("/comun/withMenu/profile")}
                  className={styles.popupItem}>
                  👤 <strong>Perfil</strong>
                  </button>          
                </li>
                <li>
                  <button onClick={handleLogout} className={styles.popupItem}>🔓 <strong>Cerrar sesión</strong></button>
                </li>
              </ul>
            </div>
          )}
      </li>
    </ul>
  );

  return (
    <div className={styles.sidebarContainer}>
      {isMobile ? (
        <>
          <button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
            ☰
          </button>
          {menuOpen && <div className={styles.dropdownMenu}>{renderLinks()}</div>}
        </>
      ) : (
        <div className={styles.sidebar}>{renderLinks()}</div>
      )}
    </div>
  );
}
