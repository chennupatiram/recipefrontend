// Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css";

const Login = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post("https://recipebackend-33a1.onrender.com/api/auth/login", { 
        email, 
        password 
      });

      console.log("🔑 Full Response:", response.data);
      
      if (!response.data.token || typeof response.data.token !== "string") {
        throw new Error("Invalid token received from server.");
      }

      // Explicitly store token as a string
      window.localStorage.setItem("token", response.data.token);
      window.localStorage.setItem("userId", response.data.userId);
      
      // Verify storage immediately
      const storedToken = window.localStorage.getItem("token");
      console.log("✅ Verified stored token:", storedToken);

      setIsLoggedIn(true);
      navigate("/home");
    } catch (err) {
      console.error("❌ Login Error:", err);
      setError("Invalid email or password!");
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <input 
        type="email"
        placeholder="Email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required 
      />
      <input 
        type="password" 
        placeholder="Password" 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required 
      />
      <button onClick={handleLogin}>Login</button>
      <p>Don't have an account? <Link to="/register">Register</Link></p>
    </div>
  );
};

export default Login;