import RecipeDetailClient from "./RecipeDetailClient";

async function fetchRecipeDetails(id) {
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
  const data = await response.json();
  return data.meals[0];
}

export default async function RecipeDetail({ params }) {
  const { id } = params;
  const recipe = await fetchRecipeDetails(id);

  return (
    <div>
      <RecipeDetailClient recipe={recipe} />
    </div>
  );
}
