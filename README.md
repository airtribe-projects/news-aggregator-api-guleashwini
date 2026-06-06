[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=24088987&assignment_repo_type=AssignmentRepo)

# News Aggregator API

A RESTful API built with Node.js and Express.js that delivers personalized news articles based on user-defined preferences. It features JWT-based authentication, bcrypt password hashing, input validation, and integration with the [NewsAPI](https://newsapi.org) external news service.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Server](#running-the-server)
- [Running Tests](#running-tests)
- [API Reference](#api-reference)

---

## Project Overview

Users register and log in to receive a JWT token. That token is required to access protected endpoints. Once authenticated, users can manage their news preferences (topics like `movies`, `sports`, `technology`) and fetch live news articles matching those preferences from NewsAPI.

---

## Tech Stack

| Package | Purpose |
|---|---|
| Express.js | HTTP server and routing |
| bcrypt | Password hashing |
| jsonwebtoken | JWT generation and verification |
| axios | HTTP client for NewsAPI requests |
| dotenv | Load environment variables from `.env` |
| tap | Test runner |
| supertest | HTTP assertion library for tests |

---

## Project Structure

```
app.js                    # Entry point — Express setup, mounts routers
├── routes/
│   ├── users.js          # /users/* route definitions
│   └── news.js           # /news/* route definitions
├── controllers/
│   ├── usersController.js # Handles auth and preferences req/res
│   └── newsController.js  # Handles news fetching req/res
├── services/
│   ├── usersService.js    # User store, bcrypt hashing, JWT generation
│   └── newsService.js     # NewsAPI integration via axios
├── middleware/
│   ├── auth.js            # JWT verification middleware
│   └── validate.js        # Input validation middleware
└── test/
    └── server.test.js     # Full API test suite (tap + supertest)
```

---

## Installation

**Requirements:** Node.js >= 18

```bash
git clone <repo-url>
cd news-aggregator-api
npm install
```

---

## Configuration

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

`.env` variables:

| Variable | Required | Description |
|---|---|---|
| `NEWS_API_KEY` | No* | API key from [newsapi.org](https://newsapi.org). Without it, `GET /news` returns `[]`. |
| `JWT_SECRET` | No | Secret used to sign JWT tokens. Defaults to a hardcoded dev value — **set this in production**. |

---

## Running the Server

```bash
node app.js
```

Server starts on `http://localhost:3000`.

---

## Running Tests

```bash
npm test
```

The test suite creates a user, logs in, exercises all endpoints, and tears down. All 15 assertions must pass.

---

## API Reference

### Authentication

#### `POST /users/signup`

Register a new user.

**Request body:**
```json
{
  "name": "Clark Kent",
  "email": "clark@superman.com",
  "password": "Krypt()n8",
  "preferences": ["movies", "comics"]
}
```

| Field | Required | Rules |
|---|---|---|
| `name` | Yes | Non-empty string |
| `email` | Yes | Valid email format |
| `password` | Yes | Minimum 8 characters |
| `preferences` | No | Array of strings |

**Responses:**

| Status | Meaning |
|---|---|
| `200` | User registered successfully |
| `400` | Validation failed (missing/invalid fields) |
| `400` | Email already registered |

---

#### `POST /users/login`

Log in and receive a JWT token.

**Request body:**
```json
{
  "email": "clark@superman.com",
  "password": "Krypt()n8"
}
```

**Responses:**

| Status | Body | Meaning |
|---|---|---|
| `200` | `{ "token": "<jwt>" }` | Login successful |
| `400` | `{ "message": "..." }` | Missing/invalid fields |
| `401` | `{ "message": "Invalid credentials" }` | Wrong email or password |

---

### Preferences

All preference endpoints require the `Authorization` header:

```
Authorization: Bearer <token>
```

#### `GET /users/preferences`

Retrieve the logged-in user's preferences.

**Response `200`:**
```json
{
  "preferences": ["movies", "comics"]
}
```

---

#### `PUT /users/preferences`

Replace the logged-in user's preferences.

**Request body:**
```json
{
  "preferences": ["movies", "comics", "games"]
}
```

**Responses:**

| Status | Meaning |
|---|---|
| `200` | Preferences updated |
| `400` | `preferences` missing or not an array of strings |
| `401` | Missing or invalid token |

---

### News

#### `GET /news`

Fetch news articles matching the logged-in user's preferences.

Requires `Authorization: Bearer <token>`.

Sends a query of `"preference1 OR preference2 OR ..."` to NewsAPI and returns up to 10 results sorted by publish date.

**Response `200`:**
```json
{
  "news": [
    {
      "source": { "id": "...", "name": "..." },
      "author": "...",
      "title": "...",
      "description": "...",
      "url": "...",
      "publishedAt": "..."
    }
  ]
}
```

| Status | Meaning |
|---|---|
| `200` | Articles returned (empty array if no API key configured) |
| `401` | Missing or invalid token |
| `500` | NewsAPI request failed |

