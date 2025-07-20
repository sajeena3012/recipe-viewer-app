// MAKE THIS PAGE DYNAMIC TO PREVENT NEXT.JS STATIC RENDERING ERRORS
export const dynamic = 'force-dynamic';

import FavoritesClient from "./FavoritesClient";

async function getFavorites() {
  try {
    // Use relative URL for internal route; absolute not required
    const apiUrl = "/api/favorites";
    const response = await fetch(apiUrl, {
      cache: "no-store", // always fetch fresh
      headers: {
        'Content-Type': 'application/json'
      }
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
