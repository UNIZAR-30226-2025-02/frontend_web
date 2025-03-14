"use client";
import "../layout.css";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function RegisterPage() {
  const [form, setForm] = useState({
    NombreUser: "", 
    Correo: "",     
    Contrasena: "",  
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await fetch("http://localhost:3000/register", { // Cambio de la URL
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          NombreUser: form.NombreUser, // Cambio "username" por "nombre"
          Correo: form.Correo,
          Contrasena: form.Contrasena,
        }),
      });
      
      const data = await response.json();
      console.log("Respuesta del servidor:", data);
      
      if (response.ok) {
        setMessage("¡Ya casi esa! Comprueba tu correo electronico y verificalo");
        setForm({ NombreUser: "", Correo: "", Contrasena: "" });
      } else {
        setError(data.message || data.error || "Error en el registro.");
      }
    } catch (error) {
      setError("Error en el servidor. Inténtalo de nuevo más tarde.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      {message && <p className="success-message">{message}</p>}
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

      <div>
        <label className="label">Email</label>
        <input
          type="email"
          name="Correo"
          value={form.Correo}
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

      <button type="submit" className="button">Register</button>

      <div className="links">
        <a href="./login" className="link">Already have an account? Sign In</a>
      </div>
    </form>
  );
}
