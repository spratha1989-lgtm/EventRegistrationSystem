# EventHub – Event Registration System

EventHub is a full-stack web application that allows users to explore upcoming events, register for events, and manage their registrations.

## Features

- View upcoming events
- User login and JWT authentication
- Role-based access control for administrators
- Create and manage events
- Register for events
- View personal registrations
- Cancel event registrations
- Validate event registration capacity
- React frontend integrated with REST APIs
- MongoDB database integration

## Technology Stack

**Frontend:** React.js, Vite, CSS

**Backend:** Node.js, Express.js

**Database:** MongoDB, Mongoose

**Authentication:** JSON Web Token (JWT)

**Tools:** VS Code, Postman, Git, GitHub

## Project Structure

```text
EventRegistrationSystem/
├── config/
├── controllers/
├── frontend/
│   └── src/
├── middleware/
├── models/
├── routes/
├── .gitignore
├── package.json
└── server.js
```

## Installation and Setup

### Prerequisites

- Node.js and npm
- MongoDB
- Git

### 1. Clone the repository

```bash
git clone https://github.com/spratha1989-lgtm/EventRegistrationSystem.git
cd EventRegistrationSystem
```

### 2. Install backend dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root and configure the variables required by your application.

Example:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/event_registration_db
JWT_SECRET=your_secure_secret
```

Use the exact variable names expected by your backend configuration. Do not commit your real `.env` file or secrets to GitHub.

### 4. Start the backend

```bash
npm start
```

The backend should run at `http://localhost:5000`.

### 5. Start the frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed in the terminal.

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/events` | Retrieve events |
| POST | `/api/users/login` | Log in |
| POST | `/api/registrations` | Register for an event |
| GET | `/api/registrations/user` | View personal registrations |
| DELETE | `/api/registrations/:id` | Cancel a registration |

Protected endpoints require a valid authentication token. Some operations are restricted to administrators.

## Learning Objectives

This project demonstrates REST API development, authentication, authorization, database integration, CRUD operations, frontend-backend communication, and Git version control.

## Author

Developed as a full-stack web development project using React.js, Node.js, Express.js, and MongoDB.
