"use client";

import { useEffect, useState, useMemo } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import styles from './rules.module.css';
import { FaScroll } from 'react-icons/fa';
import {FcPuzzle} from "react-icons/fc";
const rules = [
    {
        title: 'REGLA 1',
        text: 'El rey no puede moverse a una casilla atacada.',
        initialFen: '4k3/8/8/8/8/8/4R3/4K3 w - - 0 1',
        moves: [],
      },
      {
        title: 'REGLA 2',
        text: 'Los peones pueden avanzar dos casillas solo en su primer movimiento.',
        initialFen: '4k3/8/8/8/8/8/4P3/4K3 w - - 0 1',
        moves: ['e2e4'],
      },
      {
        title: 'REGLA 3',
        text: 'Los caballos pueden saltar sobre otras piezas.',
        initialFen: '4k3/8/8/3PPP2/2N1P3/8/8/4K3 w - - 0 1',
        moves: ['c4d6'],
      },
      {
        title: 'REGLA 4',
        text: 'El enroque solo es posible si el rey y la torre no se han movido.',
        initialFen: '4k3/8/8/8/8/8/8/R3K2R w KQ - 0 1',
        moves: ['e1g1'],
      },
      {
        title: 'REGLA 5',
        text: 'El jaque mate ocurre cuando el rey no puede escapar del ataque.',
        initialFen: '6k1/5ppp/8/8/8/8/5PPP/6RK w - - 0 1',
        moves: [],
      },
      {
        title: 'REGLA 6',
        text: 'La partida termina en tablas si no hay movimientos legales disponibles.',
        initialFen: '7k/5Q2/6K1/8/8/8/8/8 b - - 0 1',
        moves: [],
      },
      {
        title: 'REGLA 7',
        text: 'No se puede hacer un movimiento que deje al propio rey en jaque.',
        initialFen: '4k3/8/8/4r3/8/8/8/4K3 w - - 0 1',
        moves: [],
      },
      {
        title: 'REGLA 8',
        text: 'Si un peón alcanza la octava fila, debe ser promovido a otra pieza.',
        initialFen: '4k3/P7/8/8/8/8/8/4K3 w - - 0 1',
        moves: ['a7a8q'],
      },
      {
        title: 'REGLA 9',
        text: 'El enroque no es posible si el rey está en jaque o si pasa por una casilla atacada.',
        initialFen: '4k2r/8/8/8/8/8/8/R3K2R w KQk - 0 1',
        moves: [],
      },
      {
        title: 'REGLA 10',
        text: 'La captura al paso solo se puede realizar inmediatamente después de que un peón rival avance dos casillas.',
        initialFen: '4k3/8/8/8/3p4/8/4P3/4K3 w - - 0 1',
        moves: ['e2e4', 'd4e3'],
      },
      {
        title: 'REGLA 11',
        text: 'Si la misma posición ocurre tres veces en la partida, se puede reclamar tablas.',
        initialFen: '8/8/8/8/8/8/8/K6k w - - 0 1',
        moves: [],
      },
      {
        title: 'REGLA 12',
        text: 'El jugador que se queda sin tiempo pierde la partida.',
        initialFen: '4k3/8/8/8/8/8/8/4K3 w - - 0 1',
        moves: [],
      },
      {
        title: 'REGLA 13',
        text: 'Un jugador no puede hacer un movimiento que deje a su propio rey en jaque.',
        initialFen: '4k3/8/8/4r3/8/8/8/4K3 w - - 0 1',
        moves: [],
      },
      {
        title: 'REGLA 14',
        text: 'Si un jugador no tiene movimientos legales y su rey no está en jaque, la partida termina en tablas por ahogado.',
        initialFen: '7k/5Q2/6K1/8/8/8/8/8 b - - 0 1',
        moves: [],
      },
      {
        title: 'REGLA 15',
        text: 'La dama puede moverse cualquier cantidad de casillas en línea recta (horizontal, vertical o diagonal).',
        initialFen: '4k3/8/8/4Q3/8/8/8/4K3 w - - 0 1',
        moves: ['e5e8'],
      },
      {
        title: 'REGLA 16',
        text: 'La torre se mueve cualquier cantidad de casillas en línea recta (horizontal o vertical).',
        initialFen: '4k3/8/8/4R3/8/8/8/4K3 w - - 0 1',
        moves: ['e5e8'],
      },
      {
        title: 'REGLA 17',
        text: 'El alfil se mueve cualquier cantidad de casillas en línea diagonal.',
        initialFen: '4k3/8/8/4B3/8/8/8/4K3 w - - 0 1',
        moves: ['e5h8'],
      },
      {
        title: 'REGLA 18',
        text: 'El caballo se mueve en forma de "L" y puede saltar sobre otras piezas.',
        initialFen: '4k3/8/8/4N3/8/8/8/4K3 w - - 0 1',
        moves: ['e5d7'],
      },
      {
        title: 'REGLA 19',
        text: 'El peón captura en diagonal, no en línea recta.',
        initialFen: '4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1',
        moves: ['e5d6'],
      },
];

function RuleBoard({ initialFen, moves = [] }) {
    const history = useMemo(() => {
      const game = new Chess(initialFen);
      const steps = [game.fen()];
  
      for (const move of moves) {
        const result = game.move(move);
        if (result) steps.push(game.fen());
      }
  
      return steps;
    }, [initialFen, JSON.stringify(moves)]);
  
    const [step, setStep] = useState(0);
  
    useEffect(() => {
      setStep(0);
    }, [history]);
  
    const goBack = () => {
      if (step > 0) setStep(step - 1);
    };
  
    const goForward = () => {
      if (step < history.length - 1) setStep(step + 1);
    };
  
    return (
      <div className={styles.boardWrapper}>
        <Chessboard
          position={history[step]}
          arePiecesDraggable={false}
          boardWidth={180}
        />
        <div className={styles.boardControls}>
          <button onClick={goBack} disabled={step === 0}>⟵</button>
          <button onClick={goForward} disabled={step === history.length - 1}>⟶</button>
        </div>
      </div>
    );
  }
  

export default function RulesPage() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}><FcPuzzle className={styles.icon} /> REGLAS</h2>

      {rules.map((rule, index) => (
        <div key={index} className={styles.reglaBox}>
          <RuleBoard initialFen={rule.initialFen} move={rule.moves} />
          <div className={styles.reglaContent}>
            <h3 className={styles.reglaName}>{rule.title}</h3>
            <p className={styles.reglaDescription}>{rule.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
