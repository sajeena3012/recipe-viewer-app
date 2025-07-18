import { NextResponse } from "next/server";
import { Schema,models } from "mongoose";

const mongoose = require('mongoose')

// Define the MongoDB connection string
const DATABASE_URL = process.env.MONGODB_URI || ''

if (!DATABASE_URL) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

// Define a global variable to cache the connection
let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(DATABASE_URL, opts).then((mongoose) => {
      return mongoose
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}


const FavoriteSchema = new Schema({
  recipeId: { type: String },
  recipeName: { type: String },
  imageUrl: { type: String },
});

const Favorite = models.Favorite || mongoose.model("Favorite", FavoriteSchema);

export async function POST(req) {
  try {
    await connectDB()
    const body = await req.json();
    const { recipeId, recipeName, imageUrl } = body;
    
    const existingFavorite = await Favorite.findOne({ recipeId });
    if (existingFavorite) {
      return NextResponse.json(
        { message: "Recipe already exists in favorites." },
        { status: 409 }
      );
    }
    const newFavorite = new Favorite({ recipeId, recipeName, imageUrl });
    await newFavorite.save();

    return NextResponse.json(newFavorite, { status: 201 });
  } catch (error) {
    console.error("Error adding favorite:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export async function GET() {
  try {
    await connectDB()
    const favorites = await Favorite.find();
    return NextResponse.json(favorites, { status: 200 });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const id = req.nextUrl.searchParams.get("id");

    if (!id) {
      console.error("No ID provided for deletion.");
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    console.log("ID received for deletion:", id);

    const document = await Favorite.findById(id);
    if (!document) {
      console.error(`No document found with ID: ${id}`);
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    await Favorite.findByIdAndDelete(id);
    console.log(`Deleted document with ID: ${id}`);

    return NextResponse.json({ message: "Favorite deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting favorite:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


