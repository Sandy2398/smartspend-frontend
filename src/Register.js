import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "./api";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
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
      const response = await API.post("/auth/register", formData);

      console.log("Registration response:", response.data);

      setMessage("Registration successful! 🎉");

      setFormData({
        name: "",
        email: "",
        password: "",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (error) {
      console.error("Registration error:", error);

      if (error.response) {
        setMessage(
          error.response.data?.message ||
            `Registration failed (${error.response.status})`
        );
      } else {
        setMessage("Cannot connect to the backend.");
      }
    }
  };

  return (
    <div className="register-page">

      <div className="register-card">

        <div className="register-header">
          <h1>SmartSpend</h1>
          <h2>Create Account</h2>
          <p>Start managing your expenses today.</p>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="register-form-group">
            <label>Name</label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="register-form-group">
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

          <div className="register-form-group">
            <label>Password</label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
            />
          </div>

          <button
            type="submit"
            className="register-button"
          >
            Create Account
          </button>

        </form>

        {message && (
          <div className="register-message">
            {message}
          </div>
        )}

        <div className="login-link">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>

      </div>

    </div>
  );
}

export default Register;