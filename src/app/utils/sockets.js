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
      
      socket.disconnect();
    });
  }

  return socket;
};
