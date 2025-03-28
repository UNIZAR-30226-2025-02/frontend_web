"use client";

import "../layout.css"; // Asegúrate de la ruta correcta
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await fetch("http://localhost:3000/sendPasswdReset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Correo: email }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Correo inválido");

      setMessage(data.message);

      // Redirigir a resetPassword después de 2 segundos
      setTimeout(() => router.push("/auth/resetPassword"), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>Recuperar Contraseña</h2>

      <div>
        <label className="label">Correo Electrónico</label>
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
          required
        />
      </div>

      <button type="submit" className="button">Enviar Código</button>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="links">
        <a href="/auth/login" className="link">Volver al Login</a>
      </div>
    </form>
  );
}
