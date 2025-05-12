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
        text: 'Los peones pueden avanzar dos casillas solo en su primer movimiento, luego avanzan de uno en uno.',
        initialFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        moves: ['e2e4', 'c7c5', 'e4e5'],
      },
      {
        title: 'REGLA 2',
        text: 'El peón captura en diagonal, no en línea recta.',
        initialFen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1',
        moves: ['d2d4','e5d4'],
      },
      {
        title: 'REGLA 3',
        text: 'Si un peón alcanza la octava fila, debe ser promovido a otra pieza.',
        initialFen: '4k3/P7/8/8/8/8/8/4K3 w - - 0 1',
        moves: ['a7a8q'],
      },
      {
        title: 'REGLA 4',
        text: 'El caballo se mueve en forma de "L" y puede saltar sobre otras piezas.',
        initialFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        moves: ['g1f3','e7e5','f3e5'],
      },
      {
        title: 'REGLA 5',
        text: 'El alfil se mueve cualquier cantidad de casillas en línea diagonal.',
        initialFen: '4k3/8/8/4B3/8/8/8/4K3 w - - 0 1',
        moves: ['e5h8'],
      },
      {
        title: 'REGLA 6',
        text: 'La torre se mueve cualquier cantidad de casillas en línea recta (horizontal o vertical).',
        initialFen: '4k3/8/8/4R3/8/8/8/4K3 w - - 0 1',
        moves: ['e5b5','e8f8','b5b8'],
      },
      {
        title: 'REGLA 7',
        text: 'La dama puede moverse cualquier cantidad de casillas en línea recta (horizontal, vertical o diagonal).',
        initialFen: '4k3/8/8/4Q3/8/8/8/4K3 w - - 0 1',
        moves: ['e5b2','e8f8','b2b7','f8g8','b7f7'],
      },
      {
        title: 'REGLA 8',
        text: 'La captura al paso es un movimiento que consiste en comer el peón rival como en la jugada que se muestra. Pero solo se puede hacer inmediatamente después de que avance dos casillas.',
        initialFen: '4k3/8/8/8/3p4/8/4P3/4K3 w - - 0 1',
        moves: ['e2e4', 'd4e3'],
      },
      {
        title: 'REGLA 9',
        text: 'El enroque es un movimiento que consiste en cambiar la posición del rey y la torre. Además, solo es posible hacerlo si el rey y la torre no se han movido.',
        initialFen: '4k3/8/8/8/8/8/8/R3K2R w KQ - 0 1',
        moves: ['e1g1'],
      },
      {
        title: 'REGLA 10',
        text: 'El enroque no es posible si el rey está en jaque o si pasa por una casilla atacada.',
        initialFen: '3k2r1/8/8/8/8/8/8/4K2R b K - 0 1',
        moves: [],
      },
      {
        title: 'REGLA 11',
        text: 'El jaque mate ocurre cuando el rey no puede escapar del ataque hacia ninguna casilla.',
        initialFen: 'rnbqkbnr/pppp1ppp/8/4p3/5PP1/8/PPPPP2P/RNBQKBNR b KQkq - 0 2',
        moves: ['d8h4'],
      },
      {
        title: 'REGLA 12',
        text: 'Si un jugador no tiene movimientos legales y su rey no está en jaque, la partida termina en tablas por ahogado.',
        initialFen: '7k/5Q2/5K2/8/8/8/8/8 b - - 0 1',
        moves: [],
      },
      {
        title: 'REGLA 13',
        text: 'Un jugador no puede hacer un movimiento que deje a su propio rey en jaque.',
        initialFen: '4k3/8/8/4r3/8/8/8/4K3 w - - 0 1',
        moves: ['e1f1','e5f5','f1e1'],
      },
      {
        title: 'REGLA 14',
        text: 'Si la misma posición ocurre tres veces en la partida la partida acabará en tablas',
        initialFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        moves: ['b1c3','b8c6','c3b1','c6b8','b1c3','b8c6','c3b1','c6b8','b1c3'],
      },
      {
        title: 'REGLA 15',
        text: 'El jugador que se queda sin tiempo pierde la partida.',
        initialFen: '4k3/8/8/8/8/8/8/4K3 w - - 0 1',
        moves: [],
      },   
];

function RuleBoard({ initialFen, moves = [], showTimeOutPopup = false }) {
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
        <div className={styles.boardContainer}>
        <Chessboard
          position={history[step]}
          arePiecesDraggable={false}
          boardWidth={180}
        />
        {showTimeOutPopup && (
          <div className={styles.popupOverlay}>
          <div className={styles.popupBox}>
            <h2>¡Has perdido!</h2>
            <p className={styles.lostByTime}>Se te ha acabado el tiempo</p>
            <span className={styles.trophy}>❌</span>
            <div className={styles.winnerActions}>
              <div className={styles.rowActions}>
                <button className={styles.reviewButton}>Revisar Partida</button>
                <button className={styles.rematchButton}>Volver Inicio</button>
              </div>
              <button className={styles.newGameButton}>Buscar otra partida</button>
            </div>
          </div>
        </div>
        )}
        </div>
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
      <h2 className={styles.title}><FcPuzzle className={styles.icon} /> <strong>REGLAS</strong></h2>

      {rules.map((rule, index) => (
        <div key={index} className={styles.reglaBox}>
          <RuleBoard 
          initialFen={rule.initialFen} 
          moves={rule.moves}
          showTimeOutPopup={rule.title === 'REGLA 15'}
          />
          <div className={styles.reglaContent}>
            <h3 className={styles.reglaName}>{rule.title}</h3>
            <p className={styles.reglaDescription}>{rule.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
