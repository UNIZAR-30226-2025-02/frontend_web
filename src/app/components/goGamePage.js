"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EscuchadorNavegacion() {
  const router = useRouter();

  useEffect(() => {
    const handleNavigate = (e) => {
      console.log("🔔 Vamos a cambiar de pantallas");
      const idPartida = e.detail.idPartida;
      if (idPartida) {
        console.log("🔔 Navegando a la partida con ID:", idPartida);
        router.push(`/comun/game?id=${idPartida}`);
      }
    };

    window.addEventListener("navigateToGame", handleNavigate);
    return () => {
      window.removeEventListener("navigateToGame", handleNavigate);
    };
  }, [router]);

  return null; // No renderiza nada, solo escucha
}
