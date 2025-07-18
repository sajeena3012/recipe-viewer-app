import { NextResponse } from "next/server";
import mongoose from 'mongoose';

// Database connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI in .env.local');
}

let cached = global.mongoose || { conn: null, promise: null };

async function connectDB() {
  if (cached.conn) return cached.conn;
  
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    }).then(mongoose => mongoose);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Schema
const FavoriteSchema = new mongoose.Schema({
  recipeId: { type: String, required: true, unique: true },
  recipeName: { type: String, required: true },
  imageUrl: String,
  createdAt: { type: Date, default: Date.now }
});

const Favorite = mongoose.models.Favorite || mongoose.model('Favorite', FavoriteSchema);

// API Endpoints
export async function GET() {
  try {
    await connectDB();
    const favorites = await Favorite.find().sort({ createdAt: -1 });
    return NextResponse.json(favorites);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch favorites" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const { recipeId, recipeName, imageUrl } = await req.json();
    
    if (!recipeId || !recipeName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const existing = await Favorite.findOne({ recipeId });
    if (existing) {
      return NextResponse.json(
        { error: "Recipe already in favorites" },
        { status: 409 }
      );
    }

    const newFavorite = await Favorite.create({ recipeId, recipeName, imageUrl });
    return NextResponse.json(newFavorite, { status: 201 });
    
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to add favorite" },
      { status: 500 }
    );
  }
}
