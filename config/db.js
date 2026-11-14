import "dotenv/config";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
const dbName = "community-care";

export async function connectToMongoDB() {
  try {
    await client.connect();
    await client.db(dbName).command({ ping: 1 });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

// Routes are registered before the connection finishes,
// so they fetch collections lazily inside each handler.
export const getCollection = (name) => client.db(dbName).collection(name);