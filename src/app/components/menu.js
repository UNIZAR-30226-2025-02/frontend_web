import Link from "next/link";
import styles from "./menu.module.css"; // Importamos el módulo de estilos
import { FaHome, FaUserAlt, FaCogs, FaInfoCircle, FaEnvelope, FaSignOutAlt } from 'react-icons/fa'; // Ejemplo de iconos

export default function Menu() {
  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        <h2>MiApp</h2> {/* Logo de la aplicación */}
      </div>
      <ul className={styles.menu}>
        <li>
          <Link href="/home" className={styles.menuItem}>
            <FaHome className={styles.icon} /> Inicio
          </Link>
        </li>
        <li>
          <Link href="/perfil" className={styles.menuItem}>
            <FaUserAlt className={styles.icon} /> Perfil
          </Link>
        </li>
        <li>
          <Link href="/ajustes" className={styles.menuItem}>
            <FaCogs className={styles.icon} /> Ajustes
          </Link>
        </li>
        <li>
          <Link href="/acerca" className={styles.menuItem}>
            <FaInfoCircle className={styles.icon} /> Acerca
          </Link>
        </li>
        <li>
          <Link href="/contacto" className={styles.menuItem}>
            <FaEnvelope className={styles.icon} /> Contacto
          </Link>
        </li>
        <li>
          <Link href="/logout" className={styles.menuItem}>
            <FaSignOutAlt className={styles.icon} /> Salir
          </Link>
        </li>
      </ul>
    </div>
  );
}
