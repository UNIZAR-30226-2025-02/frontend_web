"use client";

import "../layout.css";
import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function ResetPasswordPage() {
  const [form, setForm] = useState({
    NombreUser: "",
    token: "",
    Contrasena: "",
    ConfirmarContrasena: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const togglePasswordConfirmVisibility = () => {
    setShowPasswordConfirm(!showPasswordConfirm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (form.Contrasena !== form.ConfirmarContrasena) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
        const response = await fetch(`${BACKEND_URL}/tryResetPasswd`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        // Leer la respuesta como texto primero
        const textResponse = await response.text();
        //console.log("RAW RESPONSE:", textResponse);

        // Intentar convertir la respuesta a JSON solo si es válido
        let data;
        try {
            data = JSON.parse(textResponse);
        } catch (jsonError) {
            console.error("El servidor devolvió HTML o una respuesta inválida:", textResponse);
            throw new Error("Hubo un error al procesar la solicitud. Inténtalo de nuevo más tarde.");
        }

        // Manejo de errores si el servidor responde con error
        if (!response.ok) throw new Error(data.error || "Error en la solicitud");

        setMessage(data.message);
        localStorage.removeItem("resetUser");

        setTimeout(() => router.push("/auth/login"), 3000);
    } catch (err) {
        console.error("Error capturado:", err);
        setError(err.message);
    }
};


  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>Restablecer Contraseña</h2>

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

      <div>
        <label className="label">Código de Recuperación</label>
        <input
          type="text"
          name="token"
          value={form.token}
          onChange={handleChange}
          className="input"
          required
        />
      </div>

      <div>
        <label className="label">Nueva Contraseña</label>
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
        <label className="label">Repetir Contraseña</label>
        <div className="password-wrapper">
        <input
          type={showPasswordConfirm ? "text" : "password"}
          name="ConfirmarContrasena"
          value={form.ConfirmarContrasena}
          onChange={handleChange}
          className="input"
          required
        />
        <span className="eye-icon" onClick={togglePasswordConfirmVisibility}>
            {showPasswordConfirm ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
      </div>

      <button type="submit" className="button">Restablecer Contraseña</button>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="links">
        <a href="/auth/login" className="link">Volver al Login</a>
      </div>
    </form>
  );
}
