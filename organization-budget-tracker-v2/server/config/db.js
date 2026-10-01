import mongoose from "mongoose";

/**
 * Connect to the database configured by MONGODB_URI.
 * This supports MongoDB Atlas (mongodb+srv://) and local MongoDB.
 */
export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is missing. Configure it in server/.env.");
  }

  mongoose.connection.on("connected", () => console.log("MongoDB connected."));
  mongoose.connection.on("error", (error) => console.error("MongoDB connection error:", error.message));

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
}
