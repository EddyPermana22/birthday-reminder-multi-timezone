# Birthday Notification Service

This project is a Birthday Notification Service built with Node.js, TypeScript, Express, and various other libraries. It includes functionalities for scheduling and sending birthday notifications, managing users, and monitoring queues.

## Table of Contents

- [Birthday Notification Service](#birthday-notification-service)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Scripts](#scripts)
  - [Project Structure](#project-structure)
  - [Endpoints](#endpoints)
    - [User Endpoints](#user-endpoints)
      - [Create User](#create-user)
      - [Get All Users](#get-all-users)
      - [Get User by ID](#get-user-by-id)
      - [Update User by ID](#update-user-by-id)
      - [Delete User by ID](#delete-user-by-id)
  - [Environment Variables](#environment-variables)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/eddypermana22/birthday-notification-service.git
   cd birthday-notification-service
   ```

2. Install dependencies:

   ```bash
   yarn install
   ```

3. Create a `.env` file in the root directory and configure it based on the `.env.example` file.

## Configuration

Create a `.env` file in the root directory with the following content:

```plaintext
# Timezone setting for the application
TZ=Asia/Jakarta

# Port number on which the application will run
PORT=3131

# MongoDB connection URI
MONGODB_URI=mongodb://localhost:27017/yourdb

# Endpoint for sending birthday messages
BIRTHDAY_MESSAGE_ENDPOINT=https://email-service.digitalenvision.com.au/send-email

# Redis server host
REDIS_HOST=127.0.0.1

# Redis server port
REDIS_PORT=6379

# Redis database number
REDIS_DB=1

# Port number for the queue dashboard
QUEUE_DASHBOARD_PORT=3030

# Number of worker processes for handling jobs
NUM_WORKERS=1
```

## Scripts

The following scripts are available in the `package.json` file:

- **Start API Server**:

  ```bash
  yarn start-api-server
  ```

  Runs the API server using `ts-node`.

- **Start Scheduler**:

  ```bash
  yarn start-scheduler
  ```

  Runs the birthday notification scheduler using `ts-node`.

- **Start Worker**:

  ```bash
  yarn start-worker
  ```

  Runs the worker for processing birthday notification jobs using `ts-node`.

- **Start Queue Dashboard**:

  ```bash
  yarn start-queue-dashboard
  ```

  Runs the queue dashboard using `ts-node`.

  Queue Dashboard can be assess on the path `/admin/queues`

- **Build**:

  ```bash
  yarn build
  ```

  Compiles the TypeScript project to JavaScript.

- **Start**:
  ```bash
  yarn start
  ```
  Runs the compiled JavaScript project from the `dist` directory.

## Project Structure

```
your-project/
├── src/
│   ├── configs/
│   │   └── mongoDBConnection.ts
│   │   └── redisConnection.ts
│   ├── middlewares/
│   │   └── errorHandler.ts
│   ├── models/
│   │   └── userModel.ts
│   ├── services/
│   │   └── userService.ts
│   │   └── birthdayNotificationService.ts
│   ├── validators/
│   │   └── userValidator.ts
│   ├── controllers/
│   │   └── userController.ts
│   ├── routers/
│   │   └── userRouter.ts
│   │   └── mainRouter.ts
│   ├── schedulers/
│   │   └── queueDashboard.ts
│   │   └── birthday/
│   │       └── birthdayNotificationQueue.ts
│   │       └── birthdayNotificationWorker.ts
│   │       └── birthdayNotificationScheduler.ts
│   └── app.ts
├── index.ts
├── .gitignore
├── .env
├── package.json
├── tsconfig.json
└── ...
```

## Endpoints

### User Endpoints

#### Create User

- **URL**: `/users`
- **Method**: `POST`
- **Description**: Creates a new user.
- **Request Body**:
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "birthdate": "1990-01-01",
    "location": "New York"
  }
  ```
- **Response**:
  ```json
  {
    "message": "User created successfully",
    "user": {
      "userId": "uuid",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "birthdate": "1990-01-01T00:00:00.000Z",
      "location": {
        "city": "New York",
        "timezone": "America/New_York"
      },
      "isDeleted": false
    }
  }
  ```

#### Get All Users

- **URL**: `/users`
- **Method**: `GET`
- **Description**: Retrieves all users.
- **Response**:
  ```json
  [
    {
      "userId": "uuid",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "birthdate": "1990-01-01T00:00:00.000Z",
      "location": {
        "city": "New York",
        "timezone": "America/New_York"
      },
      "isDeleted": false
    }
  ]
  ```

#### Get User by ID

- **URL**: `/users/:id`
- **Method**: `GET`
- **Description**: Retrieves a user by their ID.
- **Response**:
  ```json
  {
    "message": "User retrieved successfully",
    "user": {
      "userId": "uuid",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "birthdate": "1990-01-01T00:00:00.000Z",
      "location": {
        "city": "New York",
        "timezone": "America/New_York"
      },
      "isDeleted": false
    }
  }
  ```

#### Update User by ID

- **URL**: `/users/:id`
- **Method**: `PUT`
- **Description**: Updates a user by their ID.
- **Request Body**:
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "birthdate": "1990-01-01",
    "location": "New York"
  }
  ```
- **Response**:

  ```json
  {
    "userId": "uuid",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "birthdate": "1990-01-01T00:00:00.000Z",
    "location": {
      "city": "New York",
      "timezone": "America/New_York"
    },
    "isDeleted": false
  }
  ```

#### Delete User by ID

- **URL**: `/users/:id`
- **Method**: `DELETE`
- **Description**: Deletes a user by their ID.
- **Response**:

  ```json
  {
    "message": "User deleted successfully"
  }
  ```

## Environment Variables

- **TZ**: Timezone setting for the application. Example: `Asia/Jakarta`.
- **PORT**: Port number on which the application will run. Example: `3131`.
- **MONGODB_URI**: MongoDB connection URI. Example: `mongodb://localhost:27017/yourdb`.
- **BIRTHDAY_MESSAGE_ENDPOINT**: Endpoint for sending birthday messages. Example: `https://email-service.digitalenvision.com.au/send-email`.
- **REDIS_HOST**: Redis server host. Example: `127.0.0.1`.
- **REDIS_PORT**: Redis server port. Example: `6379`.
- **REDIS_DB**: Redis database number. Example: `1`.
- **QUEUE_DASHBOARD_PORT**: Port number for the queue dashboard. Example: `3030`.
- **NUM_WORKERS**: Number of worker processes for handling jobs. Example: `1`.
