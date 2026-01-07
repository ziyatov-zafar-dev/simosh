
/**
 * Ushbu fayl backend serverda MongoDBga ulanish uchun ishlatiladi.
 * Frontend brauzer muhitida to'g'ridan-to'g'ri MongoDB driverini ishlatib bo'lmaydi.
 */
import { MongoClient } from "mongodb";

const uri = "mongodb://127.0.0.1:27017"; 
const client = new MongoClient(uri);

let clientPromise: Promise<MongoClient>;

// @ts-ignore
if (!global._mongoClientPromise) {
  // @ts-ignore
  global._mongoClientPromise = client.connect();
}

// @ts-ignore
clientPromise = global._mongoClientPromise;

export default clientPromise;
