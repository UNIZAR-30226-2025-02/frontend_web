import { useEffect, useState } from 'react';
import socket from '../utils/sockets';

const useSocket = () => {
    const [gameId, setGameId] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Escuchar respuesta del servidor cuando se encuentra una partida
        socket.on('game-found', (data) => {
            //console.log("Partida encontrada:", data);
            setGameId(data.gameId);
        });

        // Manejo de errores
        socket.on('error', (errMsg) => {
            console.error("Error recibido:", errMsg);
            setError(errMsg);
        });

        return () => {
            socket.off('game-found');
            socket.off('error');
        };
    }, []);

    return { gameId, error };
};

export default useSocket;
