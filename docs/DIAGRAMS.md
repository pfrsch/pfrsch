# 🎨 Visual System Overview

This document provides visual representations of the Service Platform system.

## 📊 System Component Diagram

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                        CLIENT LAYER                           ┃
┃  ┌──────────────────────────────────────────────────────┐    ┃
┃  │              React Frontend (Port 3000)              │    ┃
┃  │  ┌────────────┬────────────┬────────────┬─────────┐ │    ┃
┃  │  │   Home     │  Search    │  Profile   │ Booking │ │    ┃
┃  │  │   Page     │   Page     │   Page     │  Page   │ │    ┃
┃  │  └────────────┴────────────┴────────────┴─────────┘ │    ┃
┃  │                    Dashboard Page                     │    ┃
┃  └──────────────────────────────────────────────────────┘    ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
                            ▼ HTTP/REST
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                        API LAYER                              ┃
┃  ┌──────────────────────────────────────────────────────┐    ┃
┃  │          Express Server (Port 3001)                  │    ┃
┃  │  ┌─────────┬─────────┬───────────┬──────────────┐   │    ┃
┃  │  │  Auth   │Companies│ Employees │ Appointments │   │    ┃
┃  │  │  Routes │ Routes  │  Routes   │   Routes     │   │    ┃
┃  │  └─────────┴─────────┴───────────┴──────────────┘   │    ┃
┃  │           Tags Routes │ JWT Middleware                │    ┃
┃  └──────────────────────────────────────────────────────┘    ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
                            ▼ SQL
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                      DATABASE LAYER                           ┃
┃  ┌──────────────────────────────────────────────────────┐    ┃
┃  │            PostgreSQL Database (Port 5432)           │    ┃
┃  │  ┌──────────┬──────────┬──────────┬──────────────┐  │    ┃
┃  │  │companies │employees │   tags   │ appointments │  │    ┃
┃  │  ├──────────┼──────────┼──────────┼──────────────┤  │    ┃
┃  │  │  users   │employee_ │employee_ │   reviews    │  │    ┃
┃  │  │          │applicatn │availablty│              │  │    ┃
┃  │  └──────────┴──────────┴──────────┴──────────────┘  │    ┃
┃  └──────────────────────────────────────────────────────┘    ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

## 🔄 User Flow Diagrams

### Flow 1: Client Books Appointment

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       ▼
   [Homepage]
       │
       ▼
 [Search Page]
   Filter by tag
       │
       ▼
[Employee List]
   Click card
       │
       ▼
[Profile Page]
View availability
       │
       ▼
 [Booking Form]
Fill details
       │
       ▼
[Submit Booking]
       │
       ▼
 Conflict Check
       │
       ├─ Yes → Error Message
       │
       └─ No → [Success]
              Appointment Created
              Email Confirmation
```

### Flow 2: Employee Application

```
┌─────────────┐
│  Applicant  │
└──────┬──────┘
       │
       ▼
[Application Form]
Enter details
Add tags
       │
       ▼
[Submit Application]
       │
       ▼
  [Database]
Status: Pending
       │
       ▼
┌─────────────┐
│ Company     │
│ Admin       │
└──────┬──────┘
       │
       ▼
[Dashboard]
Applications Tab
       │
       ├─ [Approve] ──────────┐
       │                      │
       └─ [Reject]            ▼
              │        Create Employee
              │        Add Tags
              │        Status: Approved
              ▼               │
        Status: Rejected      ▼
                    [Employee Roster]
                    Available for booking
```

### Flow 3: Company Setup

```
┌─────────────┐
│   Company   │
│   Owner     │
└──────┬──────┘
       │
       ▼
[Register Company]
Name, CNPJ, Description
       │
       ▼
[Set Theme]
Colors, Logo, Font
       │
       ▼
[Invite Employees]
Send applications
       │
       ▼
[Review Applications]
Approve team members
       │
       ▼
[Set Availability]
Each employee's schedule
       │
       ▼
