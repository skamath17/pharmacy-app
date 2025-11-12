#!/bin/bash

# Test Backend API Script

BASE_URL="http://localhost:8081/api/auth"

echo "🧪 Testing Auth Service API"
echo "==========================="
echo ""

# Test 1: Registration
echo "1. Testing Registration..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "firstName": "Test",
    "lastName": "User",
    "phone": "+919876543210"
  }')

if echo "$REGISTER_RESPONSE" | grep -q "success.*true"; then
    echo "✓ Registration successful!"
    echo "$REGISTER_RESPONSE" | grep -o '"id":"[^"]*"' | head -1
    echo ""
else
    echo "✗ Registration failed"
    echo "$REGISTER_RESPONSE"
    echo ""
fi

# Test 2: Login
echo "2. Testing Login..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }')

if echo "$LOGIN_RESPONSE" | grep -q "success.*true"; then
    echo "✓ Login successful!"
    TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    echo "Token: ${TOKEN:0:20}..."
    echo ""
else
    echo "✗ Login failed"
    echo "$LOGIN_RESPONSE"
    echo ""
fi

# Test 3: Invalid credentials
echo "3. Testing Invalid Login..."
INVALID_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "wrongpassword"
  }')

HTTP_CODE=$(echo "$INVALID_RESPONSE" | tail -1)
if [ "$HTTP_CODE" = "401" ]; then
    echo "✓ Correctly rejected invalid credentials"
else
    echo "✗ Expected 401 but got $HTTP_CODE"
fi

echo ""
echo "✅ API Tests Complete!"


