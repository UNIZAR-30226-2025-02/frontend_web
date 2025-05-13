"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./header.module.css"; // Importamos el módulo de estilos
import { VscAccount } from "react-icons/vsc";
import { usePathname } from "next/navigation";



export default function Header() {
  const [user, setUser] = useState(null);
  const [invitado, setInvitado] = useState(null);
  const [isGameRoute, SetIsGameRoute] = useState(null);
  const pathname = usePathname();
  // Cargar usuario desde localStorage solo una vez
  useEffect(() => {
      // Verificamos si hay datos en localStorage antes de intentar parsearlos
      const storedUserData = localStorage.getItem("userData");
      const storedInvitado = localStorage.getItem("soyInvitado");
      
      if (storedUserData) {
          const parsedUser = JSON.parse(storedUserData);
          setUser(parsedUser.publicUser);
          setInvitado(storedInvitado);
      } else {
          //console.log("No se encontraron datos de usuario en localStorage.");
      }
  }, []);
  
  useEffect(() => {
    const isGameRoutebool = pathname.startsWith("/comun/game");
    SetIsGameRoute(isGameRoutebool);  
}, [pathname]);

  return (
    <header className={styles.header}>
      {/* Logo a la izquierda */}
      <div className={styles.logoNom}>
      {!isGameRoute ? (
        <Link href="/comun/withMenu/initial">
          <img src="/logoNombre.png" alt="CheckmateX Logo" className={styles.logoImage2} />
        </Link>
      ) : (
        <span className={styles.logoImage2}>
          <img src="/logoNombre.png" alt="CheckmateX Logo" className={styles.logoImage2} />
        </span>
      )}
      </div>    

      {/* Ícono central */}
      <div className={styles.logo}>
        {!isGameRoute ? (
        <Link href="/comun/withMenu/initial">
          <img src="/logo.png" alt="CheckmateX Logo" className={styles.logoImage} />
        </Link>
      ) : (
        <span className={styles.logoImage}>
          <img src="/logo.png" alt="CheckmateX Logo" className={styles.logoImage} />
        </span>
      )}
      </div>

      {/* Perfil a la derecha */}
      <div className={styles.profile}>
      {invitado === null ? (
      isGameRoute ? (
        <div className={styles.userProfile}>
          <img 
            src={`/fotosPerfilWebp/${user?.FotoPerfil}`}
            alt="Avatar" 
            className={styles.userAvatar} 
          />
          <span className={styles.userName}>{user?.NombreUser}</span>
        </div>
      ) : (
        <Link href="/comun/withMenu/profile" className={styles.userProfile}>
          <img 
            src={`/fotosPerfilWebp/${user?.FotoPerfil}`}
            alt="Avatar" 
            className={styles.userAvatar} 
          />
          <span className={styles.userName}>{user?.NombreUser}</span>
        </Link>
      )
    ) : (
      isGameRoute ? (
        <div className={styles.userProfile}>
          <VscAccount className={styles.iconProfile} style={{ fontSize: '55px' }} />
        </div>
      ) : (
        <Link href="/auth/login">
          <VscAccount className={styles.iconProfile} style={{ fontSize: '55px' }} />
        </Link>
      )
    )}
      </div>
    </header>
  );
}