[Go Live]
Ready for bookings
```

## 🗄️ Database Entity Relationships

```
                ┌─────────────────┐
                │    companies    │
                ├─────────────────┤
                │ id (PK)         │◄──────┐
                │ name            │       │
                │ theme (JSONB)   │       │
                └─────────────────┘       │
                        ▲                 │
                        │                 │
                        │ 1               │
                        │                 │
                        │ N               │
                ┌───────┴──────┐          │
                │              │          │
        ┌───────▼──────┐ ┌────▼──────────┴──┐
        │    users     │ │    employees      │
        ├──────────────┤ ├───────────────────┤
        │ id (PK)      │ │ id (PK)           │◄─────┐
        │ email        │ │ company_id (FK)   │      │
        │ password     │ │ name              │      │
        │ role         │ │ hourly_rate       │      │
        └──────────────┘ └───────────────────┘      │
                                  ▲                  │
                                  │                  │
                                  │ N                │
                                  │                  │
                                  │ N                │
        ┌─────────────┐    ┌──────┴──────┐          │ 1
        │    tags     │    │employee_tags│          │
        ├─────────────┤◄───┤─────────────┤          │
        │ id (PK)     │ N  │employee_id  │          │
        │ name        │    │tag_id (FK)  │          │
        │ category    │    └─────────────┘          │
        └─────────────┘                             │
                                                    │
        ┌──────────────────────┐    ┌───────────────┴───┐
        │employee_availability │◄───┤   appointments    │
        ├──────────────────────┤ 1  ├───────────────────┤
        │ id (PK)              │    │ id (PK)           │
        │ employee_id (FK)     │◄─┐ │ employee_id (FK)  │
        │ weekday              │  │ │ client_name       │
        │ start_time           │  │ │ start_timestamp   │
        │ end_time             │  │ │ status            │
        └──────────────────────┘  │ └───────────────────┘
                                  │         │
                                  │ N       │ 1
                                  │         │
                                  │         ▼
                                  │ ┌───────────────┐
                                  │ │    reviews    │
                                  │ ├───────────────┤
                                  └─┤ id (PK)       │
                                    │ appointment_id│
                                    │ rating        │
                                    │ comment       │
                                    └───────────────┘
```

## 🔐 Authentication Flow

```
┌────────────┐                    ┌────────────┐
│   Client   │                    │   Server   │
└─────┬──────┘                    └─────┬──────┘
      │                                 │
      │  POST /auth/register            │
      │  {email, password, role}        │
      ├────────────────────────────────►│
      │                                 │
      │                          Hash password
      │                          Store in database
      │                          Generate JWT
      │                                 │
      │  {user, token}                  │
      │◄────────────────────────────────┤
      │                                 │
   Store token                          │
   in localStorage                      │
      │                                 │
      │  GET /api/employees             │
      │  Header: Authorization: Bearer <token>
      ├────────────────────────────────►│
      │                                 │
      │                          Verify JWT
      │                          Check expiration
      │                          Extract user info
      │                          Process request
      │                                 │
      │  {employees: [...]}             │
      │◄────────────────────────────────┤
      │                                 │
