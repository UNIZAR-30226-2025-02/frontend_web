import { io } from "socket.io-client";

console.log("🚀 Intentando conectar al socket...");

const socket = io("http://localhost:3000", {
  transports: ["websocket"], // Obliga a usar WebSockets
  autoConnect: true, // Se conecta automáticamente
  reconnectionAttempts: 5, // Intenta reconectar
});

socket.on("connect", () => {
  console.log("✅ Socket conectado con ID:", socket.id);
});

socket.on("disconnect", () => {
  console.log("❌ Socket desconectado");
});

export default socket;
