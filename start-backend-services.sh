#!/bin/bash

# Script to start all backend services

echo "Starting Backend Services"
echo "========================"
echo ""

# Start Auth Service in background
echo "Starting Auth Service..."
cd backend/auth-service
mvn spring-boot:run > ../../logs/auth-service.log 2>&1 &
AUTH_PID=$!
echo "Auth Service started (PID: $AUTH_PID) on port 8081"
cd ../..

sleep 3

# Start Patient Service in background
echo "Starting Patient Service..."
cd backend/patient-service
mvn spring-boot:run > ../../logs/patient-service.log 2>&1 &
PATIENT_PID=$!
echo "Patient Service started (PID: $PATIENT_PID) on port 8082"
cd ../..

# Start Prescription Service in background
echo "Starting Prescription Service..."
cd backend/prescription-service
mvn spring-boot:run > ../../logs/prescription-service.log 2>&1 &
PRESCRIPTION_PID=$!
echo "Prescription Service started (PID: $PRESCRIPTION_PID) on port 8083"
cd ../..

sleep 3

# Start Catalog Service in background
echo "Starting Catalog Service..."
cd backend/catalog-service
mvn spring-boot:run > ../../logs/catalog-service.log 2>&1 &
CATALOG_PID=$!
echo "Catalog Service started (PID: $CATALOG_PID) on port 8084"
cd ../..

sleep 3

# Start Cart Service in background
echo "Starting Cart Service..."
cd backend/cart-service
mvn spring-boot:run > ../../logs/cart-service.log 2>&1 &
CART_PID=$!
echo "Cart Service started (PID: $CART_PID) on port 8085"
cd ../..

sleep 3

# Start Order Service in background
echo "Starting Order Service..."
cd backend/order-service
mvn spring-boot:run > ../../logs/order-service.log 2>&1 &
ORDER_PID=$!
echo "Order Service started (PID: $ORDER_PID) on port 8086"
cd ../..

sleep 3

echo ""
echo "All services started!"
echo ""
echo "Services running:"
echo "  - Auth Service: http://localhost:8081"
echo "  - Patient Service: http://localhost:8082"
echo "  - Prescription Service: http://localhost:8083"
echo "  - Catalog Service: http://localhost:8084"
echo "  - Cart Service: http://localhost:8085"
echo "  - Order Service: http://localhost:8086"
echo ""
echo "Logs are in the logs/ directory"
echo "Press Ctrl+C to stop all services"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Stopping all services..."
    kill $AUTH_PID 2>/dev/null || true
    kill $PATIENT_PID 2>/dev/null || true
    kill $PRESCRIPTION_PID 2>/dev/null || true
    kill $CATALOG_PID 2>/dev/null || true
    kill $CART_PID 2>/dev/null || true
    kill $ORDER_PID 2>/dev/null || true
    echo "All services stopped"
    exit 0
}

trap cleanup SIGINT SIGTERM

# Wait for user interrupt
wait

