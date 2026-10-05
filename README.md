# SkillSwap

A peer-to-peer skill exchange platform. Teach what you know, learn what you don't — no money involved.

## Folder structure

```
skillswap/
  frontend/     React app (Vite + Tailwind) — what the user sees
  backend/      Express + MongoDB API — handles data, auth, real-time chat
```

Both live inside one parent folder. Open `skillswap` in your editor and run frontend and backend in two separate terminal tabs — they talk to each other over HTTP and WebSockets.

## How it works

1. **The backend** is a server sitting on port 5000. It talks to the database and listens for requests from the frontend.
2. **The frontend** runs on port 5173. Whenever a page needs data (like the list of users on the Discover page), it calls the backend at `http://localhost:5000/api/...`.
3. **Auth**: On login/register, the backend returns a JWT token, stored in the browser's `localStorage`. Every subsequent request automatically attaches this token (handled in `src/api/client.js`), and the backend verifies it before allowing access to protected routes.
4. **Real-time chat**: When the Matches page loads, the frontend opens a live Socket.io connection to the backend. Messages are delivered instantly to the other user — no page refresh needed.

## Running it locally

### 1. MongoDB

Install MongoDB locally, or create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

### 2. Backend

```
cd skillswap/backend
npm install
cp .env.example .env
```

Open `.env` and set `MONGO_URI` (your local or Atlas connection string) and `JWT_SECRET` (any random long string). Then:

```
npm run dev
```

You should see "Server running on port 5000" in the terminal.

### 3. Frontend

In a new terminal tab:

```
cd skillswap/frontend
npm install
cp .env.example .env
npm run dev
```

Open `http://localhost:5173` in your browser. Register an account first, then add skills from your Profile page.

## API reference

```
POST   /api/auth/register        { name, email, password, city }
POST   /api/auth/login           { email, password }
GET    /api/users/me             (current user's profile)
PUT    /api/users/me             { teaches, wants, city }
GET    /api/users?skill=guitar   (browse/search other users)
POST   /api/matches              { recipientId }
GET    /api/matches/requests     (pending swap requests sent to you)
PATCH  /api/matches/:id          { status: "accepted" | "declined" }
GET    /api/matches              (your accepted matches)
GET    /api/matches/:id/messages
```

## Features

- JWT-based authentication (register, login)
- User profiles with skills to teach and skills to learn
- Skill discovery with search by skill
- Match requests with accept/decline flow
- Real-time one-to-one chat via Socket.io, persisted to MongoDB

## Tech stack

**Frontend:** React (Vite), Tailwind CSS, React Router, Axios, Socket.io Client
**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcrypt, Socket.io

## Deployment

This project isn't deployed yet. To deploy:
- Frontend → [Vercel](https://vercel.com) or [Netlify](https://netlify.com)
- Backend → [Render](https://render.com) or [Railway](https://railway.app)
- Database → [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier)

Update `VITE_API_URL` and `VITE_SOCKET_URL` in the frontend, and `CLIENT_URL` in the backend, to point to the deployed URLs.