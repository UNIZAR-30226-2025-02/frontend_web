import Link from "next/link";
import styles from "./header.module.css"; // Importamos el módulo de estilos
import { VscAccount } from "react-icons/vsc";


export default function header() {
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
        <Link href="/auth/login">
         <VscAccount className={styles.iconProfile} style={{ fontSize: '44px' }} />
        </Link>
      </div>
    </header>
  );
}
