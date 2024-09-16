# Task Manager Application

A full-stack task management application that allows users to manage tasks across different columns with drag-and-drop functionality. The application supports user authentication, including standard login and Google login. Built with React.js on the frontend and Node.js/Express on the backend, the application utilizes REST APIs for communication, and Redux for state management.

## Features

- **User Authentication**: Users can register, log in, and log in with Google.
- **Task Management**: Users can create, update, delete, and manage tasks.
- **Drag-and-Drop Functionality**: Tasks can be dragged between different columns.
- **Task Organization**: Tasks can be sorted by category or priority.
- **Responsive UI**: The application is fully responsive across different devices.
- **REST API**: Backend is built with RESTful APIs for handling requests.
- **Redux State Management**: Redux is used to manage the state of the application.
- **Error Handling**: Proper error handling both on client and server sides.

## Technology Stack

### Frontend
- **React.js**: JavaScript library for building user interfaces.
- **Redux**: State management for handling global state.
- **Axios**: For making HTTP requests to the backend.
- **React Router**: For client-side routing and navigation.
- **Google OAuth**: Google login integration using OAuth.

### Backend
- **Node.js**: JavaScript runtime environment.
- **Express.js**: Web framework for building REST APIs.
- **MongoDB**: NoSQL database for storing tasks and user data.
- **Mongoose**: Object Data Modeling (ODM) library for MongoDB.
- **JWT**: For user authentication and authorization.
- **Google OAuth**: Google login integration using OAuth.

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/task-manager.git
cd task-manager
```

### 2. Install dependencies for both client and server
client
```bash
cd client
npm install
```
server
```bash
cd ../server
npm install

```

### 3. Environment Setup
Backend (Server)
Create a .env file in the server/ directory and add the following environment variables:

env
```bash
PORT=5000
MONGODB_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/taskmanager
JWT_SECRET=<your_jwt_secret>
GOOGLE_CLIENT_ID=<your_google_client_id>
GOOGLE_CLIENT_SECRET=<your_google_client_secret>
FRONTEND_URL=<your_frontend_url
```

### 4. Start the application
Backend (Server)
```bash
cd server
npm start
```
Frontend (Client)
```bash

cd client
npm start
```

## Deployment

### Frontend

The frontend is deployed using **Netlify**. Once deployed, make sure to update the `FRONTEND_URL` in your backend `.env` file. You can deploy the React app by linking your GitHub repository to Netlify and setting up environment variables.

### Backend

The backend is deployed using **Render** or any other cloud provider. Once deployed, update the `REACT_APP_API_URL` in your frontend `.env` file.

## REST API Endpoints

| Endpoint                  | Method | Description                       |
| -------------------------- | ------ | --------------------------------- |
| `/api/v1/auth/signup`      | POST   | User registration                 |
| `/api/v1/auth/login`       | POST   | User login                        |
| `/api/v1/auth/google`      | POST   | Google login                      |
| `/api/v1/tasks`            | GET    | Retrieve all tasks                |
| `/api/v1/tasks`            | POST   | Create a new task                 |
| `/api/v1/tasks/:id`        | PUT    | Update a task                     |
| `/api/v1/tasks/:id`        | DELETE | Delete a task                     |

## Google Authentication

To enable Google OAuth, you need to:

1. Create a project in Google Developers Console.
2. Enable OAuth for the project.
3. Obtain the **Client ID** and **Client Secret**.
4. Use these credentials in the backend and frontend `.env` files.

## Testing

You can run unit tests for critical parts of the application, such as API endpoints and Redux actions.

### Running Tests

To run tests in the backend:
```bash
cd server
npm test
```

## Deployment

### Frontend

The frontend is deployed using **Netlify**. Once deployed, make sure to update the `FRONTEND_URL` in your backend `.env` file. You can deploy the React app by linking your GitHub repository to Netlify and setting up environment variables.

### Backend

The backend is deployed using **Render** or any other cloud provider. Once deployed, update the `REACT_APP_API_URL` in your frontend `.env` file.

## REST API Endpoints

| Endpoint                  | Method | Description                       |
| -------------------------- | ------ | --------------------------------- |
| `/api/v1/auth/signup`      | POST   | User registration                 |
| `/api/v1/auth/login`       | POST   | User login                        |
| `/api/v1/auth/google`      | POST   | Google login                      |
| `/api/v1/tasks`            | GET    | Retrieve all tasks                |
| `/api/v1/tasks`            | POST   | Create a new task                 |
| `/api/v1/tasks/:id`        | PUT    | Update a task                     |
| `/api/v1/tasks/:id`        | DELETE | Delete a task                     |

## Google Authentication

To enable Google OAuth, you need to:

1. Create a project in Google Developers Console.
2. Enable OAuth for the project.
3. Obtain the **Client ID** and **Client Secret**.
4. Use these credentials in the backend and frontend `.env` files.

## Testing

You can run unit tests for critical parts of the application, such as API endpoints and Redux actions.

### Running Tests

To run tests in the backend:
```bash
cd server
npm test
```

