# Jomao

**Jomao** is a goal-based savings application designed to help users develop disciplined saving habits by creating financial goals, recording deposits, and tracking their savings progress.

The project is currently under development, with a focus on building a secure and scalable backend using Node.js, Express, TypeScript, and MongoDB.

> **Current scope:** This is a simulated savings application. It does not process real financial transactions, hold users' money, or integrate with payment providers.

## Features

### Authentication

- User registration and login.
- Password hashing.
- JWT-based authentication.
- Protected API routes.

### Savings Goals

- Create personal savings goals.
- Retrieve all goals belonging to the authenticated user.
- Retrieve individual goals.
- Set target amounts and saving durations.
- Track current savings and goal progress.
- Automatically mark goals as completed when the target is reached or exceeded.

### Deposits and Transactions

- Record simulated deposits against savings goals.
- Maintain individual transaction records.
- Retrieve transaction history.
- Prevent duplicate deposit processing using idempotency keys.
- Update goal balances and transaction history atomically using MongoDB transactions.

## Tech Stack

| Technology     | Purpose                 |
| -------------- | ----------------------- |
| Node.js        | JavaScript runtime      |
| Express.js     | Backend framework       |
| TypeScript     | Static typing           |
| MongoDB Atlas  | Database                |
| Mongoose       | MongoDB object modeling |
| Zod            | Request validation      |
| JSON Web Token | Authentication          |
| Argon2         | Password hashing        |

## Project Structure

```text
Jomao/
└── server/
    ├── src/
    │   ├── config/          # Environment and database configuration
    │   ├── controllers/     # Request handling and business logic
    │   ├── middleware/      # Authentication and validation middleware
    │   ├── models/          # Mongoose database models
    │   ├── routes/          # API route definitions
    │   ├── types/           # TypeScript type definitions
    │   ├── utilities/       # Shared utilities and validators
    │   ├── app.ts           # Express application configuration
    │   └── server.ts        # Server entry point
    ├── .env.example
    ├── package.json
    └── tsconfig.json
```

*The structure may evolve as development progresses.*

## Database Models

Jomao currently uses three primary collections:

### User

Stores user account information, including authentication credentials.

### Goal

Stores each user's savings goals, including:

- Target amount
- Current saved amount
- Saving duration
- Maturity date
- Goal status

### Transaction

Stores individual deposit records, including:

- User reference
- Goal reference
- Deposit amount
- Transaction type
- Idempotency key
- Creation timestamp

Each successful deposit updates the corresponding goal balance and creates a transaction record.

## Getting Started

### Prerequisites

- Node.js
- npm
- MongoDB Atlas account or a compatible MongoDB deployment

### 1. Clone the repository

```bash
git https://github.com/SalmanMokarrom/Jomao
cd Jomao/server
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file inside the server directory.

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Use `.env.example` as a reference if available.

**Never commit your `.env` file or expose database credentials and JWT secrets.**

### 4. Start the development server

```bash
npm run dev
```

The API should be available at:

```text
http://localhost:3000
```

## API Endpoints

The following endpoints represent the planned/current API surface. Verify implementation status before relying on each endpoint.

| Method | Endpoint                      | Description                       |
| ------ | ----------------------------- | --------------------------------- |
| POST   | `/user/register`              | Register a user                   |
| POST   | `/user/login`                 | Authenticate a user               |
| GET    | `/user/me`                    | Retrieve authenticated user       |
| POST   | `/goal/create`                      | Create a savings goal             |
| GET    | `/goal/goals`                      | Retrieve user's goals             |
| GET    | `goal/singleGoal/:goalId`              | Retrieve a specific goal          |
| POST   | `/goals/:goalId/deposits`     | Record a simulated deposit        |
| GET    | `/goals/:goalId/transactions` | Retrieve goal transaction history |

Protected endpoints require a valid JWT access token.

Example authorization header:

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

## Deposit Processing

Jomao uses MongoDB transactions to maintain consistency between goal balances and transaction history.

The deposit workflow:

1. Authenticate the user.
2. Validate the goal and deposit request.
3. Check the idempotency key to prevent duplicate processing.
4. Verify goal ownership and active status.
5. Update the goal's current amount.
6. Create a transaction record.
7. Mark the goal as complete when its target is reached or exceeded.

Deposits can exceed the remaining target. Once a goal is completed, additional deposits to that goal are rejected.

## Development Roadmap

- [x] Initial Express and TypeScript backend setup
- [x] MongoDB and Mongoose integration
- [x] Initial database model development
- [x] Git and GitHub workflow practice
- [x] Goal deposit and transaction workflow development
- [x] Complete authentication and authorization testing
- [x] Complete goal and transaction API testing
- [x] Centralized error handling
- [ ] Automated backend testing
- [ ] React frontend development
- [ ] Docker containerization
- [ ] CI/CD pipeline
- [ ] Cloud deployment

## Project Status

Jomao is an actively developed personal project. The current priority is building a reliable backend architecture, implementing core savings functionality, and developing good software engineering practices.

## License

This project is currently developed for learning and experimentation. A formal license may be added later.
