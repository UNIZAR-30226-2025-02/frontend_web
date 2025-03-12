"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./header.module.css"; // Importamos el módulo de estilos
import { VscAccount } from "react-icons/vsc";


export default function Header() {
  const user = JSON.parse(localStorage.getItem("userData")); // Obtener usuario desde localStorage y parsearlo a objeto

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
                            src={user.avatar || "/default-avatar.png"} 
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
