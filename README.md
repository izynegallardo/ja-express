# ja-express

A minimal Express backend boilerplate - auth-ready, MySQL-backed, with a testing setup already wired in.

## Stack

- Express 5
- MySQL (via `mysql2`)
- JWT auth (`jsonwebtoken`)
- Jest + Supertest for testing
- Zod for request validation

## Quick Start

Scaffold a new project with:

```bash
npm create ja-express@latest express-project
cd express-project
```

This downloads this template into `express-project`. Then continue below to finish setup.

## Getting Started

```bash
npm install
cp .env.example .env
```

Fill in `.env` with your local MySQL credentials, then create the tables:

```bash
npm run migrate
```

Start the dev server:

```bash
npm run dev
```

## Project Structure

```
index.js                # Entry point - loads env, starts the server
src/
  app.js                # Builds the Express app (no .listen - used by tests too)
  routes/v1/            # Route definitions
  controllers/v1/       # Request handlers
  models/               # DB queries (mysql2)
  middlewares/          # authentication / authorization
  schemas/              # Zod request validation schemas
  services/             # External integrations (e.g. email)
  utils/                # Helpers (jwt, hashing, etc.)
migrations/             # SQL table definitions
scripts/migrate.js      # Runs the .sql files in migrations/
```

## Environment Files

| File                | Purpose                                 | Committed? |
| ------------------- | --------------------------------------- | ---------- |
| `.env.example`      | Template for local dev - copy to `.env` | Yes        |
| `.env`              | Your real local dev credentials         | No         |
| `.env.test.example` | Template for the test database          | Yes        |
| `.env.test`         | Real test database credentials          | No         |

## Testing

Two kinds of tests live side by side:

- **Mocked tests** (`*.mock.test.js`) - no real database, the model is replaced with `jest.unstable_mockModule`. Fast, safe to run anytime.
- **Integration tests** (`*.integration.test.js`) - hit a real, separate test database.

Before running integration tests, set up `.env.test` (copy from `.env.test.example`) and create the tables:

```bash
npm run migrate:test
```

Run all tests:

```bash
npm test
```

Run a specific file:

```bash
npm test -- userRouter.mock
```

## API

Base path: `/api/v1`

| Method | Path           | Auth required |
| ------ | -------------- | ------------- |
| GET    | `/`            | No            |
| POST   | `/users`       | No            |
| POST   | `/users/login` | No            |
| POST   | `/users/reset` | No            |
| GET    | `/users`       | Yes           |
| PATCH  | `/users`       | Yes           |
