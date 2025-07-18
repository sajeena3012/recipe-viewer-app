import FavoritesClient from "./FavoritesClient";

async function fetchFavorites() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const response = await fetch(`${baseUrl}/api/favorites`, { cache: "no-store" });

  if (!response.ok) {
    throw new Error("Failed to fetch favorites");
  }

  return await response.json();
}


export default async function Favorites() {
  const favorites = await fetchFavorites();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl text-center font-bold mb-4">Favorite Recipes</h1>
      <FavoritesClient favorites={favorites} />
    </div>
  );
}
