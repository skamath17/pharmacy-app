#!/bin/bash

# Development Startup Script
# Starts both backend and frontend in development mode

set -e

echo "🚀 Starting Pharmacy App in Development Mode"
echo "============================================="
echo ""

# Check if Docker services are running
if ! docker ps | grep -q pharmacy-postgres; then
    echo "⚠️  Docker services not running. Starting them..."
    docker-compose up -d
    echo "⏳ Waiting for services to be ready..."
    sleep 5
fi

# Start backend in background
echo "🔧 Starting backend service..."
cd backend/auth-service
mvn spring-boot:run > ../../logs/auth-service.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"
cd ../..

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 10

# Check if backend is responding
if curl -s http://localhost:8081/api/auth/login > /dev/null; then
    echo "✅ Backend is running on http://localhost:8081"
else
    echo "⚠️  Backend might still be starting..."
fi

# Start frontend
echo "🎨 Starting frontend..."
cd frontend
npm run dev &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"
cd ..

echo ""
echo "✅ Services started!"
echo ""
echo "Backend:  http://localhost:8081"
echo "Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping services..."
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    echo "✅ Services stopped"
    exit 0
}

trap cleanup SIGINT SIGTERM

# Wait for user interrupt
wait


