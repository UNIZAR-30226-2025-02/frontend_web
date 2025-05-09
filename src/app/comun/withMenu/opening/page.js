"use client";

import styles from './opening.module.css';
import { FcRules} from "react-icons/fc";import { useRouter } from 'next/navigation';

export default function OpeningPage() {
  const router = useRouter();

  const aperturas = [
    {
      id: 1,
      nombre: "Apertura Española",
      descripcion: "La Apertura Española es una de las más clásicas, enfocándose en el control del centro y la presión temprana sobre el caballo de c6, buscando ventajas a largo plazo.",
      movimientos: [
        { "e2 e4": "Controla el centro y abre líneas para el desarrollo." },
        { "e7 e5": "Iguala la lucha por el centro." },
        { "g1 f3": "Desarrolla el caballo y ataca el peón de e5." },
        { "b8 c6": "Defiende el peón de e5 y desarrolla una pieza." },
        { "f1 b5": "Clava el caballo en c6 y prepara el enroque." },
        { "FIN": "FIN" }
      ],
      imagen: "/aperturas/apertura_espanola.webp"
    },
    {
      id: 2,
      nombre: "Defensa Siciliana",
      descripcion: "La Defensa Siciliana ofrece a las negras una respuesta activa a 1.e4, generando un contrajuego dinámico y luchando por el control del flanco de dama desde el inicio.",
      movimientos: [
        { "e2 e4": "Controla el centro y libera la dama y el alfil." },
        { "c7 c5": "Busca un contrajuego rápido en el flanco de dama." },
        { "g1 f3": "Desarrolla el caballo y presiona en d4." },
        { "d7 d6": "Prepara el desarrollo del alfil y fortalece el centro." },
        { "d2 d4": "Rompe el centro para conseguir ventaja de espacio." },
        { "FIN": "FIN" }
      ],
      imagen: "/aperturas/defensa_siciliana.webp"
    },
    {
      id: 3,
      nombre: "Gambito de Dama",
      descripcion: "El Gambito de Dama es una apertura estratégica que ofrece un peón para lograr una mejor estructura central y un desarrollo rápido de las piezas blancas.",
      movimientos: [
        { "d2 d4": "Busca el control central y prepara el gambito." },
        { "d7 d5": "Iguala la lucha en el centro." },
        { "c2 c4": "Ofrece un peón a cambio de mejor desarrollo." },
        { "FIN": "FIN" }
      ],
      imagen: "/aperturas/gambito_dama.webp"
    },
    {
      id: 4,
      nombre: "Defensa Francesa",
      descripcion: "La Defensa Francesa es una apertura sólida y estratégica que busca desafiar el centro blanco de manera indirecta, preparando rupturas y estructuras resistentes.",
      movimientos: [
        { "e2 e4": "Controla el centro y facilita el desarrollo." },
        { "e7 e6": "Prepara d5 para desafiar el centro blanco." },
        { "d2 d4": "Refuerza el control central." },
        { "d7 d5": "Rompe el centro y plantea una estructura sólida." },
        { "FIN": "FIN" }
      ],
      imagen: "/aperturas/defensa_francesa.webp"
    },
    {
      id: 5,
      nombre: "Apertura Italiana",
      descripcion: "La Apertura Italiana busca un desarrollo rápido de las piezas y un ataque temprano hacia el punto débil f7, combinando simplicidad y agresividad en la apertura.",
      movimientos: [
        { "e2 e4": "Controla el centro y abre líneas para el desarrollo." },
        { "e7 e5": "Iguala la lucha por el centro." },
        { "g1 f3": "Desarrolla el caballo y ataca el peón de e5." },
        { "b8 c6": "Defiende el peón de e5 y desarrolla una pieza." },
        { "f1 c4": "Desarrolla el alfil a una casilla activa apuntando a f7." },
        { "FIN": "FIN" }
      ],
      imagen: "/aperturas/apertura_italiana.webp"
    },
  ];

  const handlePlay = (apertura) => {
    localStorage.setItem('aperturaSeleccionada', JSON.stringify(apertura));
    router.push('/comun/withMenu/opening/learn');
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        <FcRules style={{ fontSize: '45px' }} /> APERTURAS
      </h2>

      {aperturas.map((apertura, index) => (
        <div key={apertura.id} className={styles.aperturaBox}>
          <div className={styles.imagePlaceholder} onClick={() => handlePlay(apertura)}>
            <img src={apertura.imagen} alt={`Vista previa de ${apertura.nombre}`} className={styles.aperturaImage} />
            <span className={styles.playIcon}>▶</span> 
          </div>
          <div className={styles.aperturaContent}>
            <h3 className={styles.aperturaName}>{apertura.nombre}</h3>
            <p className={styles.aperturaDescription}>{apertura.descripcion}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
