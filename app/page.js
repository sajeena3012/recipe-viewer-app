'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [randomRecipe, setRandomRecipe] = useState(null);
  const [loading, setLoading] = useState({
    recipes: true,
    random: true
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get('https://www.themealdb.com/api/json/v1/1/search.php?s=');
        setRecipes(response.data.meals || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(prev => ({ ...prev, recipes: false }));
      }
    };

    const fetchRandomRecipe = async () => {
      try {
        const response = await axios.get('https://www.themealdb.com/api/json/v1/1/random.php');
        setRandomRecipe(response.data.meals?.[0] || null);
      } catch (err) {
        console.error('Error fetching random recipe:', err);
      } finally {
        setLoading(prev => ({ ...prev, random: false }));
      }
    };

    fetchRecipes();
    fetchRandomRecipe();
  }, []);

  const refreshRandomRecipe = async () => {
    try {
      setLoading(prev => ({ ...prev, random: true }));
      const response = await axios.get('https://www.themealdb.com/api/json/v1/1/random.php');
      setRandomRecipe(response.data.meals?.[0] || null);
    } catch (err) {
      console.error('Error fetching random recipe:', err);
    } finally {
      setLoading(prev => ({ ...prev, random: false }));
    }
  };

  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">All Meals</h1>
      
      {/* Random Recipe Section */}
      <div className="mb-12 bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Try Something Random!</h2>
            <button
              onClick={refreshRandomRecipe}
              disabled={loading.random}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
            >
              {loading.random ? 'Loading...' : 'Get Another Random Recipe'}
            </button>
          </div>
          
          {loading.random ? (
            <div className="text-center py-8">Loading random recipe...</div>
          ) : randomRecipe ? (
            <div className="md:flex gap-6">
              <div className="md:w-1/3 mb-4 md:mb-0">
                <img 
                  src={randomRecipe.strMealThumb} 
                  alt={randomRecipe.strMeal} 
                  className="w-full h-48 object-cover rounded-md"
                />
              </div>
              <div className="md:w-2/3">
                <h3 className="text-xl font-bold mb-2">{randomRecipe.strMeal}</h3>
                <p className="text-gray-600 line-clamp-3 mb-4">
                  {randomRecipe.strInstructions?.substring(0, 200)}...
                </p>
                <Link 
                  href={`/recipe/${randomRecipe.idMeal}`} 
                  className="inline-block px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
                >
                  View Recipe
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">No random recipe found</div>
          )}
        </div>
      </div>

      {/* All Recipes Section */}
      <h2 className="text-2xl font-semibold mb-6">Browse All Recipes</h2>
      {loading.recipes ? (
        <div className="text-center py-8">Loading recipes...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <div 
              key={recipe.idMeal} 
              className="relative group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <Link href={`/recipe/${recipe.idMeal}`} className="block h-full">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={recipe.strMealThumb} 
                    alt={recipe.strMeal} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{recipe.strMeal}</h2>
                  <p className="text-gray-600 line-clamp-2">
                    {recipe.strInstructions?.substring(0, 100)}...
                  </p>
                </div>
              </Link>

              {/* Enhanced Hover Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center p-6 pointer-events-none">
                <div className="text-center">
                  <h3 className="text-white text-2xl font-bold mb-3">{recipe.strMeal}</h3>
                  <div className="flex justify-center gap-2 mb-4">
                    <span className="bg-orange-500 text-white text-xs px-3 py-1 rounded-full">
                      {recipe.strCategory}
                    </span>
                    <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full">
                      {recipe.strArea}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm line-clamp-4 mb-4">
                    {recipe.strInstructions?.substring(0, 250)}...
                  </p>
                  <div className="animate-bounce mt-4">
                    <span className="text-white font-medium bg-green-600 px-4 py-2 rounded-lg">
                      Click to view recipe
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}