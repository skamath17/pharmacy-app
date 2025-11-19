# Technical Architecture Document

**Online Pharmacy Web Application**  
**Version:** 1.0  
**Last Updated:** January 10, 2025  
**Status:** MVP (v0.1)

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Architecture Patterns](#2-architecture-patterns)
3. [Microservices Architecture](#3-microservices-architecture)
4. [Technology Stack](#4-technology-stack)
5. [Database Design](#5-database-design)
6. [API Design](#6-api-design)
7. [Frontend Architecture](#7-frontend-architecture)
8. [Security Architecture](#8-security-architecture)
9. [Service Communication](#9-service-communication)
10. [Data Flow](#10-data-flow)
11. [Deployment Architecture](#11-deployment-architecture)
12. [Future Enhancements](#12-future-enhancements)

---

## 1. System Overview

### 1.1 Purpose

The Online Pharmacy Web Application is a comprehensive platform that enables patients to:
- Upload and manage prescriptions
- Browse and search medicine catalog
- Add medicines to cart and checkout
- Track orders and deliveries
- Manage refills and reminders

### 1.2 Key Requirements

- **Scalability:** Microservices architecture for independent scaling
- **Security:** HIPAA-compliant data handling, JWT-based authentication
- **Performance:** Fast search, efficient cart management, real-time updates
- **Reliability:** Fault-tolerant services, transaction management
- **Compliance:** Adherence to pharmaceutical regulations

### 1.3 System Boundaries

**In Scope (MVP):**
- Patient registration and authentication
- Prescription upload and management
- Medicine catalog browsing
- Shopping cart and checkout
- Order creation and history
- Basic order tracking

**Out of Scope (Future Phases):**
- Payment gateway integration
- Pharmacist verification workflows
- Admin portal
- Shipment tracking integration
- Refill management
- Notification services

---

## 2. Architecture Patterns

### 2.1 Microservices Architecture

The application follows a **microservices architecture** pattern where:

- Each service is independently deployable
- Services communicate via REST APIs
- Each service owns its database schema
- Services are loosely coupled
- Services can be scaled independently

### 2.2 Design Principles

1. **Single Responsibility:** Each service handles one business domain
2. **API-First:** Services expose RESTful APIs
3. **Stateless Services:** Services don't maintain session state
4. **Database per Service:** Each service has its own database schema
5. **Fail Fast:** Services fail independently without cascading failures

### 2.3 Architectural Layers

Each microservice follows a layered architecture:

```
┌─────────────────────────────────┐
│      Controller Layer           │  (REST API endpoints)
├─────────────────────────────────┤
│      Service Layer              │  (Business logic)
├─────────────────────────────────┤
│      Repository Layer           │  (Data access)
├─────────────────────────────────┤
│      Model Layer                │  (Entities/DTOs)
└─────────────────────────────────┘
```

---

## 3. Microservices Architecture

### 3.1 Service Overview

| Service | Port | Responsibility | Database Tables |
|---------|------|----------------|------------------|
| **auth-service** | 8081 | Authentication, Authorization, User Management | `users` |
| **patient-service** | 8082 | Patient Profile Management | `patients` |
| **prescription-service** | 8083 | Prescription Upload, Storage, Management | `prescriptions` |
| **catalog-service** | 8084 | Medicine Catalog, Search, Inventory | `medicines`, `medicine_inventory` |
| **cart-service** | 8085 | Shopping Cart Management | `carts`, `cart_items` |
| **order-service** | 8086 | Order Creation, Management, History | `orders`, `order_items` |

### 3.2 Service Details

#### 3.2.1 Auth Service (Port 8081)

**Responsibilities:**
- User registration and login
- JWT token generation and validation
- Password encryption (BCrypt)
- Role-based access control (RBAC)

**Key Components:**
- `AuthController`: REST endpoints for login/register
- `JwtService`: Token generation and validation
- `AuthService`: Business logic for authentication
- `SecurityConfig`: Spring Security configuration

**Database:**
- `users` table (id, email, password_hash, role, status)

**API Endpoints:**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/validate` - Token validation

#### 3.2.2 Patient Service (Port 8082)

**Responsibilities:**
- Patient profile CRUD operations
- Medical history management (allergies, conditions)
- Address management
- Emergency contact information

**Key Components:**
- `PatientController`: REST endpoints for patient operations
- `PatientService`: Business logic for patient management
- `PatientRepository`: Data access layer

**Database:**
- `patients` table (id, user_id, first_name, last_name, address, allergies, medical_conditions)

**API Endpoints:**
- `GET /api/patients/{id}` - Get patient profile
- `PUT /api/patients/{id}` - Update patient profile
- `GET /api/patients/{id}/address` - Get patient addresses

#### 3.2.3 Prescription Service (Port 8083)

**Responsibilities:**
- Prescription file upload (image/PDF)
- Prescription file storage (local filesystem for MVP)
- Prescription history retrieval
- Prescription file streaming
- Prescription status tracking

**Key Components:**
- `PrescriptionController`: REST endpoints for prescription operations
- `PrescriptionService`: Business logic for prescription management
- `FileStorageService`: File upload and storage handling

**Database:**
- `prescriptions` table (id, patient_id, file_url, status, expiry_date)

**API Endpoints:**
- `POST /api/prescriptions` - Upload prescription
- `GET /api/prescriptions` - Get prescription history
- `POST /api/prescriptions/file` - Stream prescription file
- `GET /api/prescriptions/{id}` - Get prescription details

**File Storage:**
- Local filesystem: `backend/prescription-service/uploads/prescriptions/`
- Future: S3-compatible storage

#### 3.2.4 Catalog Service (Port 8084)

**Responsibilities:**
- Medicine catalog management
- Medicine search (by name, generic name)
- Medicine filtering (by form, schedule, prescription requirement)
- Stock availability checking
- Price and discount management

**Key Components:**
- `CatalogController`: REST endpoints for catalog operations
- `CatalogService`: Business logic for catalog management
- `MedicineRepository`: Data access for medicines
- `MedicineInventoryRepository`: Data access for inventory

**Database:**
- `medicines` table (id, name, generic_name, form, schedule, prescription_required)
- `medicine_inventory` table (id, medicine_id, quantity_available, unit_price, mrp, discount_percentage)

**API Endpoints:**
- `GET /api/catalog/medicines` - Search and filter medicines
- `GET /api/catalog/medicines/{id}` - Get medicine details
- `GET /api/catalog/medicines/{id}/inventory` - Get inventory info

#### 3.2.5 Cart Service (Port 8085)

**Responsibilities:**
- Shopping cart creation and management
- Add/update/remove cart items
- Cart persistence (per patient)
- Price calculation (subtotal, discount, total)
- Integration with catalog service for pricing

**Key Components:**
- `CartController`: REST endpoints for cart operations
- `CartService`: Business logic for cart management
- `CartRepository`: Data access for carts
- `CartItemRepository`: Data access for cart items

**Database:**
- `carts` table (id, patient_id)
- `cart_items` table (id, cart_id, medicine_id, quantity)

**API Endpoints:**
- `GET /api/cart` - Get patient's cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/{itemId}` - Update cart item
- `DELETE /api/cart/items/{itemId}` - Remove cart item
- `DELETE /api/cart` - Clear cart

**Service Integration:**
- Calls `catalog-service` to fetch medicine pricing

#### 3.2.6 Order Service (Port 8086)

**Responsibilities:**
- Order creation from cart
- Order confirmation
- Order history retrieval
- Order details view
- Order status management

**Key Components:**
- `OrderController`: REST endpoints for order operations
- `OrderService`: Business logic for order management
- `OrderRepository`: Data access for orders
- `OrderItemRepository`: Data access for order items

**Database:**
- `orders` table (id, patient_id, order_number, status, total_amount, shipping_address)
- `order_items` table (id, order_id, medicine_id, quantity, unit_price)

**API Endpoints:**
- `POST /api/orders` - Create order from cart
- `GET /api/orders` - Get patient's order history
- `GET /api/orders/{orderId}` - Get order details

**Service Integration:**
- Calls `cart-service` to retrieve cart and clear it after order creation

---

## 4. Technology Stack

### 4.1 Backend Technologies

#### Core Framework
- **Java 17+**: Programming language
- **Spring Boot 3.2.0**: Application framework
- **Spring Data JPA**: Data persistence
- **Spring Security**: Authentication and authorization
- **Maven**: Build and dependency management

#### Database & Storage
- **PostgreSQL 14+**: Primary relational database
- **Redis**: Caching (configured, not yet implemented)
- **Local Filesystem**: Prescription file storage (MVP)

#### Libraries & Tools
- **JJWT 0.12.3**: JWT token generation and validation
- **BCrypt**: Password encryption
- **Jackson**: JSON serialization/deserialization
- **Lombok**: Boilerplate code reduction
- **Hibernate**: ORM framework

### 4.2 Frontend Technologies

#### Core Framework
- **React 18.2.0**: UI library
- **TypeScript 5.2.2**: Type-safe JavaScript
- **Vite 5.0.8**: Build tool and dev server

#### State Management & Routing
- **Zustand 4.4.7**: Lightweight state management
- **React Router 6.20.0**: Client-side routing
- **React Query 5.12.0**: Server state management (configured)

#### UI & Styling
- **Tailwind CSS 3.3.6**: Utility-first CSS framework
- **Lucide React**: Icon library
- **shadcn/ui**: UI component library (planned)

#### HTTP Client & Forms
- **Axios 1.6.2**: HTTP client for API calls
- **React Hook Form 7.48.2**: Form handling
- **Zod 3.22.4**: Schema validation

### 4.3 Infrastructure

#### Development
- **Docker & Docker Compose**: Containerization
- **PostgreSQL**: Database container
- **Redis**: Cache container (configured)
- **Kafka**: Message queue (configured, not yet used)
- **Elasticsearch**: Search engine (configured, not yet used)

#### Build Tools
- **Maven 3.8+**: Backend build tool
- **npm/Yarn**: Frontend package manager
- **PowerShell/Bash**: Scripting for automation

---

## 5. Database Design

### 5.1 Database Architecture

**Pattern:** Database per Service (logical separation within single PostgreSQL instance for MVP)

All services connect to the same PostgreSQL database (`pharmacy_db`) but use different table namespaces:
- `users` - Auth Service
- `patients` - Patient Service
- `prescriptions` - Prescription Service
- `medicines`, `medicine_inventory` - Catalog Service
- `carts`, `cart_items` - Cart Service
- `orders`, `order_items` - Order Service

**Future:** Each service will have its own database instance in production.

### 5.2 Key Design Decisions

1. **UUID Primary Keys:** All tables use UUID for primary keys
   - Better for distributed systems
   - Avoids ID collision in microservices
   - More secure (non-sequential)

2. **Soft Deletes:** Status fields instead of hard deletes
   - `status` fields: `ACTIVE`, `INACTIVE`, `SUSPENDED`
   - Preserves audit trail

3. **JSONB Columns:** Used for flexible data storage
   - `shipping_address` in `orders` table
   - `allergies`, `medical_conditions` as arrays

4. **Audit Fields:** `created_at`, `updated_at` on all tables
   - Automatic timestamp tracking
   - Updated via database triggers

### 5.3 Entity Relationships

```
users (1) ──< (1) patients
patients (1) ──< (*) prescriptions
patients (1) ──< (1) carts
carts (1) ──< (*) cart_items
cart_items (*) ──< (1) medicines
patients (1) ──< (*) orders
orders (1) ──< (*) order_items
order_items (*) ──< (1) medicines
medicines (1) ──< (*) medicine_inventory
```

### 5.4 Indexing Strategy

**Indexes Created:**
- `users.email` - UNIQUE index for login
- `patients.user_id` - UNIQUE index for user-patient relationship
- `prescriptions.patient_id` - Index for patient prescription queries
- `carts.patient_id` - UNIQUE index for patient cart
- `orders.patient_id` - Index for patient order history
- `orders.order_number` - UNIQUE index for order lookup
- `medicine_inventory.medicine_id` - Index for inventory queries

---

## 6. API Design

### 6.1 API Architecture

**Pattern:** RESTful API design

**Base URL Structure:**
- Auth Service: `http://localhost:8081/api`
- Patient Service: `http://localhost:8082/api`
- Prescription Service: `http://localhost:8083/api`
- Catalog Service: `http://localhost:8084/api`
- Cart Service: `http://localhost:8085/api`
- Order Service: `http://localhost:8086/api`

### 6.2 API Conventions

#### HTTP Methods
- `GET`: Retrieve resources
- `POST`: Create resources
- `PUT`: Update resources (full update)
- `DELETE`: Delete resources

#### Response Format
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

#### Error Format
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "timestamp": "2025-01-10T12:00:00Z"
  }
}
```

### 6.3 Authentication

**Method:** JWT (JSON Web Tokens)

**Flow:**
1. Client sends credentials to `/api/auth/login`
2. Server validates and returns JWT token
3. Client includes token in `Authorization: Bearer <token>` header
4. Services validate token and extract user information

**Token Structure:**
```json
{
  "userId": "uuid",
  "email": "user@example.com",
  "role": "PATIENT",
  "iat": 1234567890,
  "exp": 1234654290
}
```

### 6.4 API Versioning

**Current:** No versioning (MVP)
**Future:** `/api/v1/`, `/api/v2/` prefix

### 6.5 Rate Limiting

**Current:** Not implemented
**Future:** Implement per-service rate limiting

---

## 7. Frontend Architecture

### 7.1 Application Structure

```
frontend/
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/             # Page components
│   │   ├── auth/          # Login, Register
│   │   ├── patient/       # Patient-specific pages
│   │   └── catalog/       # Catalog pages
│   ├── services/          # API service clients
│   ├── stores/            # Zustand state stores
│   ├── lib/               # Utilities, API config
│   ├── hooks/             # Custom React hooks
│   └── App.tsx            # Main app component
```

### 7.2 State Management

**Pattern:** Hybrid approach

1. **Zustand Stores:**
   - `authStore`: Authentication state, token management
   - `cartStore`: Shopping cart state (with localStorage persistence)

2. **React Query:**
   - Server state caching
   - Automatic refetching
   - Optimistic updates (future)

3. **Local State:**
   - Component-level state with `useState`
   - Form state with React Hook Form

### 7.3 Routing

**Library:** React Router v6

**Route Structure:**
```
/                    → Home page
/login               → Login page
/register            → Register page
/catalog             → Medicine catalog
/catalog/medicines/:id → Medicine details
/patient/profile     → Patient profile
/patient/prescriptions → Prescription history
/patient/cart        → Shopping cart
/patient/checkout    → Checkout page
/patient/orders      → Order history
/patient/orders/:orderId/confirmation → Order confirmation
```

**Protected Routes:**
- Routes under `/patient/*` require authentication
- Redirects to `/login` if not authenticated

### 7.4 API Integration

**Pattern:** Service Layer Pattern

**API Clients:**
- `api.ts`: Axios instances for each service
- Request interceptors: Add JWT token to headers
- Response interceptors: Handle errors, token refresh

**Service Modules:**
- `authApi.ts`: Authentication API calls
- `patientApi.ts`: Patient API calls
- `prescriptionApi.ts`: Prescription API calls
- `catalogApi.ts`: Catalog API calls
- `cartApi.ts`: Cart API calls
- `orderApi.ts`: Order API calls

### 7.5 Proxy Configuration

**Development:** Vite proxy routes frontend API calls to backend services

```typescript
// vite.config.ts
proxy: {
  '/patient-api': { target: 'http://localhost:8082', rewrite: ... },
  '/prescription-api': { target: 'http://localhost:8083', rewrite: ... },
  '/catalog-api': { target: 'http://localhost:8084', rewrite: ... },
  '/cart-api': { target: 'http://localhost:8085', rewrite: ... },
  '/order-api': { target: 'http://localhost:8086', rewrite: ... }
}
```

**Production:** API Gateway or reverse proxy (Nginx)

---

## 8. Security Architecture

### 8.1 Authentication Flow

```
┌─────────┐                    ┌──────────────┐
│ Client  │                    │ Auth Service │
└────┬────┘                    └──────┬───────┘
     │                                │
     │  1. POST /api/auth/login       │
     │     {email, password}          │
     ├───────────────────────────────>│
     │                                │
     │  2. Validate credentials       │
     │                                │
     │  3. Generate JWT token         │
     │                                │
     │  4. Return token               │
     │<───────────────────────────────┤
     │                                │
     │  5. Store token (localStorage) │
     │                                │
```

### 8.2 Authorization Flow

```
┌─────────┐                    ┌──────────────┐
│ Client  │                    │   Service    │
└────┬────┘                    └──────┬───────┘
     │                                │
     │  1. Request with JWT token     │
     │     Authorization: Bearer <token>│
     ├───────────────────────────────>│
     │                                │
     │  2. Extract & validate token   │
     │                                │
     │  3. Extract user info          │
     │     (userId, role, email)      │
     │                                │
     │  4. Check authorization        │
     │                                │
     │  5. Process request            │
     │                                │
     │  6. Return response            │
     │<───────────────────────────────┤
```

### 8.3 Security Measures

#### Password Security
- **BCrypt hashing:** Passwords are hashed with BCrypt (cost factor: 10)
- **No plaintext storage:** Passwords never stored in plaintext
- **Password requirements:** Minimum length, complexity (future)

#### Token Security
- **JWT Secret:** 256-bit secret key (configurable)
- **Token Expiration:** 24 hours (86400000 ms)
- **HMAC Algorithm:** HS256 for token signing
- **Token Storage:** localStorage (consider httpOnly cookies for production)

#### API Security
- **CORS:** Configured for frontend origin (`http://localhost:3000`)
- **CSRF Protection:** Disabled for API (stateless JWT)
- **Input Validation:** Bean Validation annotations on DTOs
- **SQL Injection Prevention:** Parameterized queries via JPA

#### Service Security
- **Spring Security:** Each service has SecurityConfig
- **Public Endpoints:** Only `/api/auth/register`, `/api/auth/login`
- **Protected Endpoints:** Require valid JWT token
- **Role-Based Access:** Role extracted from JWT token

### 8.4 Security Headers

**Current:** Basic Spring Security defaults
**Future:**
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=31536000`

---

## 9. Service Communication

### 9.1 Communication Patterns

#### Synchronous Communication (Current)

**Pattern:** REST API calls between services

**Examples:**
- Cart Service → Catalog Service: Fetch medicine pricing
- Order Service → Cart Service: Retrieve cart, clear cart

**Implementation:**
```java
// CartService.java
RestTemplate restTemplate = new RestTemplate();
String catalogUrl = "http://localhost:8084/api/catalog/medicines/" + medicineId;
MedicineDto medicine = restTemplate.getForObject(catalogUrl, MedicineDto.class);
```

#### Asynchronous Communication (Future)

**Pattern:** Event-driven architecture with Kafka

**Planned Events:**
- `order.created` - Order created event
- `order.status.changed` - Order status update
- `prescription.uploaded` - Prescription upload notification
- `inventory.updated` - Stock level changes

### 9.2 Service Discovery

**Current:** Hardcoded service URLs
**Future:** Service registry (Eureka, Consul) or Kubernetes service discovery

### 9.3 Load Balancing

**Current:** Single instance per service
**Future:** Multiple instances with load balancer (Nginx, Spring Cloud Gateway)

### 9.4 Circuit Breaker

**Current:** Not implemented
**Future:** Resilience4j or Hystrix for fault tolerance

---

## 10. Data Flow

### 10.1 User Registration Flow

```
1. Frontend → POST /api/auth/register
2. Auth Service → Validate input
3. Auth Service → Hash password (BCrypt)
4. Auth Service → Save user to database
5. Auth Service → Create patient profile (via Patient Service)
6. Auth Service → Return success response
7. Frontend → Redirect to login
```

### 10.2 Login Flow

```
1. Frontend → POST /api/auth/login
2. Auth Service → Validate credentials
3. Auth Service → Generate JWT token
4. Auth Service → Return token + user info
5. Frontend → Store token in localStorage
6. Frontend → Update auth store (Zustand)
7. Frontend → Redirect to dashboard
```

### 10.3 Prescription Upload Flow

```
1. Frontend → POST /api/prescriptions (multipart/form-data)
2. Prescription Service → Validate file
3. Prescription Service → Save file to filesystem
4. Prescription Service → Save prescription record to database
5. Prescription Service → Return prescription ID
6. Frontend → Display success message
```

### 10.4 Add to Cart Flow

```
1. Frontend → POST /api/cart/items
2. Cart Service → Extract userId from JWT token
3. Cart Service → Get or create cart for patient
4. Cart Service → Call Catalog Service for medicine pricing
5. Cart Service → Add/update cart item
6. Cart Service → Calculate totals
7. Cart Service → Return updated cart
8. Frontend → Update cart store (Zustand)
```

### 10.5 Checkout Flow

```
1. Frontend → POST /api/orders (with shipping address)
2. Order Service → Extract userId from JWT token
3. Order Service → Call Cart Service to get cart
4. Order Service → Validate cart items
5. Order Service → Create order record
6. Order Service → Create order items
7. Order Service → Call Cart Service to clear cart
8. Order Service → Return order confirmation
9. Frontend → Redirect to order confirmation page
```

---

## 11. Deployment Architecture

### 11.1 Current Architecture (Development)

```
┌─────────────────────────────────────────────────┐
│              Development Environment            │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │ Frontend │  │   Auth   │  │  Patient  │    │
│  │  :3000   │  │  :8081   │  │  :8082    │    │
│  └──────────┘  └──────────┘  └──────────┘    │
│                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │Prescript │  │ Catalog  │  │   Cart   │    │
│  │  :8083   │  │  :8084   │  │  :8085   │    │
│  └──────────┘  └──────────┘  └──────────┘    │
│                                                 │
│  ┌──────────┐                                  │
│  │  Order   │                                  │
│  │  :8086   │                                  │
│  └──────────┘                                  │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │         PostgreSQL :5433                 │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

### 11.2 Production Architecture (Planned)

```
┌─────────────────────────────────────────────────┐
│              Production Environment             │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │         Load Balancer / API Gateway       │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │ Frontend │  │   Auth   │  │  Patient  │    │
│  │  (CDN)   │  │ (x3)     │  │  (x2)     │    │
│  └──────────┘  └──────────┘  └──────────┘    │
│                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │Prescript │  │ Catalog  │  │   Cart   │    │
│  │  (x2)    │  │  (x3)    │  │  (x2)    │    │
│  └──────────┘  └──────────┘  └──────────┘    │
│                                                 │
│  ┌──────────┐                                  │
│  │  Order   │                                  │
│  │  (x2)    │                                  │
│  └──────────┘                                  │
│                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │PostgreSQL│  │  Redis    │  │  Kafka   │    │
│  │ (Master) │  │  Cache    │  │  Queue   │    │
│  └──────────┘  └──────────┘  └──────────┘    │
│                                                 │
│  ┌──────────┐                                  │
│  │PostgreSQL│                                  │
│  │ (Replica)│                                  │
│  └──────────┘                                  │
└─────────────────────────────────────────────────┘
```

### 11.3 Containerization

**Current:** Services run as standalone Java applications
**Future:** Docker containers for each service

**Dockerfile Structure:**
```dockerfile
FROM openjdk:17-jdk-slim
COPY target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### 11.4 Orchestration

**Current:** Manual service startup scripts
**Future:** Kubernetes or Docker Compose for orchestration

---

## 12. Future Enhancements

### 12.1 Infrastructure Improvements

1. **API Gateway**
   - Spring Cloud Gateway
   - Single entry point for all services
   - Request routing, load balancing
   - Rate limiting, authentication

2. **Service Discovery**
   - Eureka or Consul
   - Dynamic service registration
   - Health checks

3. **Message Queue**
   - Kafka integration
   - Event-driven architecture
   - Async processing

4. **Caching Layer**
   - Redis for session management
   - Cache medicine catalog
   - Cache patient profiles

5. **Search Engine**
   - Elasticsearch integration
   - Full-text search for medicines
   - Advanced filtering

### 12.2 Security Enhancements

1. **OAuth2/OIDC**
   - Integration with identity providers
   - SSO support

2. **API Rate Limiting**
   - Per-user rate limits
   - Per-service rate limits

3. **Audit Logging**
   - Comprehensive audit trail
   - Security event logging

4. **Data Encryption**
   - Encryption at rest
   - Field-level encryption for sensitive data

### 12.3 Monitoring & Observability

1. **Application Monitoring**
   - Prometheus metrics
   - Grafana dashboards

2. **Distributed Tracing**
   - OpenTelemetry
   - Jaeger or Zipkin

3. **Logging**
   - Centralized logging (ELK stack)
   - Structured logging

4. **Alerting**
   - Service health alerts
   - Error rate alerts

### 12.4 Performance Optimizations

1. **Database Optimization**
   - Query optimization
   - Connection pooling
   - Read replicas

2. **Caching Strategy**
   - Multi-level caching
   - Cache invalidation strategies

3. **CDN Integration**
   - Static asset delivery
   - Prescription file delivery

---

## Appendix A: Service Ports Reference

| Service | Port | Health Check |
|---------|------|--------------|
| Frontend | 3000 | http://localhost:3000 |
| Auth Service | 8081 | http://localhost:8081/actuator/health |
| Patient Service | 8082 | http://localhost:8082/actuator/health |
| Prescription Service | 8083 | http://localhost:8083/actuator/health |
| Catalog Service | 8084 | http://localhost:8084/actuator/health |
| Cart Service | 8085 | http://localhost:8085/actuator/health |
| Order Service | 8086 | http://localhost:8086/actuator/health |
| PostgreSQL | 5433 | localhost:5433 |
| Redis | 6379 | localhost:6379 |

## Appendix B: Database Connection Details

- **Host:** localhost
- **Port:** 5433
- **Database:** pharmacy_db
- **Username:** pharmacy_user
- **Password:** pharmacy_pass

## Appendix C: Key Configuration Files

- `backend/*/src/main/resources/application.properties` - Service configurations
- `frontend/vite.config.ts` - Frontend build and proxy configuration
- `database/schema.sql` - Database schema
- `docker-compose.yml` - Infrastructure services

---

**Document Version:** 1.0  
**Last Updated:** January 10, 2025  
**Maintained By:** Development Team

