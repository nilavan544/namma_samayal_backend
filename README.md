# Namma Samayal - Backend API

Express.js backend for Namma Samayal recipe finder application.

## Features
- JWT Authentication
- MongoDB with Mongoose
- Recipe caching system
- Admin dashboard APIs
- User management
- Role-based access control

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your credentials:
- MongoDB URI
- JWT Secret

4. Create admin user:
```bash
npm run create-admin
```

5. Start server:
```bash
npm run dev
```

Server runs on: http://localhost:5001

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register user
- POST `/api/auth/login` - Login user
- GET `/api/auth/profile` - Get profile

### Favorites
- GET `/api/favorites` - Get favorites
- POST `/api/favorites` - Add favorite
- DELETE `/api/favorites/:id` - Remove favorite

### Cached Recipes
- GET `/api/cached-recipes/search` - Search cached recipes
- POST `/api/cached-recipes/bulk` - Save recipes
- GET `/api/cached-recipes/stats` - Get stats

### Admin
- GET `/api/admin/users` - Get all users
- DELETE `/api/admin/users/:id` - Delete user
- GET `/api/admin/stats` - Get dashboard stats

## Deployment

For AWS deployment, use Elastic Beanstalk or EC2.
