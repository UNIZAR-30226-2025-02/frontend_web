"use client";
import "../layout.css";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../../components/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
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
    login(form.username, form.password); // Enviar credenciales al contexto de autenticación
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
        <a href="./forgotPassword" className="link">Forgot password?</a>
      </div>

      <button type="submit" className="button">Sign In</button>

      <div className="links">
        <a href="./register" className="link">New? Sign Up</a>
      </div>
    </form>
  );
}
