"use client";
import "../layout.css";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from 'next/navigation';  // Importar useRouter

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
        const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        const data = await response.json();  // Parseamos la respuesta como JSON
        console.log("Respuesta del servidor:", data); // Debug para ver la respuesta exacta

        if (!response.ok) {
            console.log("Error en el login:", data);
            throw new Error(data.message || data.error || "Error desconocido en el login");
        }

        if (data.token) {
            // Guardar el token en localStorage
            localStorage.setItem("authToken", data.token);
            localStorage.setItem("NombreUser", data.NombreUser);
            router.push("/comun/withMenu/initial");
        } else if (data.id) {
          // Si no hay token, pero el id está presente, podrías redirigir a una página de perfil o mostrar un mensaje
          console.log("Usuario autenticado, pero no se encontró token.");
          // Aquí puedes guardar los datos del usuario, si es necesario, o redirigir a otra página
          localStorage.setItem("userData", JSON.stringify(data));  // Guardar datos del usuario si es necesario
          router.push("/comun/withMenu/initial");  // O redirigir a otra página 
        }else {
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
        <label className="label">Username</label>
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
        <label className="label">Password</label>
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
        <a href="./forgotPassword" className="link">Forgot password?</a>
      </div>

      <button type="submit" className="button">Sign In</button>

      <div className="links">
        <a href="./register" className="link">New? Sign Up</a>
      </div>
    </form>
  );
}
