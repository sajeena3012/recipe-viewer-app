"use client";

import { useState } from "react";

export default function RecipeDetailClient({ recipe }) {
  const [message, setMessage] = useState("");

  const addToFavorites = async () => {
    try {
      const response = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipeId: recipe.idMeal,
          recipeName: recipe.strMeal,
          imageUrl: recipe.strMealThumb,
        }),
      });

      if (response.ok) {
        setMessage("Added to Favorites!");
      } else if (response.status === 409) {
        setMessage("Recipe already exists in Favorites.");
      } else {
        setMessage("Failed to add to Favorites. Please try again.");
      }
    } catch (error) {
      console.error("Error adding to favorites:", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col-reverse justify-center items-center gap-4 md:flex-row">
      <h1 className="text-5xl font-bold md:text-8xl">{recipe.strMeal}</h1>
      
      <img
        src={recipe.strMealThumb}
        alt={recipe.strMeal}
        className="w- h-64  mt-4 rounded-md shadow-xl"
      />
      </div>
      <br></br>
      <h2 className="text-2xl font-bold mt-4">INGREDIENTS</h2>
      <ul>
        {Object.keys(recipe)
          .filter((key) => key.startsWith("strIngredient") && recipe[key])
          .map((key, index) => (
            <li key={index}>{recipe[key]}</li>
          ))}
      </ul>
      <h2 className="text-2xl font-bold mt-4">INSTRUCTIONS</h2>
      <p>{recipe.strInstructions}</p>
      <br></br>
      <div className="justify-center flex">
      <button
        onClick={addToFavorites}
        className="btn m-2"
      >
        Add to Favorites
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>
      </div>
      {message && <p className="mt-2 text-sm text-center text-orange-600">{message}</p>}
    </div>
  );
}
