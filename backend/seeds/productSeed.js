import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { Product } from '../models/Product.js';
import { initialProducts } from './seedData.js';

dotenv.config();

const seedDB = async () => {
  try {
    await connectDB();
    await Product.deleteMany({});
    console.log('Cleared existing products collection.');

    const created = await Product.insertMany(initialProducts);
    console.log(`Successfully seeded ${created.length} dairy products into MongoDB!`);
    process.exit(0);
  } catch (error) {
    console.error(`Error during database seeding: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
