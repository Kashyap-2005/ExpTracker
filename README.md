# ExpTracker

A personal expense tracker built with React, Express, and MongoDB. Track your daily spending, organize by category, and get a clear monthly breakdown on a dashboard.

## What this app does

- Register and log in with a personal account
- Add, edit, and delete expenses (title, amount, category, date)
- Categories: Food, Transport, Bills, Shopping, Other
- Dashboard showing total spent this month and a breakdown by category
- Filter expenses by month or category

## Project Structure

```
ExpTracker/
├── client/         React frontend (Vite)
└── server/         Express backend + MongoDB
```

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local install or a free Atlas cluster)

### 1. Clone and install

```bash
git clone <your-repo-url>
cd ExpTracker

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Configure environment variables

Inside `server/`, create a `.env` file based on `.env.example`:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/exptracker
JWT_SECRET=pick_a_strong_random_string
```

If you are using MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string.

### 3. Run the app

Open two terminals:

```bash
# Terminal 1 — backend
cd server
npm run dev

# Terminal 2 — frontend
cd client
npm run dev
```

The backend runs on `http://localhost:5000`  
The frontend runs on `http://localhost:5173`

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Create a new account |
| POST | /api/auth/login | Log in, receive JWT |
| GET | /api/expenses | List your expenses |
| POST | /api/expenses | Add an expense |
| PUT | /api/expenses/:id | Edit an expense |
| DELETE | /api/expenses/:id | Delete an expense |

## Tech Stack

| Part | Technology |
|------|-----------|
| Frontend | React 18, Vite, React Router v6 |
| Styling | Vanilla CSS |
| HTTP | Axios |
| Backend | Express.js |
| Database | MongoDB, Mongoose |
| Auth | bcryptjs, jsonwebtoken |

## Development Notes

This project is being built in phases:

- **Phase 1** — Project structure, schemas, server skeleton, React routing skeleton ✅
- **Phase 2** — Auth (register, login, JWT, protected routes) ✅
- **Phase 3** — Expense CRUD endpoints and UI ✅
- **Phase 4** — Dashboard analytics ✅
- **Phase 5** — Filters, validation, polish ✅

## License

MIT
