import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
    const [recipes, setRecipes] = useState([]);
    const [comments, setComments] = useState({});

    useEffect(() => {
        axios.get("https://recipebackend-33a1.onrender.com/api/recipes")
            .then(response => setRecipes(response.data))
            .catch(error => console.error("Error fetching recipes:", error));
    }, []);

    const handleCommentChange = (recipeId, value) => {
        setComments(prev => ({
            ...prev,
            [recipeId]: value
        }));
    };

    const addComment = (recipeId) => {
        if (!comments[recipeId]) return;

        axios.post('https://recipebackend-33a1.onrender.com/api/recipes/${recipeId}/comments', { comment: comments[recipeId] })
            .then(() => {
                alert("Comment added!");
                setComments(prev => ({ ...prev, [recipeId]: "" }));
            })
            .catch(error => console.error("Error adding comment:", error));
    };

    const shareRecipe = (recipe) => {
        const shareText = 'Check out this recipe: ${recipe.title} 🍽\nTime: ${recipe.time} mins\nIngredients: ${recipe.ingredients.join(", ")}\nInstructions: ${recipe.instructions}';
        navigator.clipboard.writeText(shareText)
            .then(() => alert("Recipe copied! Share it with anyone."))
            .catch(() => alert("Failed to copy recipe."));
    };

    return (
        <div className="home-container">
            <h1 style={{ color: "blue", backgroundColor: "orange" }}>Home Page</h1>

            {recipes.length === 0 ? (
                <p style={{ color: "blue", backgroundColor: "orange" }}>No recipes added yet. Click "Add Recipe" to create one.</p>
            ) : (
                <div className="recipe-list">
                    {recipes.map((recipe) => (
                        <div key={recipe._id} className="recipe-card">
                            <h2>{recipe.title}</h2>
                            {recipe.imageUrl && <img src={`https://recipebackend-33a1.onrender.com${recipe.imageUrl}`} alt={recipe.title} className="recipe-image" />}
                            <p><strong>Time:</strong> {recipe.time} minutes</p>
                            <p><strong>Ingredients:</strong> {recipe.ingredients.join(", ")}</p>
                            <p><strong>Instructions:</strong> {recipe.instructions}</p>

                            {/* Comment Section */}
                            <div className="comment-section">
                                <h4>Comments:</h4>
                                <input
                                    type="text"
                                    placeholder="Write a comment..."
                                    value={comments[recipe._id] || ""}
                                    onChange={(e) => handleCommentChange(recipe._id, e.target.value)}
                                />
                                <button onClick={() => addComment(recipe._id)}>Post</button>
                            </div>

                            {/* Share Options */}
                            <div className="share-section">
                                <button onClick={() => shareRecipe(recipe)}>📋 Copy Recipe</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;