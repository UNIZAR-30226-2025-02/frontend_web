"use client"; // Necesario para usar eventos y estados
import "../layout.css";
import { useState } from "react";

export default function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login info:", form);
    // Aquí puedes agregar la lógica para enviar el formulario
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <div>
        <label className="label">Username</label>
        <input
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
          className="input"
          required
        />
      </div>

      <div>
        <label className="label">Password</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          className="input"
          required
        />
      </div>

      <button type="submit" className="button">Sign In</button>

      <div className="links">
        <a href="#" className="link">Forgot password?</a>
        <a href="./register" className="link">New? Sign Up</a>
      </div>
    </form>
  );
}
