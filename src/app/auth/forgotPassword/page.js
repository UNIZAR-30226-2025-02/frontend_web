"use client"; // Necesario para Next.js 13+

import "../layout.css";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Recover password for:", email);
    // Aquí puedes agregar la lógica para enviar el correo de recuperación
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <div>
        <label className="label">Email</label>
        <input
          type="email"
          name="email"
          value={email}
          onChange={handleChange}
          className="input"
          required
        />
      </div>

      <button type="submit" className="button">Send Reset Link</button>

      <div className="links">
        <a href="./login" className="link">Back to Login</a>
      </div>
    </form>
  );
}
