
import express from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { loggingMiddleware } from './middlewares/logging.middleware';
import corsMiddleware from './middlewares/cors.middleware';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;
const isProduction = process.env.NODE_ENV === 'production';
export const prisma = new PrismaClient();

// Apply CORS middleware
app.use(corsMiddleware);
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(loggingMiddleware);

// Routes
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Global error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(port, async () => {
  try {
    await prisma.$connect();
    console.log('Database connected successfully');
    console.log(`Server is running on port ${port}`);
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
});
