# Full-Stack User Management App

A full-stack application for user management with authentication, CRUD operations, and profile management.

## Features

- User authentication (login/logout)
- User CRUD operations (Create, Read, Update, Delete)
- Fetch and store users from external API
- Profile management with image upload
- Responsive UI with custom styling

## Tech Stack

- **Backend**: Node.js, Express, TypeScript, Prisma, PostgreSQL, JWT, bcrypt
- **Frontend**: React, TypeScript, Redux Toolkit, Axios, React Router

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd calibort-task
   ```

2. Install dependencies for backend:
   ```bash
   cd backend
   npm install
   ```

3. Install dependencies for frontend:
   ```bash
   cd ../frontend
   npm install
   ```

4. Set up environment variables:

   Create `.env` file in the backend directory:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/dbname"
   JWT_SECRET="your-secret-key"
   PORT=8080
   ```

5. Set up the database:
   ```bash
   cd backend
   npx prisma generate
   npx prisma db push
   ```

## Running the Application

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```
   The backend will run on http://localhost:8080

2. Start the frontend:
   ```bash
   cd frontend
   npm start
   ```
   The frontend will run on http://localhost:3000

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Users
- `POST /api/users` - Create user
- `GET /api/users` - Get all users (authenticated)
- `GET /api/users/:id` - Get user by ID (authenticated)
- `PUT /api/users/:id` - Update user (authenticated)
- `DELETE /api/users/:id` - Delete user (authenticated)
- `POST /api/users/fetch` - Fetch and store users from external API

## Deployment

### Backend Deployment
1. Build the backend:
   ```bash
   cd backend
   npm run build
   ```

2. Deploy to your preferred hosting service (e.g., Heroku, Vercel, AWS, etc.)

### Frontend Deployment
1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Deploy the `build` folder to your hosting service (e.g., Netlify, Vercel, etc.)

### Environment Variables for Production
Ensure to set the following environment variables in your production environment:
- `DATABASE_URL` - Production database URL
- `JWT_SECRET` - Secure JWT secret
- `JWT_EXPIRES_IN` - Token expiration time (e.g., "1h")
- `PORT` - Port for the backend server

## Testing

- Backend: Use tools like Postman or curl to test API endpoints
- Frontend: Interact with the UI to test user flows

## Project Structure

```
calibort-task/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── index.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── store/
│   │   └── App.tsx
│   └── package.json
└── README.md
