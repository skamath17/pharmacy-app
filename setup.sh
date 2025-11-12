#!/bin/bash

# Quick Setup Script for Pharmacy App
# This script helps set up and test the application

set -e

echo "🏥 Pharmacy App Setup Script"
echo "============================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check prerequisites
echo "📋 Checking prerequisites..."

check_command() {
    if command -v $1 &> /dev/null; then
        echo -e "${GREEN}✓${NC} $1 is installed"
        return 0
    else
        echo -e "${RED}✗${NC} $1 is not installed"
        return 1
    fi
}

check_command "java" || { echo "Please install Java 17+"; exit 1; }
check_command "node" || { echo "Please install Node.js 18+"; exit 1; }
check_command "docker" || { echo "Please install Docker"; exit 1; }
check_command "mvn" || { echo "Please install Maven"; exit 1; }

echo ""
echo "🐳 Starting Docker services..."
docker-compose up -d

echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 5

# Check if PostgreSQL is ready
until docker exec pharmacy-postgres pg_isready -U pharmacy_user &> /dev/null; do
    echo "Waiting for PostgreSQL..."
    sleep 2
done

echo -e "${GREEN}✓${NC} PostgreSQL is ready"

echo ""
echo "📦 Initializing database..."
if docker exec -i pharmacy-postgres psql -U pharmacy_user -d pharmacy_db < database/schema.sql 2>/dev/null; then
    echo -e "${GREEN}✓${NC} Database schema created"
else
    echo -e "${YELLOW}⚠${NC} Database might already be initialized or schema file not found"
fi

echo ""
echo "🔨 Building backend..."
cd backend
mvn clean install -DskipTests -q
echo -e "${GREEN}✓${NC} Backend built successfully"
cd ..

echo ""
echo "📦 Installing frontend dependencies..."
cd frontend
if [ ! -f ".env.local" ]; then
    cp .env.example .env.local
    echo -e "${GREEN}✓${NC} Created .env.local file"
fi
npm install --silent
echo -e "${GREEN}✓${NC} Frontend dependencies installed"
cd ..

echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Start backend:  cd backend/auth-service && mvn spring-boot:run"
echo "2. Start frontend: cd frontend && npm run dev"
echo "3. Open browser:   http://localhost:3000"
echo ""
echo "Or run: ./start-dev.sh"


