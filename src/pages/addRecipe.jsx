// AddRecipe.jsx
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AddRecipe() {
    const [recipeData, setRecipeData] = useState({
        title: '',
        time: '',
        ingredients: '',
        instructions: '',
        file: null
    });
    const [token, setToken] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Get token on component mount
        const storedToken = window.localStorage.getItem("token");
        setToken(storedToken);
        
        if (!storedToken) {
            navigate("/login");
        }
    }, [navigate]);

    const onHandleChange = (e) => {
        const { name, value, files } = e.target;
        setRecipeData((prev) => ({
            ...prev,
            [name]: name === "file" ? files[0] : name === "ingredients" ? value.split(",").map(ing => ing.trim()) : value.trim()
        }));
        
    };

    const onHandleSubmit = async (e) => {
        e.preventDefault();

        const userId = window.localStorage.getItem("userId");

        if (!token) {
            alert("⚠ You must be logged in to add a recipe!");
            navigate("/login");
            return;
        }

        if (!userId) {
            alert("⚠ User ID missing. Please log in again.");
            navigate("/login");
            return;
        }

        if (!recipeData.file) {
            alert("⚠ Please upload an image for the recipe.");
            return;
        }

        const formData = new FormData();
        formData.append("title", recipeData.title);
        formData.append("time", recipeData.time);
        formData.append("ingredients", JSON.stringify(recipeData.ingredients));
        formData.append("instructions", recipeData.instructions);
        formData.append("image", recipeData.file);
        formData.append("userId", userId);

        try {
            console.log("📡 Sending request with token:", token);

            const response = await axios.post("https://recipebackend-33a1.onrender.com/api/recipes", formData, {
                headers: { 
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${token}`
                }
            });

            console.log("✅ Recipe added successfully:", response.data);
            alert("🎉 Recipe added successfully!");
            navigate("/my-recipes");
        } catch (err) {
            console.error("❌ Error adding recipe:", err.response?.data || err.message);
            
            if (err.response?.status === 401) {
                alert("🔑 Your session has expired. Please log in again.");
                navigate("/login");
            } else {
                alert(`❌ Failed to add recipe: ${err.response?.data?.message || "Please try again."}`);
            }
        }
    };

    return (
        <div className='container'>
            <h2 className='form-title'>Add a New Recipe</h2>
            <form className='form' onSubmit={onHandleSubmit}>
                <div className='form-control'>
                    <label>Title</label>
                    <input type="text" name="title" placeholder="Enter recipe title" onChange={onHandleChange} required />
                </div>
                <div className='form-control'>
                    <label>Time (in minutes)</label>
                    <input type="number" name="time" placeholder="Enter recipe time" onChange={onHandleChange} required />
                </div>
                <div className='form-control'>
                    <label>Ingredients</label>
                    <textarea name="ingredients" rows="4" placeholder="Enter ingredients, separated by commas" onChange={onHandleChange} required />
                </div>
                <div className='form-control'>
                    <label>Instructions</label>
                    <textarea name="instructions" rows="5" placeholder="Enter cooking instructions" onChange={onHandleChange} required />
                </div>
                <div className='form-control'>
                    <label>Recipe Image</label>
                    <input type="file" name="file" accept="image/*" onChange={onHandleChange} required />
                </div>
                <button type="submit" className='submit-btn'>Add Recipe</button>
            </form>
        </div>
    );
}