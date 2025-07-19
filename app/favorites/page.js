import FavoritesClient from "./FavoritesClient";

async function getFavorites() {
  try {
    // Use relative path for production and full URL for development
    const apiUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000/api/favorites'
      : '/api/favorites';

    const response = await fetch(apiUrl, {
      cache: "no-store",
      next: { tags: ['favorites'] }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    return []; // Return empty array as fallback
  }
}

export default async function FavoritesPage() {
  const favorites = await getFavorites();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl text-center font-bold mb-4">Favorite Recipes</h1>
      <FavoritesClient favorites={favorites} />
    </div>
  );
}
