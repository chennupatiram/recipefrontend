import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './pages/navbar';
import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';
import AddRecipe from './pages/addRecipe';
import MyRecipe from './pages/myRecipe';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("token") !== null;
  });

  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem("token", "true");
    } else {
      localStorage.removeItem("token");
    }
  }, [isLoggedIn]);

  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    axios.get("https://recipebackend-33a1.onrender.com/api/recipes")
      .then(response => setRecipes(response.data))
      .catch(error => console.error("Error fetching recipes:", error));
  }, []);

  const handleAddRecipe = (newRecipe) => {
    setRecipes([...recipes, newRecipe]);
  };

  return (
    <Router>
      {isLoggedIn && <Navbar setIsLoggedIn={setIsLoggedIn} />} 

      <Routes>
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={isLoggedIn ? <Home recipes={recipes} /> : <Navigate to="/login" />} />
        <Route path="/add-recipe" element={isLoggedIn ? <AddRecipe onAddRecipe={handleAddRecipe} /> : <Navigate to="/login" />} />
        <Route path="/my-recipes" element={isLoggedIn ? <MyRecipe recipes={recipes} setRecipes={setRecipes} /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={isLoggedIn ? "/" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;