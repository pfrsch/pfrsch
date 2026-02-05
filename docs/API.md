# API Documentation

## Base URL
```
http://localhost:3001/api
```

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### Authentication

#### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "role": "owner",
  "company_id": 1
}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "owner"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST /auth/login
Login to get JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "owner",
    "company_id": 1
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Companies

#### GET /companies
List all companies.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Tech Services Co",
    "cnpj": "12345678000190",
    "description": "Professional tech services",
    "logo_url": "https://example.com/logo.png",
    "banner_url": "https://example.com/banner.png",
    "theme": {
      "primaryColor": "#0066ff",
      "secondaryColor": "#f2f2f2"
    },
    "created_at": "2024-01-01T00:00:00.000Z"
  }
]
```

#### GET /companies/:id
Get company details by ID.

#### POST /companies
Create a new company.

**Request Body:**
```json
{
  "name": "Tech Services Co",
  "cnpj": "12345678000190",
  "description": "Professional tech services",
  "logo_url": "https://example.com/logo.png",
  "theme": {
    "primaryColor": "#0066ff",
    "secondaryColor": "#f2f2f2",
    "fontFamily": "Roboto"
  }
}
```

#### PUT /companies/:id
Update company information.

#### GET /companies/:id/theme
Get company theme/customization settings.

**Response:**
```json
{
  "theme": {
    "primaryColor": "#0066ff",
    "secondaryColor": "#f2f2f2",
    "fontFamily": "Roboto"
  },
  "logo_url": "https://example.com/logo.png",
  "banner_url": "https://example.com/banner.png",
  "custom_domain": "mycompany.com"
}
```

---

### Employees

#### GET /employees
List all employees with optional filters.

**Query Parameters:**
- `company_id` (optional) - Filter by company
- `tag_id` (optional) - Filter by specialty tag

**Response:**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "company_id": 1,
    "company_name": "Tech Services Co",
    "photo_url": "https://example.com/photo.jpg",
    "bio": "Experienced web developer",
    "hourly_rate": 75.00,
    "tags": ["Web Development", "JavaScript", "React"],
    "created_at": "2024-01-01T00:00:00.000Z"
  }
]
```

#### GET /employees/:id
Get employee profile with availability.

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "company_id": 1,
  "company_name": "Tech Services Co",
  "bio": "Experienced web developer",
  "hourly_rate": 75.00,
  "tags": ["Web Development", "JavaScript"],
  "tag_ids": [1, 2],
  "availability": [
    {
      "id": 1,
      "weekday": 1,
      "start_time": "09:00:00",
      "end_time": "17:00:00"
    }
  ]
}
```

#### POST /employees/applications
Submit a new employee application.

**Request Body:**
```json
{
  "company_id": 1,
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+1234567890",
  "photo_url": "https://example.com/jane.jpg",
  "bio": "Full-stack developer",
  "tag_ids": [1, 2, 3]
}
```

#### GET /employees/applications/company/:company_id
List applications for a company.

**Query Parameters:**
- `status` (optional) - Filter by status (pending, approved, rejected)

#### POST /employees/applications/:id/approve
Approve an employee application (creates employee record).

**Response:**
```json
{
  "employee": {
    "id": 2,
    "name": "Jane Smith",
    "company_id": 1
  },
  "message": "Application approved successfully"
}
```

#### POST /employees/applications/:id/reject
Reject an employee application.

#### GET /employees/:id/availability
Get employee's weekly availability schedule.

#### POST /employees/:id/availability
Add availability slot for employee.

**Request Body:**
```json
{
  "weekday": 1,
  "start_time": "09:00",
  "end_time": "17:00"
}
```

---

### Appointments

#### GET /appointments
List appointments with filters.

**Query Parameters:**
- `employee_id` (optional) - Filter by employee
- `status` (optional) - Filter by status
- `start_date` (optional) - Filter by start date
- `end_date` (optional) - Filter by end date

**Response:**
```json
[
  {
    "id": 1,
    "employee_id": 1,
    "employee_name": "John Doe",
    "company_name": "Tech Services Co",
    "client_name": "Alice Johnson",
    "client_email": "alice@example.com",
    "start_timestamp": "2024-02-10T10:00:00.000Z",
    "end_timestamp": "2024-02-10T11:00:00.000Z",
    "status": "confirmed",
    "description": "Website consultation"
  }
]
```

#### GET /appointments/:id
Get appointment details.

#### POST /appointments
Create a new appointment.

**Request Body:**
```json
{
  "employee_id": 1,
  "client_name": "Alice Johnson",
  "client_email": "alice@example.com",
  "client_phone": "+1234567890",
  "start_timestamp": "2024-02-10T10:00:00",
  "end_timestamp": "2024-02-10T11:00:00",
  "description": "Website consultation"
}
```

**Success Response:**
```json
{
  "id": 1,
  "employee_id": 1,
  "client_name": "Alice Johnson",
  "status": "pending",
  "created_at": "2024-02-05T17:00:00.000Z"
}
```

**Error Response (Conflict):**
```json
{
  "error": "Time slot not available",
  "conflicting_appointment_id": 5
}
```

#### PATCH /appointments/:id/status
Update appointment status.

**Request Body:**
```json
{
  "status": "confirmed"
}
```

Valid statuses: `pending`, `confirmed`, `cancelled`, `completed`

#### GET /appointments/employee/:employee_id/available-slots
Get available time slots for a specific date.

**Query Parameters:**
- `date` (required) - Date in YYYY-MM-DD format

**Response:**
```json
{
  "date": "2024-02-10",
  "availability": [
    {
      "weekday": 6,
      "start_time": "09:00:00",
      "end_time": "17:00:00"
    }
  ],
  "appointments": [
    {
      "start_timestamp": "2024-02-10T10:00:00.000Z",
      "end_timestamp": "2024-02-10T11:00:00.000Z"
    }
  ]
}
```

---

### Tags

#### GET /tags
List all tags.

**Query Parameters:**
- `category` (optional) - Filter by category

**Response:**
```json
[
  {
    "id": 1,
    "name": "Web Development",
    "category": "Technology",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
]
```

#### POST /tags
Create a new tag.

**Request Body:**
```json
{
  "name": "Mobile Development",
  "category": "Technology"
}
```

#### GET /tags/search
Search tags by name.

**Query Parameters:**
- `q` (required) - Search query

**Response:**
```json
[
  {
    "id": 1,
    "name": "Web Development",
    "category": "Technology"
  }
]
```

---

## Error Responses

All endpoints may return these error responses:

**400 Bad Request:**
```json
{
  "error": "Invalid input data"
}
```

**401 Unauthorized:**
```json
{
  "error": "Invalid credentials"
}
```

**404 Not Found:**
```json
{
  "error": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Something went wrong!"
}
```

## Rate Limiting

Currently no rate limiting is implemented. For production use, consider adding rate limiting middleware.

## Pagination

For endpoints that return lists, consider adding pagination in future updates:
- `page` - Page number (default: 1)
- `per_page` - Items per page (default: 30, max: 100)
