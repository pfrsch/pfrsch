# Architecture Overview

This document describes the technical architecture of the Service Platform.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Browser    │  │    Mobile    │  │   Desktop    │     │
│  │  (React UI)  │  │     App      │  │     App      │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ HTTPS/REST
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                      Application Layer                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Express.js API Server                   │   │
│  │  ┌──────────┐  ┌──────────┐  ┌─────────────────┐  │   │
│  │  │  Routes  │  │  Auth    │  │   Validation    │  │   │
│  │  │          │  │ (JWT)    │  │                 │  │   │
│  │  └──────────┘  └──────────┘  └─────────────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ SQL
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                        Data Layer                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              PostgreSQL Database                     │   │
│  │  ┌──────────┐  ┌──────────┐  ┌─────────────────┐  │   │
│  │  │Companies │  │Employees │  │  Appointments   │  │   │
│  │  │  Tags    │  │  Users   │  │    Reviews      │  │   │
│  │  └──────────┘  └──────────┘  └─────────────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **React 18**: UI library for building component-based interfaces
- **Vite**: Build tool and dev server for fast development
- **React Router**: Client-side routing
- **Axios**: HTTP client for API calls
- **CSS**: Custom styling (no framework dependencies)

### Backend
- **Node.js 18+**: JavaScript runtime
- **Express**: Web framework for REST API
- **PostgreSQL**: Relational database
- **pg**: PostgreSQL client for Node.js
- **jsonwebtoken**: JWT authentication
- **bcrypt**: Password hashing
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variable management

## Database Design

### Entity Relationship Diagram

```
┌──────────────┐
│  companies   │
│──────────────│
│ id (PK)      │───┐
│ name         │   │
│ cnpj         │   │
│ description  │   │
│ logo_url     │   │
│ theme (JSON) │   │
└──────────────┘   │
                   │
                   │ 1:N
                   │
                   ▼
┌──────────────┐  ┌──────────────────┐
│    users     │  │    employees     │
│──────────────│  │──────────────────│
│ id (PK)      │  │ id (PK)          │───┐
│ email        │  │ company_id (FK)  │   │
│ password_hash│  │ user_id (FK)     │   │
│ role         │  │ name             │   │
│ company_id   │  │ photo_url        │   │
└──────────────┘  │ bio              │   │
                  │ hourly_rate      │   │
                  └──────────────────┘   │
                           │             │
                           │ N:M         │ 1:N
                           │             │
                  ┌────────┴──────┐      │
                  ▼               ▼      │
         ┌──────────────┐  ┌──────────────────────┐
         │     tags     │  │ employee_availability│
         │──────────────│  │──────────────────────│
         │ id (PK)      │  │ id (PK)              │
         │ name         │  │ employee_id (FK)     │
         │ category     │  │ weekday              │
         └──────────────┘  │ start_time           │
                  ▲        │ end_time             │
                  │        └──────────────────────┘
                  │ N:M
                  │
         ┌────────┴──────────┐
         │  employee_tags     │
         │────────────────────│
         │ employee_id (FK)   │
         │ tag_id (FK)        │
         └────────────────────┘

         ┌────────────────────┐
         │   appointments     │
         │────────────────────│
         │ id (PK)            │
         │ employee_id (FK)   │◄───┘
         │ client_name        │
         │ client_email       │
         │ start_timestamp    │
         │ end_timestamp      │
         │ status             │
         │ description        │
         └────────────────────┘
                  │
                  │ 1:N
                  ▼
         ┌────────────────────┐
         │      reviews       │
         │────────────────────│
         │ id (PK)            │
         │ appointment_id (FK)│
         │ rating             │
         │ comment            │
         └────────────────────┘
```

### Key Relationships

1. **Company ↔ Employees**: One-to-Many
   - One company can have many employees
   - Each employee belongs to one company

2. **Employees ↔ Tags**: Many-to-Many
   - Employees can have multiple specialties
   - Tags can be assigned to multiple employees
   - Junction table: `employee_tags`

3. **Employee ↔ Availability**: One-to-Many
   - Each employee has multiple availability slots
   - Each slot represents a time block on a specific weekday

4. **Employee ↔ Appointments**: One-to-Many
   - Each employee can have multiple appointments
   - Each appointment is with one employee

5. **Appointment ↔ Reviews**: One-to-One (optional)
   - Each appointment can have one review
   - Reviews reference appointments

## API Architecture

### RESTful Design

The API follows REST principles:

- **Resources**: Nouns (companies, employees, appointments)
- **HTTP Methods**: Standard verbs (GET, POST, PUT, PATCH, DELETE)
- **Status Codes**: Appropriate HTTP status codes
- **JSON**: Request and response format

### Authentication Flow

```
┌─────────┐                ┌─────────┐
│ Client  │                │  Server │
└────┬────┘                └────┬────┘
     │                          │
     │ POST /auth/login         │
     │ {email, password}        │
     │─────────────────────────>│
     │                          │
     │                    Verify credentials
     │                    Generate JWT token
     │                          │
     │ {user, token}            │
     │<─────────────────────────│
     │                          │
     │ Store token              │
     │                          │
     │ GET /api/employees       │
     │ Authorization: Bearer <token>
     │─────────────────────────>│
     │                          │
     │                    Verify token
     │                    Process request
     │                          │
     │ {employees: [...]}       │
     │<─────────────────────────│
     │                          │
```

