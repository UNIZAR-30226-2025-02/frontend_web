"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./ForceLogoutScreen.module.css";

export default function ForceLogoutModal() {
  const [show, setShow] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleForceLogout = (data) => {
      console.log("⚠️ Evento force-logout recibido", data);
      setShow(true);
    };

    window.addEventListener("forceLogout", handleForceLogout);
    return () => {
      window.removeEventListener("forceLogout", handleForceLogout);
    };
  }, []);

  useEffect(() => {
    if (!show && redirect) {
      router.push("/");
    }
  }, [show, redirect, router]);

  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden"; // Desactiva scroll
    } else {
      document.body.style.overflow = "auto"; // Reactiva scroll
    }
  
    return () => {
      document.body.style.overflow = "auto"; // Cleanup si el componente se desmonta
    };
  }, [show]);
  

  const handleAccept = () => {
    setShow(false);
    setRedirect(true);
  };

  if (!show) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modalBox}>
        <h2>Sesión terminada</h2>
        <p>Se ha iniciado sesión en otro dispositivo</p>
        <button onClick={handleAccept}><strong>Aceptar</strong></button>
      </div>
    </div>
  );
}
