import FavoritesClient from "./FavoritesClient";

async function getFavorites() {
  try {
    // Remove baseUrl and use relative path
    const response = await fetch('/api/favorites', {
      cache: "no-store",
      next: { tags: ['favorites'] }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch favorites:", error);
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
