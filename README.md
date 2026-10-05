# SkillSwap

Peer-to-peer skill exchange platform. Teach what you know, learn what you don't, no money involved.

## Folder structure

```
skillswap/
  frontend/     React app (Vite + Tailwind) — what the user sees
  backend/      Express + MongoDB API — handles data, auth, real-time chat
```

Dono ek hi parent folder ke andar hain. VS Code mein `skillswap` folder khol lo, do terminal tabs rakho — dono ek saath chalenge, ek dusre se baat karte hain.

## How the whole thing works

1. **Backend sabse pehle chalta hai** — ye ek server hai jo port 5000 pe baitha rehta hai, database se baat karta hai, aur frontend ki requests sunta hai.
2. **Frontend port 5173 pe chalta hai** — jab bhi koi page data maangta hai (jaise Discover page pe users ki list), wo backend ko `http://localhost:5000/api/...` pe request bhejta hai.
3. **Auth**: Login/Register karte waqt backend ek JWT token deta hai, jo browser ke `localStorage` mein save hota hai. Har request ke saath ye token automatically bheja jata hai (`src/api/client.js` mein ye kaam ho raha hai), backend check karta hai token valid hai ya nahi.
4. **Real-time chat**: Jab Matches page khulta hai, frontend Socket.io se backend ke saath ek live connection banata hai. Jaise hi koi message bhejta hai, backend turant dusre user tak pahunchata hai — bina page reload kiye.

## Running it locally

### 1. MongoDB

Local MongoDB install karo, ya [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) pe free cluster bana lo (easier, no install needed).

### 2. Backend

```
cd skillswap/backend
npm install
cp .env.example .env
```

`.env` file khol ke `MONGO_URI` (Atlas ka connection string ya local wala) aur `JWT_SECRET` (koi bhi random long string) daal do. Phir:

```
npm run dev
```

Terminal mein "Server running on port 5000" dikhna chahiye.

### 3. Frontend

Naya terminal tab kholo:

```
cd skillswap/frontend
npm install
cp .env.example .env
npm run dev
```

Browser mein `http://localhost:5173` khul jayega. Pehle `/register` pe jaake account banao, phir Profile mein skills add karo.

## API reference

```
POST   /api/auth/register        { name, email, password, city }
POST   /api/auth/login           { email, password }
GET    /api/users/me             (current user's profile)
PUT    /api/users/me             { teaches, wants, city }
GET    /api/users?skill=guitar   (browse/search other users)
POST   /api/matches              { recipientId }
PATCH  /api/matches/:id          { status: "accepted" | "declined" }
GET    /api/matches              (your accepted matches)
GET    /api/matches/:id/messages
```

## Pushing to GitHub

Pura `skillswap` folder — frontend aur backend dono — ek hi repo mein rakho.

```
cd skillswap
```

Root mein ek `.gitignore` banao taaki `node_modules` aur `.env` (jisme secrets hain) GitHub pe na jaye:

```
echo "node_modules/
.env" > .gitignore
```

Phir:

```
git init
git add .
git commit -m "skillswap: full-stack MERN skill exchange platform"
git branch -M main
git remote add origin <tumhara-github-repo-url>
git push -u origin main
```

GitHub pe repo pehle khud bana lena (empty, bina README ke) — phir upar wala `remote add` command us repo ka URL use karega.

**Resume/portfolio ke liye**: repo ka README (ye wala) already explain karta hai project kya karta hai aur kaise chalana hai — recruiters jab dekhenge to turant samajh jayenge ye ek complete, working full-stack app hai, sirf UI nahi.
