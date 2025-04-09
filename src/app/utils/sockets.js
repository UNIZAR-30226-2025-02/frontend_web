"use client"; 

import { io } from "socket.io-client";

let socket = null;

export const getSocket = () => {
  if (!socket && typeof window !== "undefined") {
    const userData = localStorage.getItem("userData");
    const token = localStorage.getItem("authToken");

    if (!token || !userData) {
      console.warn("⚠️ No se encontró token o userData en localStorage");
      return null;
    }

    const userId = JSON.parse(userData).id;

    console.log("🚀 Conectando al socket con:", { userId, token });

    socket = io("https://checkmatex-gkfda9h5bfb0gsed.spaincentral-01.azurewebsites.net/", {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
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
      
      setTimeout(() => {
        socket.disconnect();
        console.log("Socket desconectado tras 3 segundos");
      }, 3000);
    
    });

    socket.on("challengeSent", (data) => {
      console.log("🔔 Nueva partida de amigo recibida", data);
      if (!data?.idRetador) {
        console.warn("⚠️ El campo 'idRetador' no está presente en los datos recibidos:", data);
      }
      const friendId = data.idRetador;
      const notificationEventMatch = new CustomEvent("newFriendMacthRequest", {
        detail: { friendId: data.idRetador, mode: data.modo},
      }); 
       window.dispatchEvent(notificationEventMatch);
    });


    socket.on("friendRequest", (data) => {
      console.log("🔔 Nueva solicitud de amistad:", data);
      const friendId = data.idJugador;
      const notificationEvent = new CustomEvent("newFriendMacth", {
        detail: { friendId },
      }); 
       window.dispatchEvent(notificationEvent);
    });
  }
  return socket;
};
