import { io } from 'socket.io-client';

const socket = io('http://localhost:3000'); // Asegúrate de usar el puerto correcto

export default socket;
