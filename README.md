# Recipe Viewer with Favorites

This project is a simple **Recipe Viewer** web application built with **Next.js 13+**. The app allows users to browse recipes, view detailed information, save favorite recipes, and manage them.

---

## Features

### 1. View Recipes
- Displays a list of recipes fetched from the [TheMealDB API].
- Shows recipe names, images.

### 2. Recipe Details
- Displays detailed information about a recipe:
  - Name
  - Ingredients
  - Instructions
  - Dish image

### 3. Manage Favorites
- Mark recipes as favorites from the recipe details page.
- Store favorites in a MongoDB database.
- View and manage (remove) favorites in a dedicated "Favorites" tab.

### 4. Responsive Design
- Fully responsive UI, compatible with mobile, tablet, and desktop devices.

---

## Tech Stack

### Frontend
- **Next.js** (App Directory for server and client components)
- **React** (for interactivity)
- **Tailwind CSS** (for styling)

### Backend
- **Next.js API Routes** for managing favorites.
- **MongoDB Atlas** for storing favorite recipes.

---

## Project Structure

app/
├── api/
│   └── favorites/
│       └── route.js        # API routes for managing favorites
├── recipe/
│   ├── [id]/
│   │   ├── page.js         # Server Component for recipe details
│   │   └── RecipeDetailClient.js # Client Component for interactivity
├── favorites/
│   ├── page.js             # Server Component for favorites
│   └── FavoritesClient.js  # Client Component for interactivity
└── layout.js               # Global layout and navigation
```

---

## API Endpoints

### 1. **GET /api/favorites**
- Fetches all favorite recipes from the database.

### 2. **POST /api/favorites**
- Adds a new favorite recipe to the database.
- **Request Body:**
json
  {
    "recipeId": "52772",
    "recipeName": "Chicken Handi",
    "imageUrl": "https://www.themealdb.com/images/media/meals/wyxwsp1486979827.jpg"
  }
  ```

### 3. **DELETE /api/favorites?id=<favorite_id>**
- Deletes a favorite recipe from the database.

---

## Deployment

1. **Host on Vercel**:
   - Push the project to GitHub.
   - Link the repository to [Vercel](https://vercel.com/).
   - Set up environment variables in the Vercel dashboard.

2. **MongoDB Atlas**:
   - MongoDB Atlas cluster is accessible from the deployed environment.


## Future Enhancements
- Add user authentication for personalized favorite management.
- Implement search and filtering options for recipes.
- Include random recipe suggestions on the homepage.

## License
This project is licensed under the MIT License. See the `LICENSE` file for more details.
