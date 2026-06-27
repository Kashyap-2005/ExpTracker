# ExpTracker 💸

A premium, dark-themed personal expense tracker built with React, Express, and MongoDB. Track your daily spending, organize by category, and get a clear monthly breakdown on a beautifully designed dashboard.

![Dashboard Preview](assets/dashboard.png)

## Features

- **Secure Authentication**: Register and log in securely with JWT-based sessions.
- **Expense Management**: Add, edit, and delete expenses (title, amount, category, date).
- **Categorization**: Group spending into categories (Food, Transport, Bills, Shopping, Other) with distinct color coding.
- **Smart Dashboard**: Instantly see your total monthly spend and a visual percentage breakdown across categories, plus a quick view of your most recent expenses.
- **Filtering**: Easily filter your expenses list by month or specific category.
- **Premium UI**: Built with a custom dark-mode design system, featuring glassmorphism, smooth animations, and toast notifications.

![Expenses Preview](assets/expenses.png)

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
git clone https://github.com/Kashyap-2005/ExpTracker.git
cd ExpTracker

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Configure environment variables

Inside the `server/` directory, create a `.env` file based on `.env.example`:

```env
PORT=5000
# Replace with your actual MongoDB connection string
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>/exptracker?retryWrites=true&w=majority&appName=ExpTracker
# Use a strong, random secret key for JWT signing
JWT_SECRET=your_super_secret_key_here
```

### 3. Run the app

Open two terminals:

```bash
# Terminal 1 — Start the backend server
cd server
npm run dev

# Terminal 2 — Start the React frontend
cd client
npm run dev
```

- The backend API runs on `http://localhost:5000`  
- The frontend app runs on `http://localhost:5173`

## Tech Stack

| Layer | Technology |
|------|-----------|
| **Frontend** | React 18, Vite, React Router v6 |
| **Styling** | Custom Vanilla CSS (Design Tokens, CSS Variables) |
| **HTTP Client** | Axios (with interceptors) |
| **Notifications** | react-hot-toast |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose |
| **Authentication**| bcryptjs, jsonwebtoken |

## License

MIT