### Request/Response Flow

```
Client Request
    │
    ├─> CORS Middleware (allow cross-origin)
    │
    ├─> JSON Parser (parse request body)
    │
    ├─> Authentication (verify JWT token)
    │
    ├─> Route Handler
    │   │
    │   ├─> Input Validation
    │   │
    │   ├─> Business Logic
    │   │
    │   └─> Database Query
    │
    └─> JSON Response
```

## Frontend Architecture

### Component Structure

```
src/
├── App.jsx (Router)
│
├── pages/
│   ├── Home.jsx
│   ├── SearchEmployees.jsx
│   ├── EmployeeProfile.jsx
│   ├── BookAppointment.jsx
│   └── CompanyDashboard.jsx
│
├── components/
│   └── (reusable components)
│
├── services/
│   └── api.js (API client)
│
└── styles/
    └── index.css (global styles)
```

### State Management

Currently uses **React Hooks** for local state:
- `useState`: Component state
- `useEffect`: Side effects (API calls)
- `useParams`: Route parameters
- `useNavigate`: Programmatic navigation

Future enhancement: Consider Redux or Zustand for global state.

## Security Considerations

### Implemented
✅ Password hashing (bcrypt)
✅ JWT authentication
✅ SQL injection prevention (parameterized queries)
✅ CORS configuration
✅ Environment variables for secrets

### To Implement (Production)
- [ ] Rate limiting
- [ ] Input sanitization
- [ ] HTTPS enforcement
- [ ] CSRF protection
- [ ] File upload validation
- [ ] SQL injection testing
- [ ] XSS prevention
- [ ] Security headers

## Performance Optimizations

### Database
- **Indexes** on frequently queried columns:
  - `employees.company_id`
  - `employee_tags.employee_id`, `employee_tags.tag_id`
  - `appointments.employee_id`, `appointments.start_timestamp`
  - `employee_availability.employee_id`

- **Connection pooling** via pg Pool

### API
- Efficient queries (avoid N+1 problems)
- Aggregate queries for related data
- Optional pagination (to be implemented)

### Frontend
- Vite's fast HMR for development
- Code splitting potential for production
- Lazy loading for routes (future)

## Scalability

### Current Limitations
- Single server deployment
- No caching layer
- No load balancing
- No CDN for static assets

### Future Enhancements

#### Horizontal Scaling
```
┌─────────┐     ┌─────────┐     ┌─────────┐
│ Client  │────>│Load     │────>│ API     │
│         │     │Balancer │     │ Server  │
└─────────┘     └─────────┘     └─────────┘
                      │          ┌─────────┐
                      └─────────>│ API     │
                                 │ Server  │
                                 └─────────┘
```

#### Caching Layer
```
API Server ──> Redis Cache ──> PostgreSQL
```

#### Microservices (Future)
- User Service
- Booking Service
- Notification Service
- Payment Service

## Deployment Architecture

### Development
```
localhost:3000 (Frontend)
      │
      └──> Vite Dev Server
           └──> Proxy to localhost:3001

localhost:3001 (Backend)
      │
      └──> Express Server
           └──> PostgreSQL (localhost:5432)
```

### Production (Suggested)
```
CDN (Static Assets)
      │
      ▼
Frontend (Vercel/Netlify)
      │
      └──> API Gateway
           │
           ▼
Backend (Railway/Render/DigitalOcean)
      │
      └──> PostgreSQL (Managed Database)
```

## Monitoring & Logging

### Current
- Console logging for development
- Database query logging

### Production Needs
- [ ] Application monitoring (e.g., Sentry)
- [ ] Database monitoring
- [ ] API analytics
- [ ] Error tracking
- [ ] Performance metrics

## Testing Strategy

### Unit Tests
- Test individual functions
- Mock database calls
- Test business logic

### Integration Tests
- Test API endpoints
- Test database operations
- Test authentication flow

### E2E Tests
- Test complete user flows
- Test booking process
- Test search functionality

Tools to consider:
- Jest (unit/integration)
- Supertest (API testing)
- Cypress (E2E)

## Development Workflow

```
1. Feature Branch
   ├─> Local Development
   ├─> Unit Tests
   └─> Commit

2. Pull Request
   ├─> Code Review
   ├─> CI Pipeline
   │   ├─> Linting
   │   ├─> Tests
   │   └─> Build
   └─> Merge

3. Deployment
   ├─> Staging
   ├─> Testing
   └─> Production
```

## Future Architecture Considerations

### Messaging Queue
For asynchronous tasks:
- Email notifications
- SMS reminders
- Report generation

Technology: RabbitMQ, Redis Pub/Sub

### File Storage
For user uploads:
- Profile photos
- Company logos
- Documents

Technology: AWS S3, Cloudinary

### Real-time Features
For live updates:
- WebSocket connections
- Appointment confirmations
- Chat functionality

Technology: Socket.io, Server-Sent Events

### Analytics
For business insights:
- User behavior
- Booking patterns
- Revenue metrics

Technology: Google Analytics, Mixpanel, custom dashboard

## Conclusion

This architecture provides a solid foundation for a service booking platform with room for growth. The modular design allows for incremental improvements and scaling as the user base grows.
