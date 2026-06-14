# Doctor Hub

## Live App URL 

https://doctorhub-final.vercel.app

> **Local setup guide:** see [LOCAL_SETUP.md](LOCAL_SETUP.md)

Healthcare consultation & patient history platform (Patient, Doctor, Assistant, Admin, Super Admin).

## Quick Start

```bash
npm run install:all
cd backend && npm run check && npm run seed
# Terminal 1: cd backend && npm start
# Terminal 2: cd frontend && npm run dev
# Or double-click start-local.bat (Windows)
```

- App: http://localhost:5173
- API: http://localhost:5000

---

# Doctor Appointment Web App (Legacy docs below)

Doctor Hub is a full-stack web application that simplifies booking doctor appointments. It supports three roles: **Patient**, **Doctor**, and **Admin**, with Stripe payment integration and image uploads via Cloudinary.

## Tech Stack

- **Frontend**: React.js, Tailwind CSS, Vite
- **Admin Panel**: React.js, Tailwind CSS, Vite
- **Backend**: Node.js, Express.js
- **Database**: Supabase (PostgreSQL)
- **Storage**: Cloudinary (doctor/user images)
- **Payment**: Stripe Checkout
- **Auth**: JWT (jsonwebtoken) + bcrypt

## Project Structure

```
Doctor Hub/
├── frontend/        # Patient-facing React app
├── admin/           # Admin & Doctor React app
└── backend/         # Express.js API server
```

## Features

### Patient
- Register / Login
- Browse and filter doctors by speciality
- Book appointment slots
- Pay online via Stripe Checkout
- View and cancel appointments
- Edit profile (name, phone, address, gender, DOB, photo)

### Doctor
- Login to doctor dashboard
- View appointments, earnings, patient count
- Mark appointments complete or cancel them
- Update profile (fees, address, about, availability)

### Admin
- Login with hardcoded credentials
- Add doctors (with Cloudinary image upload)
- View all doctors, toggle availability
- View all appointments, cancel any
- Dashboard with total doctors, patients, appointments

## Environment Variables

### `backend/.env`
```
SUPABASE_URL=
SUPABASE_KEY=
CLOUDINARY_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_SECRET_KEY=
JWT_SECRET=
ADMIN_EMAIL=
ADMIN_PASSWORD=
STRIPE_SECRET_KEY=
FRONTEND_URL=
CURRENCY=USD
PORT=5000
```

### `frontend/.env`
```
VITE_BACKEND_URL=
VITE_ADMIN_URL=
VITE_STRIPE_PUBLISHABLE_KEY=
```

### `admin/.env`
```
VITE_BACKEND_URL=
VITE_FRONTEND_URL=
VITE_CURRENCY=USD
```

## Database (Supabase)

Run `backend/supabase_schema.sql` in your Supabase SQL Editor to create the required tables:

- `users` — patient accounts
- `doctors` — doctor profiles with slots
- `appointments` — booking records with JSONB user/doc snapshots

## Running Locally

```bash
# Backend
cd backend
npm install
node server.js

# Frontend
cd frontend
npm install
npm run dev

# Admin
cd admin
npm install
npm run dev
```

## Deployment

All three apps are deployed separately on Vercel. The backend requires a `vercel.json` (included) and all environment variables must be set in the Vercel dashboard — `.env` files are not used in production.

Make sure `FRONTEND_URL` in the backend matches the deployed frontend URL for Stripe redirect to work correctly.
## Project URL



## Screenshots

<img width="500" height="250" alt="image" src="https://github.com/user-attachments/assets/2e258613-1225-459d-9711-24437c1d070e" /><img width="500" height="250" alt="image" src="https://github.com/user-attachments/assets/ffad1b5a-9931-40d9-8d81-702e2bdba5cc" /><img width="500" height="250" alt="image" src="https://github.com/user-attachments/assets/b938fc3a-9c30-4c0f-904b-6ba6a0c29f47" /><img width="500" height="250" alt="image" src="https://github.com/user-attachments/assets/e30797a9-2bc4-45d9-be4d-e6928f17f404" /><img width="500" height="250" alt="image" src="https://github.com/user-attachments/assets/33763ecf-a180-4eb8-8917-0865432ea1cb" /><img width="500" height="250" alt="image" src="https://github.com/user-attachments/assets/53f5267c-2424-4683-abf2-3823af65a0c4" /><img width="500" height="250" alt="image" src="https://github.com/user-attachments/assets/f7d26cdf-b3e3-44ec-89c9-44d108f9e037" /><img width="500" height="250" alt="image" src="https://github.com/user-attachments/assets/6a18a858-30cb-40f1-8b00-974f5cabcc73" /><img width="500" height="250" alt="image" src="https://github.com/user-attachments/assets/2b34e5a1-944b-4929-9dee-bd1d264db5d9" /><img width="500" height="250" alt="image" src="https://github.com/user-attachments/assets/2e773882-3ab5-4712-891b-0a776574aecb" /><img width="500" height="250" alt="image" src="https://github.com/user-attachments/assets/8a7d09de-1a07-418e-a8b2-8632f6bb2c4c" /><img width="500" height="250" alt="image" src="https://github.com/user-attachments/assets/3275bcc0-84cd-42d6-933f-1071c5b445e4" /><img width="500" height="250" alt="image" src="https://github.com/user-attachments/assets/40fcb26b-bce5-4466-94c7-c02f08969f8f" /><img width="1553" height="250" alt="image" src="https://github.com/user-attachments/assets/6c70e34f-72f1-441f-85d2-0186bf10e162" /><img width="500" height="250" alt="image" src="https://github.com/user-attachments/assets/91456f74-bb36-4a94-b1ca-e0ffdd2c2f09" /><img width="500" height="250" alt="image" src="https://github.com/user-attachments/assets/e0d38434-3654-4499-b288-ee70cfc1eae5" /><img width="500" height="250" alt="image" src="https://github.com/user-attachments/assets/88ffbc77-bbe5-447a-92f9-3cfebd8d6732" /><img width="500" height="250" alt="image" src="https://github.com/user-attachments/assets/b5428c82-7b66-4ae7-85fd-f9bef232ff16" /><img width="500" height="250" alt="image" src="https://github.com/user-attachments/assets/c9637c26-0db3-4fa8-b3ac-c95a03f3f71e" />



























