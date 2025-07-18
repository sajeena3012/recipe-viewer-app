import { NextResponse } from "next/server";
import mongoose from 'mongoose';

// MongoDB Connection Setup
const DATABASE_URL = process.env.MONGODB_URI || '';

if (!DATABASE_URL) {
  throw new Error('Please define MONGODB_URI in .env.local');
}

// Connection caching
let cached = global.mongoose || { conn: null, promise: null };

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose.connect(DATABASE_URL, opts)
      .then(mongoose => mongoose)
      .catch(err => {
        console.error("MongoDB connection error:", err);
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}

// Schema Definition
const FavoriteSchema = new mongoose.Schema({
  recipeId: {
    type: String,
    required: true,
    unique: true
  },
  recipeName: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    validate: {
      validator: v => /^https?:\/\//.test(v),
      message: "Invalid URL format"
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Favorite = mongoose.models.Favorite || mongoose.model('Favorite', FavoriteSchema);

// CORS Middleware
const checkOrigin = (req) => {
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
  const origin = req.headers.get('origin');
  
  if (origin && !allowedOrigins.includes(origin)) {
    return new NextResponse(null, { status: 403 });
  }
  return null;
};

// API Endpoints
export async function POST(req) {
  const originError = checkOrigin(req);
  if (originError) return originError;

  try {
    await connectDB();
    const body = await req.json();
    
    const { recipeId, recipeName, imageUrl } = body;
    if (!recipeId || !recipeName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const existing = await Favorite.findOne({ recipeId });
    if (existing) {
      return NextResponse.json(
        { message: "Recipe already in favorites" },
        { status: 409 }
      );
    }

    const newFavorite = new Favorite({ recipeId, recipeName, imageUrl });
    await newFavorite.save();

    return NextResponse.json(newFavorite, { status: 201 });
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  const originError = checkOrigin(req);
  if (originError) return originError;

  try {
    await connectDB();
    const favorites = await Favorite.find().sort({ createdAt: -1 });
    return NextResponse.json(favorites, { status: 200 });
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  const originError = checkOrigin(req);
  if (originError) return originError;

  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "ID parameter required" },
        { status: 400 }
      );
    }

    const result = await Favorite.findByIdAndDelete(id);
    if (!result) {
      return NextResponse.json(
        { error: "Favorite not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Favorite deleted", deletedId: id },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
