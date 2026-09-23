# SCMS — Smart Complaint Management System

SCMS is a full-stack complaint-management application for submitting, assigning, tracking, and resolving complaints. It supports three roles—user, admin, and employee—and records a timeline for each complaint.

## Features

### User

- Register and sign in.
- Submit complaints with an optional image.
- Edit or delete a complaint while it is pending.
- Review submitted complaints and their progress timelines.
- See the reason when a complaint is rejected.

### Admin

- View and filter all complaints by status, category, and priority.
- Assign complaints to employees.
- Reject complaints with a required remark.
- Review dashboard statistics and status charts.
- Promote users to employees or demote employees to users.

### Employee

- View assigned complaints.
- Mark work as **On Working**.
- Resolve complaints with proof images.
- Review resolved-complaint history.

## Complaint workflow

```text
User submits a complaint
          |
       Pending
          |
   Admin reviews it
      |          |
   Reject      Assign
      |          |
 Rejected   In Progress
                  |
             On Working
                  |
              Resolved
```

## Technology

| Area | Tools used |
| --- | --- |
| Frontend | React 18, Vite, React Router, Axios, Recharts, React Hot Toast |
| Backend | Node.js and Express 4 |
| Database | MongoDB with Mongoose |
| Authentication | JWT and bcryptjs |
| File uploads | Multer and Cloudinary |
| Styling | Bootstrap, Font Awesome, and custom CSS |

The frontend uses a light-gray and red UI theme. Three.js and animated canvas backgrounds are not used.

## Project structure

```text
SCMS/
├── backend/
│   ├── config/           # MongoDB and Cloudinary setup
│   ├── controllers/      # Auth, complaint, admin, and employee logic
│   ├── middlewares/      # JWT and role guards
│   ├── models/           # User and complaint schemas
│   ├── routes/           # Express API routes
│   └── server.js
├── frontend21/
│   ├── public/           # Static assets
│   └── src/
│       ├── components/   # Navbar, protected routes, forms, and cards
│       ├── pages/        # Landing, auth, user, admin, and employee views
│       ├── Services/     # Axios API functions
│       └── Utils/        # Error helper
└── README.md
```

## Prerequisites

- Node.js 18 or later
- npm
- A MongoDB database (local or Atlas)
- A Cloudinary account for image uploads

## Setup

### 1. Configure and run the backend

Create `backend/.env`:

```env
PORT=8080
MONGO_URL=mongodb_connection_string
JWT_SECRET=replace_with_a_long_random_secret
ADMIN_SECRET_KEY=admin_registration_secret
CLOUDINARY_CLOUD_NAME=cloudinary_cloud_name
CLOUDINARY_API_KEY=cloudinary_api_key
CLOUDINARY_API_SECRET=cloudinary_api_secret
```

```bash
cd backend
npm install
npm run dev
```

The backend runs on `http://localhost:8080` by default.

### 2. Configure and run the frontend

Create `frontend21/.env`:

```env
VITE_API_URL=http://localhost:8080/api/v1
```

```bash
cd frontend21
npm install
npm run dev
```

Vite normally serves the app at `http://localhost:5173`.

### Production build

```bash
cd frontend21
npm run build
npm run preview
```

## Frontend routes

| Route | Access | Purpose |
| --- | --- | --- |
| `/` | Public | Landing page; signed-in users are redirected to their dashboard |
| `/login` | Public | Sign in |
| `/register` | Public | User or admin registration |
| `/home` | User | User dashboard |
| `/my-complaints` | User | Submitted complaints |
| `/complaint/:id` | User | Complaint timeline |
| `/admin` | Admin | Admin dashboard |
| `/admin/complaints` | Admin | Complaints, filters, and assignment actions |
| `/admin/timeline/:id` | Admin | Complaint timeline |
| `/admin/users` | Admin | User and employee management |
| `/employee` | Employee | Assigned complaints |
| `/employee/resolved` | Employee | Resolved-complaint history |

## API reference

Protected endpoints require the JWT token in the `Authorization` header.

### Authentication

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/v1/user/register` | Register a user |
| `POST` | `/api/v1/user/admin/register` | Register an admin with `ADMIN_SECRET_KEY` |
| `POST` | `/api/v1/user/login` | Sign in as any role |

### Complaints

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/v1/complaint/submit` | Submit a complaint; optional `image` upload |
| `GET` | `/api/v1/complaint/my` | Get the signed-in user's complaints |
| `GET` | `/api/v1/complaint/:id` | Get one complaint and its timeline |
| `PUT` | `/api/v1/complaint/update/:id` | Update a pending complaint; optional `image` upload |
| `DELETE` | `/api/v1/complaint/delete/:id` | Delete a pending complaint |

### Admin

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/v1/admin/stats` | Dashboard statistics |
| `GET` | `/api/v1/admin/complaints` | All complaints; supports `status`, `category`, and `priority` filters |
| `GET` | `/api/v1/admin/users` | All users |
| `GET` | `/api/v1/admin/employees` | All employees |
| `PATCH` | `/api/v1/admin/assign/:id` | Assign a complaint to an employee |
| `PATCH` | `/api/v1/admin/reject/:id` | Reject a complaint with an admin remark |
| `PATCH` | `/api/v1/admin/promote/:id` | Promote a user to employee |
| `PATCH` | `/api/v1/admin/demote/:id` | Demote an employee to user |

### Employee

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/v1/employee/my-complaints` | Assigned active complaints |
| `GET` | `/api/v1/employee/resolved` | Resolved complaints assigned to the employee |
| `PATCH` | `/api/v1/employee/update/:id` | Update status; accepts `resolvedImage` when resolving |

## Complaint data

Categories: `Infrastructure`, `Hostel`, `Food`, `Transport`, `Cleanliness`, and `Other`.

Priorities: `Low`, `Medium`, and `High`.

Statuses: `Pending`, `In Progress`, `On Working`, `Resolved`, and `Rejected`.

## Security notes

- Do not commit `.env` files or Cloudinary credentials.
- Use a long random `JWT_SECRET` in production.
- Restrict CORS origins before deploying outside local development.
