"use client";
import Link from "next/link";
import styles from "./menu.module.css";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  IoMdTrophy
} from "react-icons/io";
import {
  FcRules,
  FcConferenceCall,
  FcHome,
  FcSettings,
  FcPuzzle,
} from "react-icons/fc";

export default function Menu() {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [invitado, setInvitado] = useState(null);

  useEffect(() => {
    const storedInvitado = localStorage.getItem("soyInvitado");
    setInvitado(storedInvitado);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1000);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const renderLinks = () => (
    <ul className={styles.menu}>
      <li>
        <Link
          href="/comun/withMenu/initial"
          className={`${styles.menuItem} ${
            pathname === "/comun/withMenu/initial" ? styles.active : ""
          }`}
        >
          <FcHome className={styles.icon} /> Inicio
        </Link>
      </li>
      <li>
        <Link href="/comun/withMenu/ranking" className={styles.menuItem}>
          <IoMdTrophy className={styles.icon} style={{ color: "gold" }} /> Ranking
        </Link>
      </li>
      <li>
        <Link 
            href={invitado ? "/auth/login" : "/comun/withMenu/friend"}
            className={`${styles.menuItem} ${
              pathname === "/comun/withMenu/friend" && !invitado ? styles.active : ""
            }`}
        >
          <FcConferenceCall className={styles.icon} /> Social
        </Link>
      </li>
      <li>
        <Link href="/acerca" className={styles.menuItem}>
          <FcPuzzle className={styles.icon} /> Reglas
        </Link>
      </li>
      <li>
        <Link href="/contacto" className={styles.menuItem}>
          <FcRules className={styles.icon} /> Aperturas
        </Link>
      </li>
      <li>
        <Link href="/logout" className={styles.menuItem}>
          <FcSettings className={styles.icon} /> Ajustes
        </Link>
      </li>
    </ul>
  );

  return (
    <div className={styles.sidebarContainer}>
      {isMobile ? (
        <>
          <button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
            ☰
          </button>
          {menuOpen && <div className={styles.dropdownMenu}>{renderLinks()}</div>}
        </>
      ) : (
        <div className={styles.sidebar}>{renderLinks()}</div>
      )}
    </div>
  );
}
