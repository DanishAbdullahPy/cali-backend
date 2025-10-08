# Calibort User Management - Backend

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up the database:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Features

- RESTful API for user management
- JWT-based authentication
- File upload for avatars
- Prisma ORM with PostgreSQL
- TypeScript for type safety
- Middleware for validation, authentication, and logging

## API Endpoints

- `POST /api/auth/login` - User login
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `POST /api/users/fetch` - Fetch users from external API

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=8080
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1h
```

## Database Schema

The application uses Prisma to manage the database schema. The main model is:

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  firstName String
  lastName  String
  avatar    String?
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```
