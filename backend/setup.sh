#!/bin/bash

# Stock Management System - Database Setup Script
# This script sets up the PostgreSQL database and seeds initial data

set -e  # Exit on error

echo "🚀 Stock Management System - Database Setup"
echo "============================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if PostgreSQL is running
echo "📡 Checking PostgreSQL status..."
if ! systemctl is-active --quiet postgresql; then
    echo -e "${YELLOW}⚠️  PostgreSQL is not running. Attempting to start...${NC}"
    sudo systemctl start postgresql
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ PostgreSQL started successfully${NC}"
    else
        echo -e "${RED}❌ Failed to start PostgreSQL. Please start it manually.${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ PostgreSQL is running${NC}"
fi

echo ""
echo "📋 Step 1: Creating Database and User"
echo "--------------------------------------"
echo "This will create:"
echo "  - Database: production_db"
echo "  - User: backenduser"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Creating database and user..."
    sudo -u postgres psql -f setup-database.sql
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Database and user created successfully${NC}"
    else
        echo -e "${YELLOW}⚠️  Database might already exist. Continuing...${NC}"
    fi
else
    echo "Skipping database creation..."
fi

echo ""
echo "📋 Step 2: Installing Dependencies"
echo "-----------------------------------"
npm install

echo ""
echo "📋 Step 3: Pushing Prisma Schema to Database"
echo "---------------------------------------------"
npx prisma db push

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to push schema. Check your database credentials in .env${NC}"
    exit 1
fi

echo ""
echo "📋 Step 4: Generating Prisma Client"
echo "------------------------------------"
npx prisma generate

echo ""
echo "📋 Step 5: Seeding Database with Initial Data"
echo "----------------------------------------------"
npx prisma db seed

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 Setup completed successfully!${NC}"
    echo ""
    echo "Default users created:"
    echo "  SuperAdmin - username: superadmin, password: password123"
    echo "  Admin      - username: admin, password: password123"
    echo "  Customer   - username: customer, password: password123"
    echo ""
    echo "To start the server:"
    echo "  npm run dev"
    echo ""
    echo "To view data in Prisma Studio:"
    echo "  npx prisma studio"
else
    echo -e "${RED}❌ Seeding failed. Please check the error above.${NC}"
    exit 1
fi
