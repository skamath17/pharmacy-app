# REST Client Testing Guide

This guide explains how to use the REST Client extension (by Huachao Mao) to manually test your pharmacy app APIs while the frontend is being developed.

## Installation

1. Install the **REST Client** extension in VS Code/Cursor:
   - Extension ID: `humao.rest-client`
   - Search for "REST Client" in the Extensions marketplace

## Files Overview

### Main File
- `api-tests.http` - Master file with complete user journey examples and quick test scenarios

### Service-Specific Files
Each service has its own dedicated file for detailed testing:
- `auth-api.http` - Authentication endpoints (Port 8081)
- `patient-api.http` - Patient management endpoints (Port 8082)
- `prescription-api.http` - Prescription endpoints (Port 8083)
- `catalog-api.http` - Medicine catalog endpoints (Port 8084)
- `cart-api.http` - Shopping cart endpoints (Port 8085)
- `order-api.http` - Order management endpoints (Port 8086)

**Recommendation**: Use individual service files for focused testing, and `api-tests.http` for complete workflow testing.

## How to Use

### Basic Usage

1. Open any `.http` file in VS Code/Cursor
2. You'll see a "Send Request" link above each HTTP request
3. Click "Send Request" to execute the request
4. View the response in a new tab

### Variables

The files use variables for easy configuration:
- `@baseUrl` - Base URL (default: `http://localhost`)
- `@authService` - Auth service URL (port 8081)
- `@patientService` - Patient service URL (port 8082)
- `@prescriptionService` - Prescription service URL (port 8083)
- `@catalogService` - Catalog service URL (port 8084)
- `@cartService` - Cart service URL (port 8085)
- `@orderService` - Order service URL (port 8086)

### Setting User Context

After logging in, you'll receive a `userId` in the response. To use it in subsequent requests:

1. Copy the `userId` from the login response
2. Replace `{{userId}}` in the request headers with the actual UUID
3. Or use REST Client's variable feature (see below)

### Using Variables from Responses

REST Client supports extracting values from responses:

```http
### Login and save userId
# @name login
POST {{authService}}/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}

### Use the userId from login response
GET {{patientService}}/patients/me
X-User-Id: {{login.response.body.$.data.user.id}}
```

## Testing Workflow

### Complete User Journey

1. **Register** → Get user account
2. **Login** → Get `userId` and `token`
3. **Create Patient Profile** → Set up patient information
4. **Browse Medicines** → Search and filter catalog
5. **Add to Cart** → Add medicines to cart
6. **View Cart** → Check cart contents
7. **Create Order** → Place order from cart
8. **View Orders** → Check order history

### Quick Test Scenarios

#### Scenario 1: New Patient Registration Flow
```
Register → Login → Create Profile → Browse → Add to Cart → Create Order
```

#### Scenario 2: Prescription Upload Flow
```
Login → Upload Prescription → View Prescriptions → View Prescription File
```

#### Scenario 3: Cart Management Flow
```
Login → Add Item → Update Quantity → Remove Item → Clear Cart
```

## Tips & Tricks

### 1. Environment Variables
Create a `.env` file or use REST Client's environment feature:
```http
@baseUrl = http://localhost
@userId = your-user-id-here
@medicineId = your-medicine-id-here
```

### 2. Request Chaining
Use `@name` to reference previous requests:
```http
# @name getCart
GET {{cartService}}/cart
X-User-Id: {{userId}}

### Use cart ID from previous request
PUT {{cartService}}/cart/items/{{getCart.response.body.$.data.items[0].id}}
```

### 3. File Uploads
For prescription uploads, use the file path syntax:
```http
POST {{prescriptionService}}/prescriptions/upload
X-User-Id: {{userId}}
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW

------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="file"; filename="prescription.pdf"
Content-Type: application/pdf

< ./sample-data/sample_prescription_us.pdf
------WebKitFormBoundary7MA4YWxkTrZu0gW--
```

### 4. Debugging
- Check the response status code
- Review response body for error messages
- Verify headers are correctly set
- Ensure services are running on correct ports

## Common Issues

### Issue: "Connection refused"
- **Solution**: Ensure all backend services are running
- Check ports: 8081-8086

### Issue: "401 Unauthorized"
- **Solution**: Verify `X-User-Id` header is set correctly
- Ensure user exists and is logged in

### Issue: "404 Not Found"
- **Solution**: Check endpoint URL is correct
- Verify resource ID exists in database

### Issue: "400 Bad Request"
- **Solution**: Validate request body format
- Check required fields are present
- Verify data types match API expectations

## Service Ports Reference

| Service | Port | Base URL |
|---------|------|----------|
| Auth Service | 8081 | `http://localhost:8081/api` |
| Patient Service | 8082 | `http://localhost:8082/api` |
| Prescription Service | 8083 | `http://localhost:8083/api` |
| Catalog Service | 8084 | `http://localhost:8084/api` |
| Cart Service | 8085 | `http://localhost:8085/api` |
| Order Service | 8086 | `http://localhost:8086/api` |

## Benefits for Your Team

✅ **No Frontend Required** - Test APIs immediately after backend development  
✅ **Quick Validation** - Verify endpoints work before frontend integration  
✅ **Documentation** - `.http` files serve as API documentation  
✅ **Shareable** - Team members can use the same test files  
✅ **Version Control** - Test cases tracked in git  
✅ **Fast Iteration** - Test changes quickly without rebuilding frontend  

## Next Steps

1. Install REST Client extension
2. Open `api-tests.http`
3. Start testing your APIs!
4. Customize requests for your specific test cases

Happy Testing! 🚀

