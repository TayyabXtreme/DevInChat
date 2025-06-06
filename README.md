# DevInChat - Developer Collaboration Platform

## Overview

DevInChat is a modern web application designed for developers to collaborate on projects in real-time. It provides a platform where developers can create projects, add team members, and communicate through a chat interface.

## Features

- **User Authentication**: Secure registration and login system
- **Project Management**: Create and manage development projects
- **Team Collaboration**: Add team members to projects
- **Real-time Chat**: Communicate with team members in real-time
- **Dark Theme UI**: Modern, responsive dark-themed interface
- **Animations**: Smooth transitions and animations for enhanced user experience

## Tech Stack

### Frontend

- **React**: v19.1.0 - UI library
- **React Router DOM**: v7.6.2 - For routing
- **Axios**: v1.9.0 - HTTP client for API requests
- **Tailwind CSS**: v4.1.8 - Utility-first CSS framework
- **React Toastify**: v11.0.5 - For notifications
- **Remixicon**: v4.6.0 - Icon library
- **Vite**: v6.3.5 - Build tool and development server

### Backend

- **Node.js** with **Express**: v5.1.0 - Server framework
- **MongoDB** with **Mongoose**: v8.15.1 - Database
- **JWT**: v9.0.2 - Authentication
- **Bcrypt**: v6.0.0 - Password hashing
- **Express Validator**: v7.2.1 - Request validation
- **Redis**: Using ioredis v5.6.1 - For token blacklisting
- **Morgan**: v1.10.0 - HTTP request logger
- **CORS**: v2.8.5 - Cross-Origin Resource Sharing
- **Cookie Parser**: v1.4.7 - Parse cookies
- **Dotenv**: v16.5.0 - Environment variables

## Project Structure

### Frontend

```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   └── Footer.jsx
│   ├── config/
│   │   └── axios.js
│   ├── context/
│   │   └── user.context.jsx
│   ├── screens/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── Project.jsx
│   ├── App.jsx
│   ├── AppRoutes.jsx
│   ├── index.css
│   └── main.jsx
├── .env
├── package.json
└── tailwind.config.js
```

### Backend

```
backend/
├── controllers/
│   ├── user.controller.js
│   └── project.controller.js
├── middleware/
│   └── auth.middleware.js
├── models/
│   ├── user.model.js
│   └── project.model.js
├── routes/
│   ├── user.routes.js
│   └── project.routes.js
├── services/
│   ├── user.service.js
│   └── project.service.js
├── app.js
├── server.js
├── .env
└── package.json
```

## API Endpoints

### User Authentication

#### Register User
- **URL**: `/users/register`
- **Method**: `POST`
- **Body**: 
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**: 
  ```json
  {
    "user": {
      "_id": "user_id",
      "email": "user@example.com"
    },
    "token": "jwt_token"
  }
  ```

#### Login User
- **URL**: `/users/login`
- **Method**: `POST`
- **Body**: 
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**: 
  ```json
  {
    "user": {
      "_id": "user_id",
      "email": "user@example.com"
    },
    "token": "jwt_token"
  }
  ```

#### Get User Profile
- **URL**: `/users/profile`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer jwt_token`
- **Response**: 
  ```json
  {
    "_id": "user_id",
    "email": "user@example.com"
  }
  ```

#### Logout User
- **URL**: `/users/logout`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer jwt_token`
- **Response**: 
  ```json
  {
    "message": "Logged out successfully"
  }
  ```

#### Get All Users
- **URL**: `/users/all`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer jwt_token`
- **Response**: 
  ```json
  [
    {
      "_id": "user_id",
      "email": "user@example.com"
    }
  ]
  ```

### Project Management

#### Create Project
- **URL**: `/projects/create`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer jwt_token`
- **Body**: 
  ```json
  {
    "name": "Project Name"
  }
  ```
- **Response**: 
  ```json
  {
    "_id": "project_id",
    "name": "Project Name",
    "users": ["user_id"]
  }
  ```

#### Get All Projects
- **URL**: `/projects/all`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer jwt_token`
- **Response**: 
  ```json
  [
    {
      "_id": "project_id",
      "name": "Project Name",
      "users": ["user_id"]
    }
  ]
  ```

#### Add User to Project
- **URL**: `/projects/add-user`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer jwt_token`
- **Body**: 
  ```json
  {
    "projectId": "project_id",
    "userId": "user_id"
  }
  ```
- **Response**: 
  ```json
  {
    "_id": "project_id",
    "name": "Project Name",
    "users": ["user_id", "added_user_id"]
  }
  ```

#### Get Project by ID
- **URL**: `/projects/get-project/:projectId`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer jwt_token`
- **Response**: 
  ```json
  {
    "_id": "project_id",
    "name": "Project Name",
    "users": ["user_id"]
  }
  ```

## Pages

### Home Page
- Displays welcome message
- Features section
- List of user's projects with create project functionality
- Modern dark-themed UI with animations
- Header and Footer components

### Login Page
- Email and password input fields
- Sign in button
- Link to registration page
- Error handling for invalid credentials

### Register Page
- Email, password, and confirm password input fields
- Sign up button
- Link to login page
- Password matching validation
- Error handling for registration issues

### Project Page
- Chat interface for project communication
- Side panel for project members
- Message input and display area

## Recent Additions

### UI Enhancements
- Added modern dark-themed Header and Footer components
- Implemented animations for project cards and UI elements
- Enhanced overall user interface with a consistent dark theme
- Added responsive design for better mobile experience

### Styling
- Configured Tailwind CSS with dark mode support
- Added custom color palettes for primary, secondary, and dark themes
- Implemented animation keyframes for fade-in, slide-up, and pulse effects

## Getting Started

### Prerequisites
- Node.js
- MongoDB
- Redis

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/TayyabXtreme/DevInChat.git
   cd DevInChat
   ```

2. Install backend dependencies
   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies
   ```bash
   cd ../frontend
   npm install
   ```

4. Set up environment variables
   - Create `.env` file in the backend directory with the following variables:
     ```
     PORT=3000
     MONGO_URL=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     REDIS_HOST=your_redis_host
     REDIS_PORT=your_redis_port
     REDIS_PASSWORD=your_redis_password
     ```
   - Create `.env` file in the frontend directory with the following variable:
     ```
     VITE_API_URL=http://localhost:3000
     ```

5. Start the backend server
   ```bash
   cd backend
   npm run dev
   ```

6. Start the frontend development server
   ```bash
   cd ../frontend
   npm run dev
   ```

7. Open your browser and navigate to `http://localhost:5173`

## License

This project is licensed under the ISC License.