import FavoritesClient from "./FavoritesClient";

async function fetchFavorites() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  
  try {
    const response = await fetch(`${baseUrl}/api/favorites`, {
      cache: "no-store",
      next: { tags: ['favorites'] } // For revalidation
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch favorites: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching favorites:", error);
    // Return empty array instead of throwing to prevent page crash
    return []; 
  }
}

export default async function Favorites() {
  const favorites = await fetchFavorites();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl text-center font-bold mb-4">Favorite Recipes</h1>
      {favorites.length > 0 ? (
        <FavoritesClient favorites={favorites} />
      ) : (
        <p className="text-center text-gray-500">No favorites yet</p>
      )}
    </div>
  );
}
