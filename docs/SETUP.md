# Setup Guide

This guide will walk you through setting up the Service Platform on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher): [Download here](https://nodejs.org/)
- **PostgreSQL** (v14 or higher): [Download here](https://www.postgresql.org/download/)
- **npm** or **yarn**: Comes with Node.js
- **Git**: [Download here](https://git-scm.com/)

## Step-by-Step Setup

### 1. Clone the Repository

```bash
git clone https://github.com/pfrsch/pfrsch.git
cd pfrsch
```

### 2. Set Up PostgreSQL Database

#### Option A: Using PostgreSQL CLI

```bash
# Start PostgreSQL service (varies by OS)
# macOS (using Homebrew):
brew services start postgresql

# Linux:
sudo systemctl start postgresql

# Windows: Use pgAdmin or Services

# Create the database
createdb service_platform
```

#### Option B: Using pgAdmin

1. Open pgAdmin
2. Right-click on "Databases"
3. Select "Create" > "Database"
4. Name it `service_platform`
5. Click "Save"

### 3. Configure Backend

```bash
cd backend
```

#### Install Dependencies

```bash
npm install
```

#### Set Up Environment Variables

```bash
# Copy the example .env file
cp .env.example .env
```

Edit `.env` and update with your database credentials:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=service_platform
DB_USER=your_postgres_username
DB_PASSWORD=your_postgres_password

JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=7d

PORT=3001
NODE_ENV=development
```

**Important:** Change `JWT_SECRET` to a random string for security!

#### Run Database Migrations

```bash
npm run migrate
```

You should see:
```
Running database migrations...
Migrations completed successfully!
```

#### (Optional) Seed Sample Data

```bash
npm run seed
```

This creates:
- 1 sample company
- 10 tags/specialties
- 3 sample employees with availability
- 1 sample appointment

### 4. Start the Backend Server

```bash
npm run dev
```

You should see:
```
Server running on port 3001
Environment: development
```

Test the API:
```bash
curl http://localhost:3001/health
```

Should return: `{"status":"ok","timestamp":"..."}`

### 5. Configure Frontend

Open a **new terminal window** (keep the backend running):

```bash
cd frontend
```

#### Install Dependencies

```bash
npm install
```

#### (Optional) Configure API URL

If your backend is not on `localhost:3001`, create `.env`:

```bash
echo "VITE_API_URL=http://your-backend-url/api" > .env
```

### 6. Start the Frontend Server

```bash
npm run dev
```

You should see:
```
  VITE v5.0.7  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

### 7. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

You should see the Service Platform homepage! 🎉

## Testing the Setup

### Test 1: View Sample Data

1. Click "Find Services"
2. You should see 3 sample employees (if you ran `npm run seed`)
3. Click on an employee to view their profile

### Test 2: Book an Appointment

1. From an employee profile, click "Book Appointment"
2. Fill in the form:
   - Your Name: Test User
   - Email: test@example.com
   - Date: Tomorrow
   - Time: 10:00 AM - 11:00 AM
   - Description: Test booking
3. Click "Confirm Booking"
4. You should see a success message

### Test 3: Company Dashboard

1. Click "Dashboard" in the navigation
2. View employees and pending applications
3. If you seeded data, you'll see the 3 employees listed

## Troubleshooting

### Port Already in Use

**Backend (3001):**
```bash
# Find and kill process on port 3001
# macOS/Linux:
lsof -ti:3001 | xargs kill -9

# Windows:
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

**Frontend (3000):**
```bash
# macOS/Linux:
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Database Connection Errors

1. **Check PostgreSQL is running:**
   ```bash
   # macOS/Linux:
   pg_isready
   
   # Windows: Check Services or pgAdmin
   ```

2. **Verify credentials in `.env`:**
   - Correct username/password
   - Database exists
   - User has permissions

3. **Test connection manually:**
   ```bash
   psql -h localhost -U your_username -d service_platform
   ```

### Module Not Found Errors

```bash
# Backend:
cd backend
rm -rf node_modules
npm install

# Frontend:
cd frontend
rm -rf node_modules
npm install
```

### Migration Errors

If migrations fail:

```bash
# Drop and recreate database
dropdb service_platform
createdb service_platform

# Run migrations again
cd backend
npm run migrate
```

### CORS Errors

If you see CORS errors in browser console:

1. Check that backend is running on port 3001
2. Check `frontend/vite.config.js` proxy settings
3. Try clearing browser cache

## Next Steps

- **Customize the platform**: Edit company themes, add more tags
- **Add more employees**: Use the application workflow
- **Test booking flow**: Create appointments and check availability
- **Explore the API**: See `docs/API.md` for all endpoints
- **Deploy**: See `docs/DEPLOYMENT.md` (coming soon)

## Getting Help

If you encounter issues:

1. Check the console output for error messages
2. Review the troubleshooting section above
3. Check the [API Documentation](./API.md)
4. Review the [main README](./README.md)

## Development Tips

### Hot Reload

Both frontend and backend support hot reload:
- **Backend**: Uses `--watch` flag (Node.js 18+)
- **Frontend**: Uses Vite's HMR

Changes are reflected automatically!

### Database Management

View data with PostgreSQL CLI:
```bash
psql -d service_platform

-- List all tables
\dt

-- View companies
SELECT * FROM companies;

-- View employees
SELECT * FROM employees;

-- Exit
\q
```

Or use a GUI tool like:
- [pgAdmin](https://www.pgadmin.org/)
- [DBeaver](https://dbeaver.io/)
- [TablePlus](https://tableplus.com/)

### API Testing

Use tools to test the API:
- **cURL**: Command line
- **Postman**: GUI application
- **Insomnia**: GUI application
- **VS Code REST Client**: Extension

Example with cURL:
```bash
# Get all employees
curl http://localhost:3001/api/employees

# Create a tag
curl -X POST http://localhost:3001/api/tags \
  -H "Content-Type: application/json" \
  -d '{"name":"Python","category":"Technology"}'
```

## Happy Coding! 🚀
