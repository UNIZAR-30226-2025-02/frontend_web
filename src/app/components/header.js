"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./header.module.css"; // Importamos el módulo de estilos
import { VscAccount } from "react-icons/vsc";


export default function Header() {
  const [user, setUser] = useState(null);

  // Cargar usuario desde localStorage solo una vez
  useEffect(() => {
      // Verificamos si hay datos en localStorage antes de intentar parsearlos
      const storedUserData = localStorage.getItem("userData");
      if (storedUserData) {
          const parsedUser = JSON.parse(storedUserData);
          setUser(parsedUser.publicUser);
      } else {
          console.log("No se encontraron datos de usuario en localStorage.");
      }
  }, []);
  return (
    <header className={styles.header}>
      {/* Logo a la izquierda */}
      <div className={styles.logoNom}>
        <Link href="/comun/withMenu/initial">
          <img src="/logoNombre.png" alt="CheckmateX Logo" className={styles.logoImage2} />
        </Link>
      </div>    

      {/* Ícono central */}
      <div className={styles.logo}>
        <Link href="/comun/withMenu/initial">
          <img src="/logo.png" alt="CheckmateX Logo" className={styles.logoImage} />
        </Link>
      </div>

      {/* Perfil a la derecha */}
      <div className={styles.profile}>
      {user ? (
                    <Link href="/comun/withMenu/profile" className={styles.userProfile}>
                        <img 
                            src={user.FotoPerfil} 
                            alt="Avatar" 
                            className={styles.userAvatar} 
                        />
                        <span className={styles.userName}>{user.NombreUser}</span>
                    </Link>
                ) : (
                    <Link href="/auth/login">
                        <VscAccount className={styles.iconProfile} style={{ fontSize: '44px' }} />
                    </Link>
                )}
      </div>
    </header>
  );
}
