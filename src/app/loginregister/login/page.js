"use client"; // Necesario para usar eventos y estados
import "../layout.css";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Importa los iconos de FontAwesome

export default function LoginPage() {
  const [form, setForm] = useState({ 
    username: "", 
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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

      <div className="password-container">
        <label className="label">Password</label>
        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={form.password}
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
        <a href="#" className="link">Forgot password?</a>
      </div>

      <button type="submit" className="button">Sign In</button>

      <div className="links">
        <a href="./register" className="link">New? Sign Up</a>
      </div>
    </form>
  );
}
