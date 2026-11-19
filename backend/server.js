import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { exec } from 'child_process';
import { connectDB } from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import enquiryRoutes from './routes/enquiryRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import { Product } from './models/Product.js';
import { initialProducts } from './seeds/seedData.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb', extended: true }));

// Connect to MongoDB
connectDB().then(async () => {
  try {
    // Auto-seed products if empty
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log('Product database is empty. Auto-seeding initial dairy products...');
      await Product.insertMany(initialProducts);
      console.log('Auto-seed completed successfully!');
    }
  } catch (err) {
    console.warn('Auto-seed check notice:', err.message);
  }

  try {
    // Create default admin if none exists
    const { Admin } = await import('./models/Admin.js');
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      await Admin.create({ username: 'admin', email: 'admin@canberry.com', password: 'Admin@123' });
      console.log('Default admin created: admin@canberry.com / Admin@123');
    }
  } catch (err) {
    console.warn('Admin seed notice:', err.message);
  }
});

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Canberry Dairy E-Commerce API',
  });
});

// Root API response
app.get('/', (req, res) => {
  res.send('Canberry Dairy API is running.');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[API Server Error]:', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const httpServer = createServer(app);

httpServer.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.warn(`[Server] Port ${PORT} in use — killing occupying process and retrying in 1.5s...`);
    exec(
      `for /f "tokens=5" %a in ('netstat -ano ^| findstr :${PORT} ^| findstr LISTENING') do taskkill /PID %a /F`,
      { shell: 'cmd.exe' },
      () => {
        setTimeout(() => {
          httpServer.close();
          httpServer.listen(PORT, '0.0.0.0');
        }, 1500);
      }
    );
  } else {
    console.error('[Server Error]:', err.message);
    process.exit(1);
  }
});

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`[Canberry Backend Server] running on http://localhost:${PORT}`);
});
