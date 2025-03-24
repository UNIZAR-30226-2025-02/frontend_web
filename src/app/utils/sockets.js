import { io } from "socket.io-client";
import { useRouter } from "next/navigation";

console.log("🚀 Intentando conectar al socket...");
//const router = useRouter();
const userId = localStorage.getItem("userData") ? JSON.parse(localStorage.getItem("userData")).id : null;
const token = localStorage.getItem("authToken");
//const socket = io("http://localhost:3000/", {
let socket = null;
  export const getSocket = (token) => {
    if (!socket) {
      console.log("🚀 Conectando al socket con:", { userId, token });
  
      socket = io("https://checkmatex-gkfda9h5bfb0gsed.spaincentral-01.azurewebsites.net/", {
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 2000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
        //auth: { userId },
        query: { token },
        autoConnect: true,
      });
  
      socket.on("connect", () => {
        console.log("✅ Socket conectado con ID:", socket.id);
      });
  
      socket.on("disconnect", (reason) => {
        console.log(`❌ Socket desconectado. Razón: ${reason}`);
      });
  
      socket.on("force-logout", (data) => {
        console.log("⚠️ Sesión abierta en otro dispositivo:", data.message);
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
  
        const logoutEvent = new Event("forceLogout");
        window.dispatchEvent(logoutEvent);
        
        socket.disconnect();
      });
    }
  
    return socket;
  };
