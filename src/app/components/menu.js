import Link from "next/link";
import styles from "./menu.module.css"; // Importamos el módulo de estilos
import { FaHome, FaBookOpen, FaCogs, FaInfoCircle, FaEnvelope, FaSignOutAlt, FaUserFriends  } from 'react-icons/fa'; // Ejemplo de iconos
import { IoMdTrophy } from "react-icons/io";
import { FcRules, FcConferenceCall, FcHome , FcSettings ,FcPuzzle   } from "react-icons/fc";


export default function Menu() {
  return (
    <div className={styles.sidebar}>
      <ul className={styles.menu}>
        <li>
          <Link href="/comun/withMenu/initial" className={styles.menuItem}>
            <FcHome  className={styles.icon} /> Inicio
          </Link>
        </li>
        <li>
          <Link href="/perfil" className={styles.menuItem}>
            <IoMdTrophy className={styles.icon} style={{ color: "gold" }} /> Ranking
          </Link>
        </li>
        <li>
          <Link href="/ajustes" className={styles.menuItem}>
            <FcConferenceCall  className={styles.icon} /> Social
          </Link>
        </li>
        <li>
          <Link href="/acerca" className={styles.menuItem}>
            <FcPuzzle  className={styles.icon} /> Reglas
          </Link>
        </li>
        <li>
          <Link href="/contacto" className={styles.menuItem}>
            <FcRules className={styles.icon} /> Aperturas
          </Link>
        </li>
        <li>
          <Link href="/logout" className={styles.menuItem}>
            <FcSettings  className={styles.icon} /> Ajustes
          </Link>
        </li>
      </ul>
    </div>
  );
}
