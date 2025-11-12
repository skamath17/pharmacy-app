# Online Pharmacy Web Application

A comprehensive online pharmacy platform for prescription management, refills, payments, and home delivery.

## Project Structure

```
pharmacy-app/
├── backend/                 # Spring Boot microservices
│   ├── auth-service/       # Authentication & Authorization
│   ├── patient-service/    # Patient management
│   ├── prescription-service/ # Prescription handling
│   ├── catalog-service/    # Medicine catalog
│   ├── order-service/      # Order management
│   ├── payment-service/    # Payment processing
│   └── shipment-service/   # Shipment tracking
├── frontend/               # React application
├── database/               # Database migrations & schemas
└── docker/                # Docker configurations
```

## Tech Stack

### Backend
- Java 17+
- Spring Boot 3.x
- PostgreSQL
- Redis
- Kafka
- Elasticsearch

### Frontend
- React 18
- TypeScript
- Vite
- shadcn/ui
- React Query

## Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 14+ (or use Docker Compose)
- Maven 3.8+

### Quick Start

1. **Start Infrastructure Services**
```bash
docker-compose up -d
```

2. **Initialize Database**
```bash
# Connect to PostgreSQL and run the schema
psql -h localhost -U pharmacy_user -d pharmacy_db -f database/schema.sql
```

3. **Backend Setup**
```bash
cd backend
mvn clean install
cd auth-service
mvn spring-boot:run
```

4. **Frontend Setup**
```bash
cd frontend
npm install
cp .env.example .env.local  # Update API URL if needed
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Auth Service: http://localhost:8081

## Documentation

- **[Feature List & Progress](FEATURE_LIST.md)** - Complete feature tracking and progress
- **[Pending Issues](PENDING_ISSUES.md)** - Known issues and bugs to be addressed
- **[Prescription Upload Testing Guide](TEST_PRESCRIPTION_UPLOAD.md)** - Step-by-step testing instructions
- **[Testing Guide](TESTING_GUIDE.md)** - Comprehensive guide for testing and deployment
- **[Quick Start](QUICK_START.md)** - Quick reference for common commands
- **[Setup Progress](SETUP_PROGRESS.md)** - Current implementation status
- **[PRD](online_pharmacy_prd.md)** - Product Requirements Document

## Quick Test

```bash
# 1. Start infrastructure
docker-compose up -d

# 2. Initialize database
docker exec -i pharmacy-postgres psql -U pharmacy_user -d pharmacy_db < database/schema.sql

# 3. Start backend (in one terminal)
cd backend/auth-service && mvn spring-boot:run

# 4. Start frontend (in another terminal)
cd frontend && npm install && npm run dev

# 5. Test API
curl -X POST http://localhost:8081/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123","firstName":"Test","lastName":"User"}'
```

See [TESTING_GUIDE.md](TESTING_GUIDE.md) for detailed instructions.

## MVP Features (v0.1)
- ✅ User authentication and authorization
- ✅ Prescription upload (image/PDF)
- ✅ Medicine catalog with search
- ✅ Shopping cart and checkout
- ✅ Payment integration
- ✅ Order tracking
- ✅ Basic pharmacist portal

## License
Proprietary

