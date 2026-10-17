
# Jomao API Design

## Base URL

`/api`

## Authentication

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/auth/register` | Register a user |
| POST | `/auth/login` | Log in |
| GET | `/auth/me` | Get the authenticated user |

## Savings Goals

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/goals` | Create a goal |
| GET | `/goals` | List the authenticated user's goals |
| GET | `/goals/:goalId` | Get one goal |
| PATCH | `/goals/:goalId` | Update a goal |
| DELETE | `/goals/:goalId` | Delete a goal |
| POST | `/goals/:goalId/deposits` | Record a simulated deposit |

## Health Check

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | Check whether the API is running |

## Security Rules

- Validate incoming request data.
- Protect private endpoints with authentication.
- Users can access only their own goals.
- Store password hashes, never plaintext passwords.
- Deposits are simulated records; no real payments.



## Goal Data

Each goal belongs to one authenticated user.

| Field | Type | Purpose |
|---|---|---|
| `name` | string | Name of the savings goal |
| `targetAmount` | number | Amount the user wants to save |
| `targetDate` | date | Target completion date |
| `totalSaved` | number | Total simulated deposits |
| `userId` | ObjectId | Reference to the goal's owner |
| `createdAt` | date | When the goal was created |
| `updatedAt` | date | When the goal was last updated |

## Deposit Data

Each deposit belongs to a goal.

| Field | Type | Purpose |
|---|---|---|
| `amount` | number | Amount of the simulated deposit |
| `goalId` | ObjectId | Goal receiving the deposit |
| `createdAt` | date | When the deposit was recorded |

