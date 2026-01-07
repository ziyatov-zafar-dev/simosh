
import { MongoClient } from "mongodb";
import { APP_CONFIG } from './constants';

const uri = APP_CONFIG.mongodbUri; 
const client = new MongoClient(uri);

let clientPromise: Promise<MongoClient>;

// Browser muhitida 'global' o'rniga 'window' yoki 'self' ishlatiladi, 
// lekin sandbox muhiti uchun globalThis eng xavfsiz tanlov.
const globalWithMongo = globalThis as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
};

if (!globalWithMongo._mongoClientPromise) {
  globalWithMongo._mongoClientPromise = client.connect();
}
clientPromise = globalWithMongo._mongoClientPromise;

export default clientPromise;
