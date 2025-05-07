"use client"; 

import { io } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

let socket = null;


export const getSocket = () => {
  if (!socket && typeof window !== "undefined") {
    const userData = localStorage.getItem("userData");
    const token = localStorage.getItem("authToken");

    if (!token || !userData) {
      console.warn("⚠️ No se encontró token o userData en localStorage");
      return null;
    }
    const user = JSON.parse(userData); // 👈 guardas el usuario aquí

    const userId = JSON.parse(userData).id;

    console.log("🚀 Conectando al socket con:", { userId, token });

    socket = io(SOCKET_URL, {
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
        detail: { friendId: data.idRetador, mode: data.modo, nombreAmigo: data.nombreRetador },
      }); 
       window.dispatchEvent(notificationEventMatch);
    });


    socket.on("friendRequest", (data) => {
      console.log("🔔 Nueva solicitud de amistad:", data);
      const friendId = data.idJugador;
      const notificationEvent = new CustomEvent("newFriendRequest", {
        detail: { friendId, nombreJugador: data.nombreJugador },
      }); 
       window.dispatchEvent(notificationEvent);
    });

    socket.on('game-ready', (data) => {
      const userData = localStorage.getItem("userData");

      if (!userData) {
        console.warn("⚠️ No se encontró token o userData en localStorage");
        return null;
      }
      console.log("🔔 En user data tenemos:", userData);
      const publicUser = JSON.parse(userData); // ✅ Aquí tienes el objeto completo del usuario
      const user = publicUser.publicUser; // ✅ Aquí tienes el objeto completo del usuario 
      console.log("🔔 En user  tenemos:", publicUser);   
      console.log("🔔 Recibo el game-ready:", data);
      console.log("🟢 Partida encontrada con ID:", data.idPartida);
      console.log("Estoy buscando partida", user);
      console.log("he encontrado partida", user.NombreUser); 
      localStorage.setItem("tipoReto", data.tipo); // Guardar el ID de la partida en localStorage
      const idPartidaCopy = data.idPartida; 
      localStorage.setItem("idPartida", idPartidaCopy);

  });
  if (!window.location.pathname.startsWith("/comun/game")) {

  console.log("🎧 Ahora escuchando evento 'color'...");
  socket.on("color", (data) => {
      const userData = localStorage.getItem("userData");

      if (!userData) {
        console.warn("⚠️ No se encontró token o userData en localStorage");
        return null;
      }
      const publicUser = JSON.parse(userData); // ✅ Aquí tienes el objeto completo del usuario
      const user = publicUser.publicUser; // ✅ Aquí tienes el objeto completo del usuario
      console.log("🔔 Recibo el color:", data);
      console.log("🎨 Recibido evento 'color' con datos:", data);

      if (!data || !data.jugadores) {
          console.error("❌ No se recibió información válida de colores.");
          return;
      }

      console.log("Buscando color para el jugador:", user);
      const jugadorActual = data.jugadores.find(jugador => jugador.id === user.id);
      const jugadorRival = data.jugadores.find(jugador => jugador.id !== user.id);

      if (jugadorActual && jugadorRival) {
        localStorage.setItem("colorJug",jugadorActual.color);
        console.log(`✅ Color asignado a ${user.NombreUser}: ${jugadorActual.color}`);
        localStorage.setItem("colorJug",jugadorActual.color);
        console.log("Guardo id rival: ", jugadorRival.id);
        localStorage.setItem("idRival", jugadorRival.id);
        if(jugadorActual.color === "black"){
            localStorage.setItem("eloRival", jugadorRival.eloW);
            localStorage.setItem("nombreRival", jugadorRival.nombreW);
            localStorage.setItem("eloJug", jugadorActual.eloB);
            localStorage.setItem("fotoRival", jugadorRival.fotoBlancas)
        } else {
            localStorage.setItem("eloRival", jugadorRival.eloB);
            localStorage.setItem("nombreRival", jugadorRival.nombreB);
            localStorage.setItem("eloJug", jugadorActual.eloW);
            localStorage.setItem("fotoRival", jugadorRival.fotoNegras)
        }
      } else {
        console.error("❌ No se encontró información de jugadores válida. Juagador actual:", jugadorActual, "Jugador rival:", jugadorRival);
      }
      const idPartidaCopy =  localStorage.getItem("idPartida");
      const navigateEvent = new CustomEvent("navigateToGame", {
        detail: { idPartida: idPartidaCopy },
      });
      window.dispatchEvent(navigateEvent);
      //window.location.href = `/comun/game?id=${idPartidaCopy}`; // recarga limpia
      //router.refresh();
  });
  } else {
    console.log("🔔 Ignorando evento 'color' porque ya estamos en la página de juego.");
  }
  }
  return socket;
};
