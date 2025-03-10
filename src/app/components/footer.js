import styles from "./footer.module.css";
import { FaSquareXTwitter, FaInstagram, FaTiktok  } from "react-icons/fa6";


export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p>&copy; 2025 CheckmateX. Todos los derechos reservados.</p>
        <nav>
          <ul className={styles.links}>
            <li><FaTiktok className={styles.iconoTiktok}/></li>
            <li><FaInstagram className={styles.iconoInsta}/></li>
            <li><FaSquareXTwitter className={styles.iconoX}/></li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
