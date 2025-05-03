"use client";
import "../layout.css";
import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from 'next/navigation';  // Importar useRouter
import {getSocket} from "../../utils/sockets"; 

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function LoginPage() {
  const [form, setForm] = useState({
    NombreUser: "",
    Contrasena: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();  // Inicializar el router

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
       //const response = await fetch("http://localhost:3000/login", {
       const response = await fetch(`${BACKEND_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        const data = await response.json();  // Parseamos la respuesta como JSON
        console.log("Respuesta del servidor:", data); // Debug para ver la respuesta exacta
        // Obtiene el token de la respuesta
      const token = data.accessToken;
    
        if (!response.ok) {
            console.log("Error en el login:", data);
            throw new Error(data.message || data.error || "Error desconocido en el login");
        }
        if (token) {
          console.log('Login exitoso. Token recibido:', token);
            // Guardar el token en localStorage
          localStorage.setItem("authToken", token);
          localStorage.setItem("userData", JSON.stringify(data));
          localStorage.removeItem("soyInvitado");
          console.log("😭Datos del usuario guardados en localStorage:", data);
          const socket = getSocket(token);
          socket.on('existing-game', (data) => {
            console.log('Este usuario estaba jugando una partida');
            localStorage.setItem("colorJug", data.color);
            localStorage.setItem("pgn", data.pgn); // 👈 Guardamos el PGN
            localStorage.setItem("timeW",data.timeLeftW);
            localStorage.setItem("timeB",data.timeLeftB);
            localStorage.setItem("idPartida",data.gameID);
            localStorage.setItem("eloJug", data.miElo);
            localStorage.setItem("eloRival", data.eloRival);  
            localStorage.setItem("nombreRival", data.nombreRival);    
            localStorage.setItem("fotoRival", data.foto_rival);
            router.push(`/comun/game?id=${data.gameID}`);
          }) 
          router.push("/comun/withMenu/initial");
        } else {
            throw new Error("⚠️ Respuesta inesperada del servidor");
        }
    } catch (error) {
        console.log("Error durante el proceso de login:", error.message);  // Mostramos solo el mensaje
        setError(error.message); // Mostramos el mensaje exacto del error en la UI
    }
};

  

  return (
    <form onSubmit={handleSubmit} className="form">
      {error && <p className="error-message">{error}</p>}
      <div>
        <label className="label">Nombre de Usuario</label>
        <input
          type="text"
          name="NombreUser"
          value={form.NombreUser}
          onChange={handleChange}
          className="input"
          required
        />
      </div>

      <div className="password-container">
        <label className="label">Contraseña</label>
        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            name="Contrasena"
            value={form.Contrasena}
            onChange={handleChange}
            className="input"
            required
          />
          <span className="eye-icon" onClick={togglePasswordVisibility}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
      </div>

      <div>
        <a href="./forgotPassword" className="link">¿Has olvidado tu contraseña?</a>
      </div>

      <button type="submit" className="button">Iniciar Sesión</button>

      <div className="links">
        <a href="./register" className="link">¿Eres nuevo? Regístrate</a>
      </div>
    </form>
  );
}
