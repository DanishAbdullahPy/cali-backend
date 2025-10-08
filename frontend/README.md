# Calibort User Management - Frontend

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

## Features

- User authentication (login/logout)
- User management (view, create, update, delete)
- Profile management with avatar upload
- Protected routes
- Responsive design

## API Endpoints

The frontend communicates with the backend API at `http://localhost:8080/api`:

- `/auth/login` - User login
- `/users` - Get all users
- `/users/:id` - Get user by ID
- `/users` - Create new user
- `/users/:id` - Update user
- `/users/:id` - Delete user
- `/users/fetch` - Fetch users from external API

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
REACT_APP_API_URL=http://localhost:8080/api
