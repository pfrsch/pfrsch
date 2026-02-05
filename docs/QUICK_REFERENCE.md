# Quick Reference Guide

## Common Commands

### Backend

```bash
cd backend

# Install dependencies
npm install

# Run database migrations
npm run migrate

# Seed sample data
npm run seed

# Start development server
npm run dev

# Start production server
npm start
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

### Backend (.env)

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=service_platform
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Server
PORT=3001
NODE_ENV=development
```

### Frontend (.env)

```env
# Optional - defaults to /api proxy
VITE_API_URL=http://localhost:3001/api
```

## API Quick Reference

### Base URL
```
http://localhost:3001/api
```

### Authentication
```bash
# Register
POST /auth/register
Body: { email, password, role, company_id }

# Login
POST /auth/login
Body: { email, password }
Returns: { user, token }
```

### Companies
```bash
GET    /companies          # List all
GET    /companies/:id      # Get one
POST   /companies          # Create
PUT    /companies/:id      # Update
GET    /companies/:id/theme # Get theme
```

### Employees
```bash
GET    /employees                              # List all (filter: company_id, tag_id)
GET    /employees/:id                          # Get profile
POST   /employees/applications                 # Submit application
GET    /employees/applications/company/:id    # List applications
POST   /employees/applications/:id/approve    # Approve
POST   /employees/applications/:id/reject     # Reject
GET    /employees/:id/availability             # Get availability
POST   /employees/:id/availability             # Set availability
```

### Appointments
```bash
GET    /appointments                                      # List (filter: employee_id, status, dates)
GET    /appointments/:id                                  # Get one
POST   /appointments                                      # Create (with conflict check)
PATCH  /appointments/:id/status                          # Update status
GET    /appointments/employee/:id/available-slots        # Get available slots
```

### Tags
```bash
GET    /tags              # List all (filter: category)
POST   /tags              # Create
GET    /tags/search?q=    # Search
```

## Database Quick Reference

### Connect to Database
```bash
psql -d service_platform
```

### Useful Queries
```sql
-- View all companies
SELECT * FROM companies;

-- View employees with company names
SELECT e.*, c.name as company_name 
FROM employees e 
JOIN companies c ON e.company_id = c.id;

-- View appointments for today
SELECT * FROM appointments 
WHERE DATE(start_timestamp) = CURRENT_DATE;

-- View employee availability
SELECT e.name, ea.weekday, ea.start_time, ea.end_time
FROM employees e
JOIN employee_availability ea ON e.id = ea.employee_id
ORDER BY e.name, ea.weekday;

-- View employees with their tags
SELECT e.name, array_agg(t.name) as tags
FROM employees e
LEFT JOIN employee_tags et ON e.id = et.employee_id
LEFT JOIN tags t ON et.tag_id = t.id
GROUP BY e.id, e.name;
```

## React Routes

```
/                     → Home page
/search              → Search employees
/employee/:id        → Employee profile
/book/:employeeId    → Book appointment
/dashboard           → Company dashboard
```

## File Structure

```
pfrsch/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js         # DB connection
│   │   ├── routes/
│   │   │   ├── auth.js             # Authentication
│   │   │   ├── companies.js        # Companies API
│   │   │   ├── employees.js        # Employees API
│   │   │   ├── appointments.js     # Appointments API
│   │   │   └── tags.js             # Tags API
│   │   ├── migrations/
│   │   │   ├── schema.js           # Database schema
│   │   │   ├── run.js              # Migration runner
│   │   │   └── seed.js             # Seed data
│   │   └── server.js               # Express app
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── SearchEmployees.jsx
│   │   │   ├── EmployeeProfile.jsx
│   │   │   ├── BookAppointment.jsx
│   │   │   └── CompanyDashboard.jsx
│   │   ├── services/
│   │   │   └── api.js              # API client
│   │   ├── styles/
│   │   │   └── index.css
│   │   ├── App.jsx                 # Router
│   │   └── main.jsx                # Entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── docs/
    ├── README.md                    # Full documentation
    ├── API.md                       # API reference
    ├── SETUP.md                     # Setup guide
    ├── ARCHITECTURE.md              # Architecture docs
    └── QUICK_REFERENCE.md           # This file
```

## Status Codes

| Code | Meaning            | Usage                          |
|------|--------------------|--------------------------------|
| 200  | OK                 | Successful GET/PUT/PATCH       |
| 201  | Created            | Successful POST                |
| 400  | Bad Request        | Invalid input                  |
| 401  | Unauthorized       | Invalid/missing auth token     |
| 404  | Not Found          | Resource doesn't exist         |
| 409  | Conflict           | Booking conflict               |
| 500  | Internal Error     | Server error                   |

## Testing Endpoints with cURL

### Create a Company
```bash
curl -X POST http://localhost:3001/api/companies \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Company",
    "cnpj": "12345678000190",
    "description": "Test company"
  }'
```

### Create a Tag
```bash
curl -X POST http://localhost:3001/api/tags \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Web Development",
    "category": "Technology"
  }'
```

### Submit Employee Application
```bash
curl -X POST http://localhost:3001/api/employees/applications \
  -H "Content-Type: application/json" \
  -d '{
    "company_id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "bio": "Experienced developer",
    "tag_ids": [1]
  }'
```

### Create Appointment
```bash
curl -X POST http://localhost:3001/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "employee_id": 1,
    "client_name": "Jane Client",
    "client_email": "jane@example.com",
    "start_timestamp": "2024-02-10T10:00:00",
    "end_timestamp": "2024-02-10T11:00:00",
    "description": "Web consultation"
  }'
```

## Troubleshooting Quick Fixes

### Backend won't start
```bash
# Check port
lsof -ti:3001 | xargs kill -9

# Check database
pg_isready

# Reinstall
rm -rf node_modules
npm install
```

### Frontend won't start
```bash
# Check port
lsof -ti:3000 | xargs kill -9

# Clear cache
rm -rf node_modules .vite
npm install
```

### Database errors
```bash
# Reset database
dropdb service_platform
createdb service_platform
cd backend
npm run migrate
npm run seed
```

### CORS errors
- Check backend is running on port 3001
- Check `vite.config.js` proxy settings
- Clear browser cache

## Development Workflow

1. **Start backend** (Terminal 1)
   ```bash
   cd backend && npm run dev
   ```

2. **Start frontend** (Terminal 2)
   ```bash
   cd frontend && npm run dev
   ```

3. **Open browser**
   ```
   http://localhost:3000
   ```

4. **Make changes**
   - Backend: Changes auto-reload (Node 18+)
   - Frontend: HMR (Hot Module Replacement)

5. **Test changes**
   - Use browser DevTools
   - Check console for errors
   - Test API with cURL/Postman

## Key Features Implemented

✅ Company registration & customization
✅ Employee management
✅ Employee application workflow
✅ Tag-based search
✅ Employee profiles with availability
✅ Appointment booking
✅ Conflict detection
✅ JWT authentication
✅ Responsive UI
✅ Complete REST API

## Next Steps

After setup:
1. Explore the UI at http://localhost:3000
2. Test the API endpoints
3. Create your own company
4. Add employees
5. Book appointments
6. Customize company theme
7. Review the full docs in `/docs`

## Support

- **Setup issues**: See [SETUP.md](./SETUP.md)
- **API questions**: See [API.md](./API.md)
- **Architecture**: See [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Main docs**: See [README.md](./README.md)
