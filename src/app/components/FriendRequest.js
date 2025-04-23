"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSocket } from "../utils/sockets"; // Asegúrate de que la ruta sea correcta
import styles from "./FriendRequest.module.css";

export default function FriendRequest() {
  const [show, setShow] = useState(false);
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [token, setToken] = useState(null);
  const [friend, setFriend] = useState([]);
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
    const handleFriendRequest = (event) => {
      console.log("🔔 Nueva solicitud de amistad:", event.detail);
      const { friendId } = event.detail;
      console.log("🧾 ID del amigo recibido en evento:", friendId);
      setFriend(friendId);
      setShow(true); // Mostrar el modal
    };
  
    window.addEventListener("newFriendRequest", handleFriendRequest);
    return () => window.removeEventListener("newFriendRequest", handleFriendRequest);
  }, []);
  
  

  const handleAceptar = () => {
    setShow(false);
    socket.emit("accept-request", { idJugador: friend , idAmigo: user.id });
    window.location.reload();
  };

  const handleRechazar = () => {
    setShow(false);
    socket.emit("reject-request", { idJugador: user.id , idAmigo: friend });
  };

  if (!show) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modalBox}>
        <h2>Solicitud de amistad</h2>
        <div className={styles.botones}>
          <button onClick={handleAceptar}><strong>Aceptar</strong></button>
          <button onClick={handleRechazar}><strong>Rechazar</strong></button>
        </div>
      </div>
    </div>
  );
}
