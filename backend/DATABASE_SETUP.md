# Database Setup Guide

## Option 1: Using psql Command Line

### 1. Connect to PostgreSQL as superuser

```bash
sudo -u postgres psql
```

### 2. Run these SQL commands

```sql
-- Create the database user
CREATE USER backenduser WITH PASSWORD 'VeryStrongPassword123!';

-- Create the database
CREATE DATABASE production_db OWNER backenduser;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE production_db TO backenduser;

-- Connect to the database
\c production_db

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO backenduser;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO backenduser;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO backenduser;

-- Exit psql
\q
```

## Option 2: Using SQL File

### 1. Run the setup script

```bash
sudo -u postgres psql -f backend/setup-database.sql
```

## Option 3: Using existing PostgreSQL credentials

If you already have PostgreSQL installed with a user, update the `.env` file:

```env
DATABASE_URL="postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/production_db"
```

Replace `YOUR_USERNAME` and `YOUR_PASSWORD` with your actual PostgreSQL credentials.

---

## After Database is Created

### 1. Push the Prisma schema to database

```bash
cd backend
npx prisma db push
```

### 2. Generate Prisma Client

```bash
npx prisma generate
```

### 3. Seed the database with initial data

```bash
npx prisma db seed
```

Or use npm script:

```bash
npm run prisma:seed
```

---

## Verify Setup

### Check database connection

```bash
npx prisma studio
```

This will open Prisma Studio in your browser where you can view all your data.

---

## Default Users After Seeding

- **SuperAdmin**: username: `superadmin`, password: `password123`
- **Admin**: username: `admin`, password: `password123`
- **Customer**: username: `customer`, password: `password123`

---

## Troubleshooting

### If you get authentication errors:

1. Check PostgreSQL is running: `sudo systemctl status postgresql`
2. Start PostgreSQL: `sudo systemctl start postgresql`
3. Verify credentials in `.env` file match your PostgreSQL setup

### If you get "database does not exist":

1. Make sure you created the database using the SQL commands above
2. Check the database name in `.env` matches the created database

### Reset database (WARNING: Deletes all data):

```bash
npx prisma migrate reset
```
