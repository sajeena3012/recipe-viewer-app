"use client"; 

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FavoritesClient({ favorites: initialFavorites }) {
  const [favorites, setFavorites] = useState(initialFavorites);
  const router = useRouter();

  const removeFavorite = async (id) => {
    try {
      const response = await fetch(`/api/favorites?id=${id}`, { method: "DELETE" });
      if (response.ok) {
        setFavorites((prevFavorites) => prevFavorites.filter((favorite) => favorite._id !== id));
      } else {
        console.error("Failed to remove favorite:", await response.json());
        alert("Failed to remove favorite.");
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
      alert("An error occurred while removing the favorite.");
    }
  };
  

  return (
    <div>
      {favorites.length === 0 ? (
        <p className="text-center">No favorites yet!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {favorites.map((favorite) => (
            <div key={favorite._id} className="border p-4 rounded-md transition-all duration-700 hover:scale-110">
              <img
                src={favorite.imageUrl}
                alt={favorite.recipeName}
                className="w-full h-48 object-cover rounded-lg shadow-md cursor-pointer"
                onClick={() => router.push(`/recipe/${favorite.recipeId}`)} 
              />
              <h2
                className="text-2xl font-bold mt-2 cursor-pointer"
                onClick={() => router.push(`/recipe/${favorite.recipeId}`)} 
              >
                {favorite.recipeName}
              </h2>
              <br></br>
              <button
                onClick={() => removeFavorite(favorite._id)} 
                className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg hover:bg-red-400"
              ><svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12" />
            </svg>
                Remove from Favorites
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
