"use client";
import { createContext, useContext } from "react";
import socket from "../utils/sockets";  // Usa la misma instancia de socket

const SocketContext = createContext(socket);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
