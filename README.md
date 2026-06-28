# library-api

Library API is a NestJS + Prisma backend for managing a library workflow. It covers authentication, authors, categories, books, students, student profiles, borrowing orders, PDF receipts, and email notifications.

## Overview

- Framework: NestJS 11
- Database: PostgreSQL through Prisma
- Auth: JWT with role-based access control
- Docs: Swagger UI and a detailed HTTP reference
- File serving: static `/uploads` assets for generated PDFs and media
- Side effects: order confirmation emails and PDF generation

## Quick Access

- API reference: [docs/api.md](docs/api.md)
- Swagger UI: `http://localhost:3333/api`
- Base URL: `http://localhost:3333`

## Features

- Register and log in users with JWT authentication
- Protect routes with bearer tokens and role guards
- Manage authors, categories, books, students, and student profiles
- Create, update, return, list, and delete borrowing orders
- Generate PDF copies for orders and download them from the API
- Send order confirmation emails with the generated PDF attached
- Serve generated files from the `uploads/` directory

## Project Structure

- `src/auth` - registration, login, JWT strategy, and guards
- `src/authors` - author CRUD and author-book lookups
- `src/books` - book CRUD and book summaries
- `src/categories` - category CRUD and category-book lookups
- `src/students` - student CRUD and borrowing summaries
- `src/student-profiles` - profile CRUD for student details
- `src/orders` - borrowing workflow, PDF download, and order lifecycle
- `src/pdf` - PDF generation service
- `src/mail` - email delivery and templates
- `src/prisma` - Prisma client wrapper and database connection lifecycle
- `prisma/schema.prisma` - database models and enums
- `docs/api.md` - endpoint-by-endpoint reference with sample payloads

## Data Model

The main database entities are:

- `Author`
- `Category`
- `Book`
- `Student`
- `StudentProfile`
- `Order`
- `User`

Key enums:

- `OrderStatus`: `BORROWED`, `RETURNED`, `OVERDUE`
- `UserRole`: `ADMIN`, `LIBRARIAN`

## Requirements

- Node.js 18 or newer
- npm
- PostgreSQL database
- SMTP credentials for mail delivery

## Environment Variables

Create a `.env` file in the project root with these values:

```bash
DATABASE_URL=
JWT_SECRET=
MAIL_HOST=
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USER=
MAIL_PASS=
```

Notes:

- `MAIL_SECURE` is optional. If it is omitted, the app uses `false` on port `587` and `true` on port `465`.
- `DATABASE_URL` is required for Prisma to connect to Postgres.
- `JWT_SECRET` is required for login and protected routes.

## Install

```bash
npm install
```

## Database Setup

Run Prisma migrations after configuring `DATABASE_URL`:

```bash
npx prisma generate
npx prisma migrate dev
```

If you need to inspect or edit the schema, start with `prisma/schema.prisma`.

## Run Locally

```bash
# development
npm run start:dev

# development without watch
npm run start

# production
npm run build
npm run start:prod
```

The server listens on port `3333`.

## Scripts

- `npm run build` - compile the NestJS app
- `npm run start` - run once in development mode
- `npm run start:dev` - run with watch mode
- `npm run start:debug` - run with the Node inspector
- `npm run start:prod` - run the compiled app from `dist/`
- `npm run lint` - lint and auto-fix TypeScript files
- `npm run format` - format source and test files with Prettier
- `npm run test` - run unit tests
- `npm run test:watch` - run tests in watch mode
- `npm run test:cov` - run tests with coverage
- `npm run test:e2e` - run end-to-end tests

## Authentication

Authentication uses bearer tokens returned by `POST /auth/login`.

```http
Authorization: Bearer <access_token>
```

Roles are enforced where needed. The auth module uses a 1-day JWT expiry.

## API Summary

For full request and response examples, use [docs/api.md](docs/api.md) or the Swagger UI.

- Auth: register, login, profile
- Authors: create, list, fetch, update, delete
- Categories: create, list, fetch, update, delete
- Books: create, list, search, fetch, update, delete, summary
- Students: create, list, search, fetch, update, delete, summary
- Student profiles: create, list, fetch, update, delete
- Orders: create borrowing orders, list, fetch, update, delete, download PDF

## Runtime Behavior

- Global validation is enabled with whitelist + transform, so extra request fields are stripped.
- Swagger is mounted at `/api`.
- Static files in `uploads/` are served from `/uploads`.
- CORS is enabled for all origins.
- Order creation sends confirmation email and generates PDFs.

## Uploads

Generated or uploaded files are stored under:

- `uploads/authors`
- `uploads/books`
- `uploads/orders`

These files are served by the application and can be downloaded directly when present.

## Testing

```bash
npm run test
npm run test:e2e
npm run test:cov
```

## Troubleshooting

- If Prisma cannot connect, verify `DATABASE_URL` and that the database is reachable.
- If login fails, confirm `JWT_SECRET` is set and matches the running environment.
- If email delivery fails, verify `MAIL_HOST`, `MAIL_PORT`, `MAIL_USER`, `MAIL_PASS`, and `MAIL_SECURE`.
- If PDF downloads are missing, check that the relevant file exists in `uploads/orders`.

## License

This project is currently marked as `UNLICENSED` in `package.json`.
