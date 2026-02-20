# Stock Management System Backend

This is the backend for the Stock Management System, built with Node.js, Express, and Prisma.

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)

## Installation

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

## Database Setup

1.  Create a `.env` file in the `backend` directory (if it doesn't exist) and configure your database connection:

    ```env
    DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/stock_management_system?schema=public"
    PORT=5000
    JWT_SECRET="your_jwt_secret"
    ```
    *Replace `USER` and `PASSWORD` with your PostgreSQL credentials.*

2.  **Sync Schema**: Push the Prisma schema to your database to create the tables:
    ```bash
    npx prisma db push
    ```

3.  **Seed Database**: Populate the database with initial data (users, products, etc.):
    ```bash
    npx prisma db seed
    ```

## Running the Server

- To run in development mode (with auto-restart):
    ```bash
    npm run dev
    ```

- To run in production mode:
    ```bash
    npm start
    ```

The server will start on `http://localhost:5000`.

## Project Structure

- `prisma/schema.prisma`: Database schema definition.
- `prisma/seed.js`: Script to seed the database with initial data.
- `src/server.js`: Main entry point of the application.