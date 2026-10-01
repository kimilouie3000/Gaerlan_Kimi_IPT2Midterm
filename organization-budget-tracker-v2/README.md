# Organization Budget Tracker

A full-stack organization budget tracker built with React, Vite, Node.js, Express, and MongoDB (local MongoDB or MongoDB Atlas). It features a responsive glass-inspired dashboard, budget-entry CRUD, search, filters, summaries, and charts.

## Requirements

- Node.js 20+ recommended (Node.js 18+ may work)
- npm
- MongoDB Atlas account or a local MongoDB server
- Git (for version control and GitHub submission)

## 1. Install dependencies

Open this project root in VS Code. The root folder must contain `package.json`, `client/`, and `server/`.

```powershell
npm install
npm run setup
```

## 2. Configure the backend

Copy the example environment file:

```powershell
Copy-Item server\.env.example server\.env
```

Edit `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@YOUR_CLUSTER.mongodb.net/organization_budget_tracker?retryWrites=true&w=majority
CLIENT_URL=http://localhost:5173
```

Replace the Atlas placeholders with your actual connection details. In Atlas, create a database user and allow your development IP under Network Access. Never commit `.env` or share the URI. If your password has special characters, URL-encode them.

For a local MongoDB instance, use:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/organization_budget_tracker
```

## 3. Configure the frontend

Copy the frontend environment example:

```powershell
Copy-Item client\.env.example client\.env
```

The default value is:

```env
VITE_API_URL=http://localhost:5000/api
```

## 4. Run the application

From the project root:

```powershell
npm run dev
```

Vite normally serves the frontend at `http://localhost:5173`. The Express API runs at `http://localhost:5000`; check `http://localhost:5000/api/health` for API health and database status.

Keep the terminal open while using the app. Press `Ctrl+C` to stop both development processes.

## Features

- Create, view, edit, and delete budget entries
- Entry fields: title, category, type (income/expense), amount, date, payment method, and notes
- Search by title, category, payment method, and notes
- Filter by type and category
- Dashboard totals for income, expenses, and balance
- Monthly expense chart and category breakdown
- Responsive layout and glass-inspired visual design
- Loading, empty, validation, and API error states
- Persistent records stored in MongoDB

## REST API

Base URL: `/api/entries`

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | API and database health |
| GET | `/api/entries` | List entries; supports `search`, `type`, `category` query parameters |
| GET | `/api/entries/:id` | Get one entry |
| POST | `/api/entries` | Create an entry |
| PUT | `/api/entries/:id` | Update an entry |
| DELETE | `/api/entries/:id` | Delete an entry |

All API responses are JSON. Amounts must be positive numbers. The backend validates input and returns appropriate HTTP status codes.

## Git and GitHub submission

Check that `.env` files are ignored before committing. Make meaningful commits as you implement and test each feature. Create the repository using the exact name specified by your instructor.

```powershell
git init
git add .
git commit -m "chore: initialize budget tracker"
git branch -M main
git switch -c feat/budget-dashboard
```

After making and testing actual changes, commit each meaningful unit of work. Merge the feature branch when ready:

```powershell
git add .
git commit -m "feat: complete budget dashboard"
git switch main
git merge feat/budget-dashboard
```

Then create an empty GitHub repository and connect it:

```powershell
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

Replace the placeholder with your repository URL. Do not claim the project is complete until you have run and tested it locally.
