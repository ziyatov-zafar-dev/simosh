
import clientPromise from '../db_connect';
import { Database } from '../types';
import { INITIAL_DB } from '../constants';

const DB_NAME = "simosh_db";

export const getDbInstance = async () => {
  const client = await clientPromise;
  return client.db(DB_NAME);
};

export const initDatabase = async () => {
  try {
    const db = await getDbInstance();
    
    // Seed Admin
    const usersCount = await db.collection('users').countDocuments();
    if (usersCount === 0) {
      await db.collection('users').insertMany(INITIAL_DB.users);
    }

    // Seed Categories
    const catCount = await db.collection('categories').countDocuments();
    if (catCount === 0) {
      await db.collection('categories').insertMany(INITIAL_DB.categories);
    }

    // Seed Products
    const prodCount = await db.collection('products').countDocuments();
    if (prodCount === 0) {
      await db.collection('products').insertMany(INITIAL_DB.products);
    }

    // Seed Settings
    const settingsCount = await db.collection('settings').countDocuments();
    if (settingsCount === 0) {
      await db.collection('settings').insertOne({
        type: 'companyInfo',
        data: INITIAL_DB.companyInfo
      });
      await db.collection('settings').insertOne({
        type: 'about',
        data: INITIAL_DB.about
      });
    }

    // Seed Promos
    const promoCount = await db.collection('promoCodes').countDocuments();
    if (promoCount === 0 && INITIAL_DB.promoCodes.length > 0) {
      await db.collection('promoCodes').insertMany(INITIAL_DB.promoCodes);
    }

    console.log("MongoDB initialized successfully");
  } catch (error) {
    console.error("Database initialization failed:", error);
    throw error;
  }
};

export const getDb = async (): Promise<Database> => {
  const db = await getDbInstance();
  
  const [companyDoc, aboutDoc, categories, products, promoCodes, orders, users] = await Promise.all([
    db.collection('settings').findOne({ type: 'companyInfo' }),
    db.collection('settings').findOne({ type: 'about' }),
    db.collection('categories').find({}).toArray(),
    db.collection('products').find({}).toArray(),
    db.collection('promoCodes').find({}).toArray(),
    db.collection('orders').find({}).toArray(),
    db.collection('users').find({}).toArray()
  ]);

  return {
    companyInfo: companyDoc?.data || INITIAL_DB.companyInfo,
    about: aboutDoc?.data || INITIAL_DB.about,
    categories: categories as any,
    products: products as any,
    promoCodes: promoCodes as any,
    orders: orders as any,
    users: users as any
  };
};
