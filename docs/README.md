# Service Platform - Complete Implementation

A full-stack service connection platform that allows businesses to manage employees and clients to book appointments with service professionals.

## 🎯 Features

### For Businesses
- **Company Registration & Profile Management**
  - Customizable company profiles with logo, banner, and theme colors
  - About page with rich text content
  - Optional custom domain support

- **Employee Management**
  - Employee application approval workflow
  - Team member profiles with photos, bios, and specialties
  - Individual employee calendars and availability settings

### For Clients
- **Search & Discovery**
  - Browse professionals by specialty tags
  - Filter by skills, location, and ratings
  - View detailed employee profiles with ratings and reviews

- **Booking System**
  - Schedule appointments with real-time availability checking
  - Automatic conflict detection
  - Email/SMS notifications (ready for integration)

### Technical Features
- RESTful API with JWT authentication
- PostgreSQL database with optimized indexes
- React frontend with Vite for fast development
- Responsive design for mobile and desktop

## 📁 Project Structure

```
/
├── backend/               # Node.js + Express API
│   ├── src/
│   │   ├── config/       # Database configuration
│   │   ├── routes/       # API endpoints
│   │   ├── migrations/   # Database schema
│   │   └── server.js     # Express server setup
│   └── package.json
│
├── frontend/             # React + Vite application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API client
│   │   └── styles/       # CSS files
│   └── package.json
│
└── docs/                 # Documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your database credentials:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=service_platform
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your-secret-key
```

5. Create the database:
```bash
createdb service_platform
```

6. Run migrations:
```bash
npm run migrate
```

7. Start the server:
```bash
npm run dev
```

The API will be available at `http://localhost:3001`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 📊 Database Schema

### Core Tables
- **companies** - Business information and customization
- **users** - Authentication and authorization
- **employees** - Service provider profiles
- **employee_applications** - Pending employee approvals
- **tags** - Specialty/skill categories
- **employee_tags** - Many-to-many employee-skill relationship
- **employee_availability** - Weekly schedule per employee
- **appointments** - Scheduled services
- **reviews** - Client feedback

See `backend/src/migrations/schema.js` for complete schema.

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Login and get JWT token

### Companies
- `GET /api/companies` - List all companies
- `GET /api/companies/:id` - Get company details
- `POST /api/companies` - Create company
- `PUT /api/companies/:id` - Update company
- `GET /api/companies/:id/theme` - Get company theme/customization

### Employees
- `GET /api/employees` - List employees (with filters)
- `GET /api/employees/:id` - Get employee profile
- `POST /api/employees/applications` - Submit application
- `GET /api/employees/applications/company/:id` - List applications
- `POST /api/employees/applications/:id/approve` - Approve application
- `POST /api/employees/applications/:id/reject` - Reject application
- `GET /api/employees/:id/availability` - Get availability
- `POST /api/employees/:id/availability` - Set availability

### Appointments
- `GET /api/appointments` - List appointments (with filters)
- `GET /api/appointments/:id` - Get appointment details
- `POST /api/appointments` - Create appointment
- `PATCH /api/appointments/:id/status` - Update status
- `GET /api/appointments/employee/:id/available-slots` - Get available slots

### Tags
- `GET /api/tags` - List all tags
- `POST /api/tags` - Create tag
- `GET /api/tags/search?q=keyword` - Search tags

## 🎨 Customization

### Company Theme
Each company can customize:
- Primary and secondary colors
- Font family
- Logo and banner images
- About page HTML content
- Custom domain (optional)

Theme configuration is stored in JSON format:
```json
{
  "primaryColor": "#0066ff",
  "secondaryColor": "#f2f2f2",
  "fontFamily": "Roboto"
}
```

## 📅 Calendar System

### Availability
Employees set recurring weekly availability:
- Day of week (0-6, Sunday-Saturday)
- Start time
- End time

### Appointments
- Real-time conflict detection
- Automatic validation against availability
- Status tracking (pending, confirmed, cancelled, completed)

## 🔒 Security

- Passwords hashed with bcrypt
- JWT tokens for authentication
- SQL injection prevention with parameterized queries
- CORS enabled for API
- Input validation on all endpoints

## 🧪 Testing

### Manual Testing Flow

1. **Create a company**:
```bash
curl -X POST http://localhost:3001/api/companies \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tech Services Co",
    "cnpj": "12345678000190",
    "description": "Professional tech services"
  }'
```

2. **Create tags**:
```bash
curl -X POST http://localhost:3001/api/tags \
  -H "Content-Type: application/json" \
  -d '{"name": "Web Development", "category": "Technology"}'
```

3. **Submit employee application**:
```bash
curl -X POST http://localhost:3001/api/employees/applications \
  -H "Content-Type: application/json" \
  -d '{
    "company_id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "bio": "Experienced web developer",
    "tag_ids": [1]
  }'
```

4. **Approve application** (creates employee)

5. **Book appointment** through the UI

## 🚧 Future Enhancements

- [ ] Email/SMS notification integration (SendGrid/Twilio)
- [ ] Payment processing (Stripe/PayPal)
- [ ] Advanced calendar with drag-and-drop
- [ ] Google Calendar / Outlook integration
- [ ] Real-time chat between clients and employees
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Advanced search with filters
- [ ] Rating and review system (already in schema)

## 📝 Development Notes

### Adding New Features
1. Update database schema in `backend/src/migrations/schema.js`
2. Create/update API routes in `backend/src/routes/`
3. Add frontend API calls in `frontend/src/services/api.js`
4. Create/update UI components in `frontend/src/pages/` or `components/`

### Environment Variables
Backend uses:
- `DB_*` - Database connection
- `JWT_SECRET` - Token signing key
- `PORT` - Server port
- `NODE_ENV` - Environment (development/production)

Frontend uses:
- `VITE_API_URL` - Backend API URL (optional, defaults to `/api`)

## 🤝 Contributing

This is a demonstration project showing the implementation of the service platform as specified in the requirements.

## 📄 License

MIT License - Feel free to use this as a starting point for your own projects.

## 🆘 Support

For questions or issues:
1. Check the API documentation
2. Review the database schema
3. Check browser console for frontend errors
4. Check server logs for backend errors

## ✅ Implementation Checklist

- [x] Database schema with all required tables
- [x] RESTful API with Express
- [x] Authentication system with JWT
- [x] Company management endpoints
- [x] Employee application workflow
- [x] Employee profiles with tags
- [x] Calendar/availability system
- [x] Appointment booking with conflict detection
- [x] React frontend with routing
- [x] Search and filter functionality
- [x] Company dashboard for managing team
- [x] Client booking interface
- [x] Responsive design
- [x] Complete documentation
