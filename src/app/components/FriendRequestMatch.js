"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSocket } from "../utils/sockets"; // Asegúrate de que la ruta sea correcta
import styles from "./FriendRequestMatch.module.css";

export default function FriendRequestMatch() {
  const [show, setShow] = useState(false);
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [token, setToken] = useState(null);
  const [friend, setFriend] = useState([]);
  const [modo, setModo] = useState([]);
  const router = useRouter();

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
      if (storedUserData) {
          const parsedUser = JSON.parse(storedUserData);
          const currentUser = parsedUser.publicUser;
  
          setUser(currentUser);
      } else {
          console.log("No se encontraron datos de usuario en localStorage.");
      }
    }, []);

  useEffect(() => {
    const handleFriendRequestMatch = (event) => {
      console.log("🔔 Nueva solicitud de partida:", event.detail);
      const { friendId } = event.detail;
      const { mode } = event.detail;
      console.log("🧾 ID del amigo recibido en evento:", friendId);
      console.log("🧾 Modo de juego recibido en evento:", mode);
      setFriend(friendId);
      setModo(mode);
      setShow(true); // Mostrar el modal
    };
  
    window.addEventListener("newFriendMacthRequest", handleFriendRequestMatch);
    return () => window.removeEventListener("newFriendMacthRequest", handleFriendRequestMatch);
  }, []);
  
  

  const handleAceptar = () => {
    setShow(false);
    console.log("🎮Aceptando partida con ID:", user.id, "y amigo con ID:", friend);
    socket.emit("accept-challenge", { idRetado : user.id , idRetador : friend , modo: modo });
  };

  const handleRechazar = () => {
    setShow(false);
    console.log("🎮❌Rechazando partida con ID:", user.id, "y amigo con ID:", friend);
    socket.emit("reject-challenge", { idRetado : user.id , idRetador : friend , modo: modo });
  };

  if (!show) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modalBox}>
        <h2>Solicitud de partida</h2>
        <div className={styles.botones}>
          <button onClick={handleAceptar}><strong>Aceptar</strong></button>
          <button onClick={handleRechazar}><strong>Rechazar</strong></button>
        </div>
      </div>
    </div>
  );
}
