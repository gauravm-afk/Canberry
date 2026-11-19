// Script to create/reset admin account in local MongoDB
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { Admin } from '../models/Admin.js';

const MONGO_URI = 'mongodb://127.0.0.1:27017/canberry_dairy';

async function seedAdmin() {
  try {
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('[DB] Connected to local MongoDB');

    // Remove existing admin(s) to start fresh
    await Admin.deleteMany({});

    // Create admin with hashed password (bcrypt will hash via pre-save hook)
    const admin = new Admin({
      username: 'admin',
      email: 'admin@canberry.com',
      password: 'Admin@123',
      role: 'admin',
    });

    await admin.save();

    // Verify password hash works
    const saved = await Admin.findOne({ email: 'admin@canberry.com' });
    const ok = await saved.comparePassword('Admin@123');

    console.log(`\n✅ Admin seeded successfully!`);
    console.log(`   Email    : admin@canberry.com`);
    console.log(`   Username : admin`);
    console.log(`   Password : Admin@123`);
    console.log(`   bcrypt verify: ${ok ? 'PASS ✓' : 'FAIL ✗'}\n`);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seedAdmin();
