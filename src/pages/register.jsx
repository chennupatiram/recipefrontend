import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css";

const Register = () => {
  const [username, setUsername] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validatePassword = (password) => password.length >= 6 && /\d/.test(password) && /[!@#$%^&*]/.test(password);

  const handleRegister = async () => {
    if (!username || !email || !password || !confirmPassword) {
      alert("⚠ All fields are required!");
      return;
    }

    if (!validateEmail(email)) {
      alert("⚠ Please enter a valid email address!");
      return;
    }

    if (!validatePassword(password)) {
      alert("⚠ Password must be at least 6 characters long and include a number & special character!");
      return;
    }

    if (password !== confirmPassword) {
      alert("⚠ Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("https://recipebackend-33a1.onrender.com/api/auth/register", {
        username,
        email,
        password,
      });

      alert("✅ Registration successful! Redirecting to login...");
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      alert(error.response?.data?.message || "⚠ Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Register</h2>
      <input type="text" placeholder="Full Name" value={username} onChange={(e) => setUsername(e.target.value)} required />
      <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password (6+ chars, 1 number, 1 special char)" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
      <button onClick={handleRegister} disabled={loading}>{loading ? "Registering..." : "Sign Up"}</button>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
};

export default Register;