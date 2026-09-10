import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "./api";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await API.post("/auth/login", formData);

      console.log("Login response:", response.data);

      const token = response.data.token;

      localStorage.setItem("token", token);

      setMessage("Login successful! 🎉");

      setTimeout(() => {
        navigate("/dashboard");
      }, 500);

    } catch (error) {
      console.error("Login error:", error);

      if (error.response) {
        setMessage(
          error.response.data?.message ||
            `Login failed (${error.response.status})`
        );
      } else {
        setMessage("Cannot connect to the backend.");
      }
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <div className="login-header">
          <h1>SmartSpend</h1>
          <h2>Welcome Back</h2>
          <p>Login to manage your expenses.</p>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="login-form-group">
            <label>Email</label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="login-form-group">
            <label>Password</label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="login-button"
          >
            Login
          </button>

        </form>

        {message && (
          <div className="login-message">
            {message}
          </div>
        )}

        <div className="register-link">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/register")}
          >
            Create Account
          </button>
        </div>

      </div>

    </div>
  );
}

export default Login;