```

## 📱 Page Structure

```
┌─────────────────────────────────────────────────────────┐
│                      Navigation Bar                      │
│  [Logo/Title]  [Find Services] [Dashboard] [Login]      │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                       Home Page                          │
│                                                          │
│           ┌───────────────────────────┐                 │
│           │     Hero Section          │                 │
│           │  "Connect with Service    │                 │
│           │    Professionals"         │                 │
│           │  [Start Searching]        │                 │
│           └───────────────────────────┘                 │
│                                                          │
│    ┌────────────┐ ┌────────────┐ ┌────────────┐        │
│    │ 1. Search  │ │ 2. Review  │ │ 3. Book    │        │
│    │            │ │            │ │            │        │
│    └────────────┘ └────────────┘ └────────────┘        │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                      Search Page                         │
│                                                          │
│  Filter: [All Specialties ▼]                            │
│                                                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │ [Photo]  │ │ [Photo]  │ │ [Photo]  │ │ [Photo]  │  │
│  │ Name     │ │ Name     │ │ Name     │ │ Name     │  │
│  │ Company  │ │ Company  │ │ Company  │ │ Company  │  │
│  │ $75/hr   │ │ $85/hr   │ │ $65/hr   │ │ $95/hr   │  │
│  │[Tag][Tag]│ │[Tag][Tag]│ │[Tag][Tag]│ │[Tag][Tag]│  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                    Employee Profile                      │
│                                                          │
│  ┌──────────┐  Name: John Developer                     │
│  │          │  Company: Tech Solutions                  │
│  │  Photo   │  Rate: $85/hour                           │
│  │          │                                            │
│  └──────────┘  Tags: [Web Dev] [React] [Node.js]       │
│                                                          │
│  Bio: Full-stack developer with 10 years experience...  │
│                                                          │
│  Availability:                                           │
│  Monday:    09:00 - 17:00                               │
│  Tuesday:   09:00 - 17:00                               │
│  ...                                                     │
│                                                          │
│  [Book Appointment]                                      │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                    Company Dashboard                     │
│                                                          │
│  [Employees] [Applications] [Settings]                  │
│  ───────────────────────────────────────────────        │
│                                                          │
│  Your Team:                                              │
│                                                          │
│  ┌─────────────────────────────────────────────┐        │
│  │ [Photo] John Developer                      │        │
│  │         [Web Dev] [React]                   │        │
│  └─────────────────────────────────────────────┘        │
│                                                          │
│  ┌─────────────────────────────────────────────┐        │
│  │ [Photo] Sarah Designer                      │        │
│  │         [UI/UX] [Figma]                     │        │
│  └─────────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────────┘
```

## 🎨 Color Scheme & Design

```
Primary Colors:
┌──────────┬──────────┬──────────┐
│ #0066ff  │ #f2f2f2  │ #ffffff  │
│ Primary  │Secondary │   White  │
└──────────┴──────────┴──────────┘

Status Colors:
┌──────────┬──────────┬──────────┬──────────┐
│ #28a745  │ #dc3545  │ #6c757d  │ #ffc107  │
│ Success  │  Danger  │  Gray    │ Warning  │
└──────────┴──────────┴──────────┴──────────┘

Typography:
┌────────────────────────────────────────┐
│ Font: -apple-system, Roboto, sans-serif│
│ Sizes: 12px, 14px, 16px, 24px, 48px   │
│ Weights: 400 (normal), 500, 700 (bold)│
└────────────────────────────────────────┘
```

## 📊 API Request Flow

```
Frontend                   Backend                  Database
   │                          │                         │
   │ 1. Click "Book"          │                         │
   │─────────────────────────►│                         │
   │                          │                         │
   │                          │ 2. Validate JWT         │
   │                          │ 3. Parse request        │
   │                          │                         │
   │                          │ 4. Check conflicts      │
   │                          ├────────────────────────►│
   │                          │                         │
   │                          │ 5. Query appointments   │
   │                          │◄────────────────────────┤
   │                          │                         │
   │                          │ 6. No conflicts?        │
   │                          │    Yes → Create         │
   │                          ├────────────────────────►│
   │                          │                         │
   │                          │ 7. Return new record    │
   │                          │◄────────────────────────┤
   │                          │                         │
   │ 8. Success response      │                         │
   │◄─────────────────────────┤                         │
   │                          │                         │
   │ 9. Show success message  │                         │
   │                          │                         │
```

## 🔄 Booking System Logic

```
┌────────────────────────────────────────────────────────┐
│              Appointment Creation Flow                 │
└────────────────────────────────────────────────────────┘
                         │
                         ▼
         ┌───────────────────────────┐
         │ Receive booking request   │
         │ (date, time, employee)    │
         └───────────┬───────────────┘
                     │
                     ▼
         ┌───────────────────────────┐
         │ Check employee exists     │
         └───────────┬───────────────┘
                     │
                     ▼
         ┌───────────────────────────┐
         │ Verify day/time against   │
         │ employee availability     │
         └───────────┬───────────────┘
                     │
                     ├─ Not available → ERROR
                     │
                     ▼
         ┌───────────────────────────┐
         │ Query existing            │
         │ appointments for employee │
         └───────────┬───────────────┘
                     │
                     ▼
         ┌───────────────────────────┐
         │ Check for time overlap    │
         │ (start < end &&           │
         │  end > start)             │
         └───────────┬───────────────┘
                     │
                     ├─ Conflict found → ERROR
                     │
                     ▼
         ┌───────────────────────────┐
         │ Create appointment        │
         │ Status: pending           │
         └───────────┬───────────────┘
                     │
                     ▼
         ┌───────────────────────────┐
         │ Send confirmation         │
         │ (email ready to integrate)│
         └───────────┬───────────────┘
                     │
                     ▼
                  SUCCESS
