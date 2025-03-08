import React, { useEffect, useState } from "react";
import axios from "axios";

const MyRecipe = () => {
    const [recipes, setRecipes] = useState([]);
    const [editId, setEditId] = useState([]);
    const [editedRecipe, setEditedRecipe] = useState({});
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    // Fetch user-specific recipes
    useEffect(() => {
        if (!userId) {
            console.error("❌ No userId found in localStorage");
            return;
        }

        axios.get("https://recipebackend-33a1.onrender.com/api/recipes", {
            headers: { Authorization: `Bearer ${token}`}
        })
        .then(response => {
            console.log("📌 Fetched Recipes:", response.data);

            if (!Array.isArray(response.data)) {
                console.error("❌ Unexpected API response:", response.data);
                return;
            }

            // Filter recipes for logged-in user
            const userRecipes = response.data.filter(recipe =>
                recipe.userId && String(recipe.userId) === String(userId)
            );

            console.log("✅ Filtered Recipes for user:", userRecipes);
            setRecipes(userRecipes);
        })
        .catch(error => console.error("❌ Error fetching recipes:", error));
    }, [userId, token]);

    // Handle edit button click
    const handleEditClick = (recipe) => {
        setEditId(recipe._id);
        setEditedRecipe({ ...recipe }); // Copy recipe to editedRecipe
    };

    // Handle input change in edit mode
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedRecipe(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Save edited recipe
    const handleSaveEdit = async (editedRecipe) => {
        let updatedIngredients = editedRecipe.ingredients;
    
        // ✅ Ensure ingredients are stored as an array
        if (typeof updatedIngredients === "string") {
            updatedIngredients = updatedIngredients.split(",").map((item) => item.trim());
        }
    
        const updatedRecipe = { ...editedRecipe, ingredients: updatedIngredients };
    
        try {
            const token = localStorage.getItem("token");
            const response = await axios.put(
                `https://recipebackend-33a1.onrender.com/api/recipes/${editedRecipe._id}`,
                updatedRecipe,
                { headers: { Authorization: 'Bearer ${token} '} }
            );
    
            console.log("✅ Recipe updated successfully:", response.data);
            setEditedRecipe(null);
            setRecipes(
                recipes.map((recipe) =>
                    recipe._id === editedRecipe._id ? response.data.recipe : recipe
                )
            );
        } catch (error) {
            console.error("❌ Error updating recipe:", error.response ? error.response.data : error.message);
        }
    };
    
    

    // Delete a recipe
    const handleDelete = async (recipeId) => {
        const token = localStorage.getItem("token");  // ✅ Retrieve token correctly
    
        if (!token) {
            console.error("❌ No token found, user is not authenticated.");
            return;
        }
    
        try {
            const response = await axios.delete(`https://recipebackend-33a1.onrender.com/api/recipes/${recipeId}`, {
                headers: { Authorization: `Bearer ${token}` },  // ✅ Correct header format
            });
    
            console.log("✅ Recipe deleted successfully:", response.data);
            setRecipes(recipes.filter((recipe) => recipe._id !== recipeId)); // Update UI
        } catch (error) {
            console.error("❌ Error deleting recipe:", error.response ? error.response.data : error.message);
        }
    };
    

    return (
        <div className="my-recipes-container">
            <h1 className="title">My Recipes</h1>

            {recipes.length === 0 ? (
                <p className="no-recipes">No recipes added yet.</p>
            ) : (
                <div className="recipe-list">
                    {recipes.map(recipe => (
                        <div key={recipe._id} className="recipe-card">
                            {editId === recipe._id ? (
                                <>
                                    <input type="text" name="title" value={editedRecipe.title || ""} onChange={handleInputChange} />
                                    <input type="text" name="time" value={editedRecipe.time || ""} onChange={handleInputChange} />
                                    <textarea 
                                        name="ingredients"
                                        value={Array.isArray(editedRecipe.ingredients) ? editedRecipe.ingredients.join(", ") : ""}
                                        onChange={(e) => setEditedRecipe(prev => ({
                                            ...prev,
                                            ingredients: e.target.value.split(",").map(i => i.trim())
                                        }))}
                                    />
                                    <textarea name="instructions" value={editedRecipe.instructions || ""} onChange={handleInputChange} />
                                    
                                    <button onClick={() => handleSaveEdit(recipe)}>Save</button>
                                    <button onClick={() => setEditId(null)}>Cancel</button>
                                </>
                            ) : (
                                <>
                                    <h2>{recipe.title}</h2>
                                    {recipe.imageUrl ? (
                                        <img src={`https://recipebackend-33a1.onrender.com${recipe.imageUrl}`} alt={recipe.title} className="recipe-image" />
                                    ) : (
                                        <p>No Image Available</p>
                                    )}
                                    <p><strong>Time:</strong> {recipe.time ? `${recipe.time} minutes`: "Not specified"}</p>
                                    <p><strong>Ingredients:</strong> {Array.isArray(recipe.ingredients) ? recipe.ingredients.join(", ") : "Not specified"}</p>
                                    <p><strong>Instructions:</strong> {recipe.instructions || "Not specified"}</p>
                                    
                                    {/* <button onClick={() => handleEditClick(recipe)}>Edit</button> */}
                                    <button onClick={() => handleDelete(recipe._id)}>Delete</button>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyRecipe;