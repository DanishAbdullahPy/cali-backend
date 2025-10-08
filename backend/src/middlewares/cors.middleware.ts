import cors from 'cors';
import { Request, Response } from 'express';

// Get environment variables
const isProduction = process.env.NODE_ENV === 'production';
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

// CORS configuration
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (isProduction) {
      // In production, only allow the configured frontend URL
      if (origin === frontendUrl) {
        return callback(null, true);
      }
    } else {
      // In development, allow localhost origins
      if (origin === frontendUrl || origin.match(/^http:\/\/localhost:[0-9]+$/)) {
        return callback(null, true);
      }
    }
    
    const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
    return callback(new Error(msg), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Length', 'X-Requested-With'],
  preflightContinue: false,
  optionsSuccessStatus: 204 // Some legacy browsers choke on 204
};

export default cors(corsOptions);