import { io } from "socket.io-client";
import { useRouter } from "next/navigation";

console.log("🚀 Intentando conectar al socket...");
//const router = useRouter();
const userId = localStorage.getItem("userData") ? JSON.parse(localStorage.getItem("userData")).id : null;
const token = localStorage.getItem("authToken");
//const socket = io("http://localhost:3000/", {
const socket = io("https://checkmatex-gkfda9h5bfb0gsed.spaincentral-01.azurewebsites.net/", {
  transports: ["websocket"], // ⚡ Usar WebSocket en lugar de polling
  reconnection: true, // 🔄 Habilitar reconexión automática
  reconnectionAttempts: 10, // 🔄 Intentar reconectar hasta 10 veces
  reconnectionDelay: 2000, // ⏳ Esperar 2s entre intentos de reconexión
  reconnectionDelayMax: 5000, // ⏳ Máximo 5s entre intentos
  timeout: 20000, // 🔥 Si no responde en 20s, intentar reconectar
  auth: { userId }, // ✅ Asegura que el usuario se autentica correctamente
  autoConnect: true, // 🔌 Conectar automáticamente
  query: {token: token},
});

socket.on("connect", () => {
  console.log("✅ Socket conectado con ID:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log(`❌ Socket desconectado. Razón: ${reason}`);
});

socket.on('force-logout', (data) => {
  console.log('Sesión abierta en otro dispositivo, cerrando sesion:', data.message);
  // Eliminamos el token y los datos del usuario
  localStorage.removeItem("authToken");
  localStorage.removeItem("userData");

  // Emitimos un evento personalizado para que un componente lo escuche
  const logoutEvent = new Event("forceLogout");
  window.dispatchEvent(logoutEvent);
  
  socket.disconnect();
});

export default socket;
