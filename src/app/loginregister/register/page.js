"use client"; // Necesario para usar eventos y estados
import "../layout.css"; // Importa los estilos globales
import { useState } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
    username: "",
    password: "",
    edad: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Register info:", form);
    // Aquí puedes agregar la lógica para enviar el formulario
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <div>
        <label className="label">Nombre</label>
        <input
          type="text"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          className="input"
          required
        />
      </div>

      <div>
        <label className="label">Apellidos</label>
        <input
          type="text"
          name="apellidos"
          value={form.apellidos}
          onChange={handleChange}
          className="input"
          required
        />
      </div>

      <div>
        <label className="label">Nombre de usuario</label>
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
        <label className="label">Contraseña</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          className="input"
          required
        />
      </div>

      <div>
        <label className="label">Edad</label>
        <input
          type="number"
          name="edad"
          value={form.edad}
          onChange={handleChange}
          className="input"
          required
        />
      </div>

      <button type="submit" className="button">Register</button>

      <div className="links">
        <a href="./login" className="link">Already have an account? Sign In</a>
      </div>
    </form>
  );
}
