
# Organization Budget Tracker

A web-based budget management system that helps organizations record, monitor, and manage their budget entries in one place. The application uses React for the frontend, Node.js and Express for the backend, and MongoDB for database storage.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [System Requirements](#system-requirements)
- [Installation and Setup](#installation-and-setup)
- [Database Configuration](#database-configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Troubleshooting](#troubleshooting)
- [Security](#security)
- [Author](#author)
- [License](#license)

## Project Overview

The Organization Budget Tracker is designed to simplify the recording and monitoring of an organization's budget information. It provides a web interface for managing budget entries while storing the data in a MongoDB database.

The system follows a client-server architecture:

- **Frontend:** React provides the user interface.
- **Backend:** Node.js and Express handle API requests and application logic.
- **Database:** MongoDB stores budget records.
- **Database Management:** MongoDB Compass provides a graphical interface for viewing and managing the local database.

## Features

- Record and manage organization budget entries.
- View stored budget information through the web interface.
- Create, retrieve, update, and delete budget records, depending on the implemented backend routes.
- Store application data in MongoDB.
- Communicate between the frontend and backend through REST API endpoints.
- Separate frontend and backend code for easier maintenance.
- Run locally on a development computer.

> Note: The available features depend on the functionality implemented in the current source code.

## Technologies Used

| Technology | Purpose |
|---|---|
| React | Frontend user interface |
| Vite | Frontend development server and build tool |
| JavaScript | Application programming |
| Node.js | JavaScript runtime for the backend |
| Express.js | Backend web framework |
| MongoDB | NoSQL database |
| MongoDB Compass | Graphical database management |
| Mongoose | MongoDB object modeling, if used by the backend |
| npm | Package and dependency management |
| Git and GitHub | Version control and source code hosting |

## Project Structure

```text
organization-budget-tracker-v2/
├── client/
│   ├── src/
│   │   ├── services/
│   │   │   └── budgetService.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── budgetController.js
│   ├── middleware/
│   │   └── errorMiddleware.js
│   ├── models/
│   │   └── BudgetEntry.js
│   ├── routes/
│   │   └── budgetRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── .gitignore
├── README.md
└── DOCUMENTATION.md
```

## System Requirements

Install the following before running the application:

- Node.js (preferably a current LTS version).
- npm, which is included with Node.js.
- MongoDB Community Server.
- MongoDB Compass.
- Git (optional, for version control).

Check whether Node.js and npm are installed:

```bash
node --version
npm --version
```

Check Git if you intend to use it:

```bash
git --version
```

## Installation and Setup

### 1. Download or Clone the Project

If cloning the repository:

```bash
git clone https://github.com/kimilouie3000/Gaerlan_Kimi_IPT2Midterm.git
```

Enter the project directory:

```bash
cd Gaerlan_Kimi_IPT2Midterm
```

If you already have the project on your computer, open a terminal in the folder containing the `client` and `server` directories.

### 2. Install Backend Dependencies

Open a terminal and run:

```bash
cd server
npm install
```

### 3. Install Frontend Dependencies

Open another terminal and run:

```bash
cd client
npm install
```

## Database Configuration

This project can be configured to use a local MongoDB Community Server managed through MongoDB Compass.

### 1. Start MongoDB

Make sure the MongoDB Community Server service is running on your computer.

### 2. Connect MongoDB Compass

Open MongoDB Compass and connect using:

```text
mongodb://127.0.0.1:27017
```

### 3. Configure the Backend Environment

Inside the `server` directory, create a file named `.env` if it does not already exist.

Add the following configuration:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/organization_budget_tracker
```

Save the file.

**Important:** The `.env` file contains local configuration and should not be uploaded to GitHub. The backend must load environment variables and use `MONGODB_URI` in its database connection configuration.

### 4. Database Creation

The application connects to the `organization_budget_tracker` database. MongoDB normally creates the database and its collections when the application first writes data.

If your application uses a different database name or environment variable, adjust the configuration to match your source code.

## Running the Application

Run the frontend and backend in separate terminal windows.

### Terminal 1: Start the Backend

From the project root:

```bash
cd server
npm run dev
```

If the `dev` script is not available, check `server/package.json` for the available scripts.

The backend should start on port `5000`, provided that this is the configured port.

### Terminal 2: Start the Frontend

From the project root:

```bash
cd client
npm run dev
```

Vite normally serves the development application at:

```text
http://localhost:5173/
```

Open that address in your browser.

Keep both terminals running while using the application.

## API Endpoints

The backend exposes budget-related API routes. The exact endpoints and supported HTTP methods should match the implementation in `server/routes/budgetRoutes.js` and `server/controllers/budgetController.js`.

A typical REST API may use the following methods:

| HTTP Method | Purpose |
|---|---|
| GET | Retrieve budget entries |
| POST | Create a budget entry |
| PUT or PATCH | Update an existing entry |
| DELETE | Delete an entry |

The exact URL paths, required fields, and response formats should be confirmed from the current backend source code.

## Troubleshooting

### MongoDB Connection Error

- Confirm that the MongoDB Community Server service is running.
- Check the `MONGODB_URI` value in `server/.env`.
- Confirm that the local connection string uses `127.0.0.1:27017`.
- Restart the backend after changing `.env`.

### Frontend Cannot Connect to Backend

- Make sure the backend is running.
- Check the API base URL in `client/src/services/budgetService.js`.
- Confirm that the frontend is requesting the correct backend port and route.
- Check the browser console and backend terminal for errors.

### Port Already in Use

If port `5173` or `5000` is already occupied, stop the other process using that port or configure the application to use another available port.

### Missing Dependencies

Run the following commands in the appropriate directory:

```bash
npm install
```

### Changes to Environment Variables Do Not Apply

Restart the relevant development server after editing `.env`. Ensure the environment file is in the correct directory and that its variable names match the backend code.

## Security

- Never commit `.env` files, passwords, database credentials, or API keys.
- Keep `.env.example` limited to placeholder values.
- Do not publish real secrets in source code, screenshots, documentation, or GitHub commits.
- Validate and sanitize incoming API data.
- Use appropriate access controls before deploying the application for real organizational use.

## Author

**Kim Louie Jaucian**

GitHub: [@kimilouie3000](https://github.com/kimilouie3000)

## License

This project is intended for educational and academic purposes. Add a formal open-source license file if you intend to distribute the project under a specific license.
