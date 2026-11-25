import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export function getMongoClient() {
  if (!uri) {
    throw new Error("MONGODB_URI is not set. Add it to .env.local.");
  }

  if (!globalThis._mongoClientPromise) {
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 3000 });
    globalThis._mongoClientPromise = client.connect().catch((error) => {
      globalThis._mongoClientPromise = undefined;
      throw error;
    });
  }

  return globalThis._mongoClientPromise;
}

export async function getDb() {
  const client = await getMongoClient();
  return client.db();
}
