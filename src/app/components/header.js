import Link from "next/link";
import styles from "./header.module.css"; // Importamos el módulo de estilos
import { VscAccount } from "react-icons/vsc";


export default function header() {
  return (
    <header className={styles.header}>
      {/* Logo a la izquierda */}
      <div className={styles.logoNom}>
        <img src="/logoNombre.png" alt="CheckmateX Logo" className={styles.logoImage2} />
      </div>    

      {/* Ícono central */}
      <div className={styles.logo}>
         <img src="/logo.png" alt="CheckmateX Logo" className={styles.logoImage} />
      </div>

      {/* Perfil a la derecha */}
      <div className={styles.profile}>
        <Link href="/perfil">
         <VscAccount style={{ fontSize: '40px' }} />
        </Link>
      </div>
    </header>
  );
}