```

## 📈 Scalability Architecture

```
Current (Development):
┌────────────┐
│  Frontend  │
│ :3000      │
└─────┬──────┘
      │
      ▼
┌────────────┐
│  Backend   │
│ :3001      │
└─────┬──────┘
      │
      ▼
┌────────────┐
│ PostgreSQL │
│ :5432      │
└────────────┘

Future (Production):
                 ┌────────────┐
                 │    CDN     │
                 └──────┬─────┘
                        │
                 ┌──────▼─────┐
                 │Load Balancer│
                 └──────┬─────┘
                        │
          ┌─────────────┼─────────────┐
          │             │             │
    ┌─────▼──────┐ ┌────▼─────┐ ┌────▼─────┐
    │ API Server │ │API Server│ │API Server│
    └─────┬──────┘ └────┬─────┘ └────┬─────┘
          │             │             │
          └─────────────┼─────────────┘
                        │
                 ┌──────▼─────┐
                 │   Redis    │
                 │   Cache    │
                 └──────┬─────┘
                        │
                 ┌──────▼─────┐
                 │ PostgreSQL │
                 │  Primary   │
                 └──────┬─────┘
                        │
                 ┌──────▼─────┐
                 │ PostgreSQL │
                 │  Replica   │
                 └────────────┘
```

## 🎯 Development Workflow

```
┌──────────────────────────────────────────────────────────┐
│                  Development Process                      │
└──────────────────────────────────────────────────────────┘
                         │
                         ▼
         ┌───────────────────────────┐
         │ 1. Feature Branch         │
         │    git checkout -b feature│
         └───────────┬───────────────┘
                     │
                     ▼
         ┌───────────────────────────┐
         │ 2. Local Development      │
         │    npm run dev            │
         └───────────┬───────────────┘
                     │
                     ▼
         ┌───────────────────────────┐
         │ 3. Test Changes           │
         │    Manual testing         │
         └───────────┬───────────────┘
                     │
                     ▼
         ┌───────────────────────────┐
         │ 4. Commit & Push          │
         │    git commit / git push  │
         └───────────┬───────────────┘
                     │
                     ▼
         ┌───────────────────────────┐
         │ 5. Pull Request           │
         │    Code review            │
         └───────────┬───────────────┘
                     │
                     ▼
         ┌───────────────────────────┐
         │ 6. Merge to Main          │
         └───────────┬───────────────┘
                     │
                     ▼
         ┌───────────────────────────┐
         │ 7. Deploy                 │
         │    Automatic CI/CD        │
         └───────────────────────────┘
```

## 📚 Project Documentation Structure

```
docs/
├── README.md              (Main Documentation)
│   └── Overview, Quick Start, Features
│
├── SETUP.md               (Installation Guide)
│   └── Prerequisites, Step-by-step, Troubleshooting
│
├── API.md                 (API Reference)
│   └── All endpoints, Examples, Error codes
│
├── ARCHITECTURE.md        (System Design)
│   └── Diagrams, Decisions, Scalability
│
├── QUICK_REFERENCE.md     (Commands & Tips)
│   └── Common tasks, Queries, Shortcuts
│
├── FEATURES.md            (Feature Overview)
│   └── Workflows, Screenshots, Highlights
│
└── DIAGRAMS.md            (This File)
    └── Visual representations, Flows, Charts
```

---

## 🎊 Complete System Ready!

This visual overview complements the comprehensive documentation to help understand the Service Platform architecture, flows, and design decisions.

**For implementation details:** See other documentation files
**To get started:** See `docs/SETUP.md`
**For API usage:** See `docs/API.md`
