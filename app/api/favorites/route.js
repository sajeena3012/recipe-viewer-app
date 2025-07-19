import { NextResponse } from "next/server";
import mongoose from 'mongoose';

// Define the MongoDB connection string
const DATABASE_URL = process.env.MONGODB_URI || '';

if (!DATABASE_URL) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

// Define a global variable to cache the connection
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // Added timeout
      socketTimeoutMS: 45000, // Added socket timeout
    };

    cached.promise = mongoose.connect(DATABASE_URL, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

const FavoriteSchema = new mongoose.Schema({
  recipeId: { type: String, required: true, unique: true },
  recipeName: { type: String, required: true },
  imageUrl: { type: String, required: true },
});

const Favorite = mongoose.models.Favorite || mongoose.model("Favorite", FavoriteSchema);

// Add CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { recipeId, recipeName, imageUrl } = body;
    
    if (!recipeId || !recipeName || !imageUrl) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400, headers: corsHeaders }
      );
    }

    const existingFavorite = await Favorite.findOne({ recipeId });
    if (existingFavorite) {
      return NextResponse.json(
        { message: "Recipe already exists in favorites." },
        { status: 409, headers: corsHeaders }
      );
    }

    const newFavorite = new Favorite({ recipeId, recipeName, imageUrl });
    await newFavorite.save();

    return NextResponse.json(newFavorite, { 
      status: 201, 
      headers: corsHeaders 
    });
  } catch (error) {
    console.error("Error adding favorite:", error);
    return NextResponse.json(
      { error: "Internal Server Error" }, 
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const favorites = await Favorite.find();
    return NextResponse.json(favorites, { 
      status: 200, 
      headers: corsHeaders 
    });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return NextResponse.json(
      { error: "Internal Server Error" }, 
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function DELETE(req) {
  try {
    const id = req.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID is required" }, 
        { status: 400, headers: corsHeaders }
      );
    }

    await connectDB();
    const document = await Favorite.findById(id);
    
    if (!document) {
      return NextResponse.json(
        { error: "Document not found" }, 
        { status: 404, headers: corsHeaders }
      );
    }

    await Favorite.findByIdAndDelete(id);
    return NextResponse.json(
      { message: "Favorite deleted successfully" }, 
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error("Error deleting favorite:", error);
    return NextResponse.json(
      { error: "Internal Server Error" }, 
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}
