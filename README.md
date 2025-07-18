# Recipe Viewer with Favorites

A modern, responsive recipe browsing application built with Next.js 14, featuring TheMealDB API integration and MongoDB Atlas for favorites management.

## Features

- **Recipe Browsing**: Browse random recipes or search by name
- **Recipe Details**: View detailed recipe information including ingredients, instructions, and cooking videos
- **Favorites System**: Save and manage your favorite recipes with MongoDB Atlas
- **Responsive Design**: Optimized for mobile, tablet, and desktop devices
- **Modern UI**: Clean, intuitive interface with smooth animations

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB Atlas
- **External API**: TheMealDB API
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd recipe-viewer
```

2. Install dependencies:
```bash
npm install
```

3. Set up MongoDB Atlas:
   - Create a MongoDB Atlas account at https://cloud.mongodb.com
   - Create a new cluster
   - Get your connection string
   - Create a `.env.local` file and add your MongoDB URI:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/recipe-viewer?retryWrites=true&w=majority
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Endpoints

- `GET /api/favorites` - Get all favorite recipes
- `POST /api/favorites` - Add a recipe to favorites
- `DELETE /api/favorites/[id]` - Remove a recipe from favorites

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Add your `MONGODB_URI` environment variable in Vercel settings
4. Deploy

### Manual Deployment

1. Build the project:
```bash
npm run build
```

2. Export static files:
```bash
npm run export
```

3. Deploy the `out` folder to your hosting provider

## Project Structure

```
├── app/
│   ├── api/favorites/          # API routes for favorites
│   ├── recipe/[id]/           # Dynamic recipe detail pages
│   ├── favorites/             # Favorites page
│   └── page.tsx               # Home page
├── components/
│   ├── ui/                    # Reusable UI components
│   ├── RecipeCard.tsx         # Recipe card component
│   ├── SearchBar.tsx          # Search functionality
│   └── Navigation.tsx         # Navigation bar
├── lib/
│   ├── api.ts                 # TheMealDB API functions
│   ├── mongodb.ts             # MongoDB connection
│   └── types.ts               # TypeScript types
├── models/
│   └── Favorite.ts            # MongoDB favorite model
└── hooks/
    └── useFavorites.ts        # Custom hook for favorites
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
