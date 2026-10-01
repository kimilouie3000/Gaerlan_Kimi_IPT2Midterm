# Project Code Documentation

## Architecture

The browser runs the React application. React calls the Express REST API through `client/src/services/budgetService.js`. Express validates requests and uses the Mongoose model to read/write MongoDB. The browser never connects directly to MongoDB; database credentials remain in `server/.env`.

## Root files

- `package.json`: root scripts. `npm run setup` installs client and server dependencies; `npm run dev` runs both services.
- `.gitignore`: excludes dependencies, build output, and environment files from Git.
- `README.md`: setup, feature, API, and GitHub instructions.

## Frontend (`client/`)

- `client/package.json`: React, Vite, Recharts, Lucide icons, and development dependencies.
- `client/index.html`: HTML page that hosts React.
- `client/vite.config.js`: Vite development server configuration.
- `client/.env.example`: documents the API base URL. Copy to `client/.env`.
- `client/src/main.jsx`: imports global CSS and mounts the React app.
- `client/src/App.jsx`: application state, loading and error handling, summary calculations, chart data, search/filter controls, and create/edit/delete interactions.
- `client/src/styles.css`: responsive glassmorphism styling, layout, cards, forms, table/list rows, and mobile breakpoints.
- `client/src/services/budgetService.js`: centralizes HTTP requests and converts API errors into useful messages.

## Backend (`server/`)

- `server/package.json`: Express, Mongoose, CORS, dotenv, and nodemon.
- `server/.env.example`: environment variable template. Copy to `server/.env`; never commit the real file.
- `server/server.js`: loads configuration, connects to MongoDB, registers middleware and routes, and starts the HTTP server.
- `server/config/db.js`: creates the MongoDB connection and reports connection status.
- `server/models/BudgetEntry.js`: Mongoose schema, allowed types, required fields, and validation.
- `server/controllers/budgetController.js`: CRUD controller functions, filtering, search, and 404 handling.
- `server/routes/budgetRoutes.js`: maps HTTP methods and URLs to controller functions.
- `server/middleware/errorMiddleware.js`: central JSON error response handling.

## Budget record fields

- `title`: short description (required)
- `category`: category such as Operations, Supplies, Payroll, Travel, Marketing, Utilities, or Other
- `type`: `income` or `expense`
- `amount`: positive numeric amount
- `date`: transaction date
- `paymentMethod`: optional method label
- `notes`: optional details

## API examples

Create a record with `POST /api/entries`:

```json
{
  "title": "Office supplies",
  "category": "Supplies",
  "type": "expense",
  "amount": 1250,
  "date": "2026-10-01",
  "paymentMethod": "Bank transfer",
  "notes": "Monthly stationery"
}
```

List entries with `GET /api/entries`. Optional query parameters: `search`, `type`, `category`.

## Security notes

- Store secrets only in `server/.env`.
- Use a restricted Atlas database user, not an account owner credential.
- Restrict Atlas Network Access to your current IP for development rather than allowing all IPs permanently.
- This is a classroom project starter, not a production financial system. Authentication, authorization, audit logging, and stricter operational controls would be needed before real organizational use.
