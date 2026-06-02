-- PostgreSQL Database Setup Script
-- Run this script as a PostgreSQL superuser (e.g., postgres)

-- Create the database user
CREATE USER backenduser WITH PASSWORD 'VeryStrongPassword123!';

-- Create the database
CREATE DATABASE production_db OWNER backenduser;

-- Grant all privileges on the database to the user
GRANT ALL PRIVILEGES ON DATABASE production_db TO backenduser;

-- Connect to the database and grant schema privileges
\c production_db
GRANT ALL ON SCHEMA public TO backenduser;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO backenduser;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO backenduser;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO backenduser;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO backenduser;
