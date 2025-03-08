import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from './assets/logo.jpg';
const Navbar = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser"); //  Remove user data
    setIsLoggedIn(false); //  Update login state
    navigate("/login", { replace: true }); //  Redirect to login
  };

  return (
    <nav className="navbar">
      <div className="logo-container">
      <img src={logo} alt="Logo" className="logo" /> 
      <h2 style={{ textAlign:"center",padding:"5px", color: "#fff",borderRadius:"5px",backgroundColor:"brown" }}>Recipe App</h2>
      </div>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/add-recipe">Add Recipe</Link></li>
        <li><Link to="/my-recipes">My Recipes</Link></li>
        <li><button className="logout-btn" onClick={handleLogout}>Logout</button></li>
      </ul>
    </nav>
  );
};

export default Navbar;
