"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FavoritesClient({ favorites: initialFavorites }) {
  const [favorites, setFavorites] = useState(initialFavorites || []);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const removeFavorite = async (id) => {
    if (isDeleting) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/favorites?id=${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to remove favorite");
      }

      setFavorites((prevFavorites) =>
        prevFavorites.filter((favorite) => favorite._id !== id)
      );
      router.refresh();
    } catch (error) {
      console.error("Error removing favorite:", error);
      alert(error.message || "An error occurred while removing the favorite.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      {favorites.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No favorites yet!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {favorites.map((favorite) => (
            <div
              key={favorite._id}
              className="border p-4 rounded-md transition-all duration-300 hover:shadow-lg"
            >
              <div className="relative group">
                <img
                  src={favorite.imageUrl}
                  alt={favorite.recipeName}
                  className="w-full h-48 object-cover rounded-lg shadow-md cursor-pointer hover:opacity-90"
                  onClick={() => router.push(`/recipe/${favorite.recipeId}`)}
                />
                <button
                  onClick={() => removeFavorite(favorite._id)}
                  disabled={isDeleting}
                  className={`absolute top-2 right-2 p-2 rounded-full bg-white/90 hover:bg-red-100 transition-colors ${
                    isDeleting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  aria-label="Remove from favorites"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <h2
                className="text-xl font-bold mt-3 cursor-pointer hover:text-blue-600 line-clamp-1"
                onClick={() => router.push(`/recipe/${favorite.recipeId}`)}
              >
                {favorite.recipeName}
              </h2>
              <button
                onClick={() => removeFavorite(favorite._id)}
                disabled={isDeleting}
                className={`mt-2 w-full flex items-center justify-center gap-2 btn btn-outline btn-error btn-sm ${
                  isDeleting ? "loading" : ""
                }`}
              >
                {!isDeleting && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
