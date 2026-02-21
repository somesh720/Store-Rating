# Store Rating Platform

## 📌 Overview

This is a full-stack web application that allows users to register, log in, and submit ratings (1–5) for stores registered on the platform.

The system supports three user roles:

1. *System Administrator*
2. *Normal User*
3. *Store Owner*

Each role has access to specific functionalities based on authorization.

---

## 🛠 Tech Stack

### Backend

- Node.js
- Express.js
- PostgreSQL (or MySQL)
- JWT Authentication
- Bcrypt for password hashing

### Frontend

- React.js
- React Router
- Axios
- TailwindCSS (optional)

---

## 🔐 Authentication & Authorization

- Single login system for all users.
- Role-based access control (RBAC).
- JWT-based authentication.
- Passwords securely hashed using bcrypt.

---

## 👥 User Roles & Features

### 1️⃣ System Administrator

- Add new stores.
- Add new users (Admin / Normal User / Store Owner).
- Dashboard:
  - Total Users
  - Total Stores
  - Total Ratings
- View all users.
- View all stores.
- Filter users and stores by:
  - Name
  - Email
  - Address
  - Role
- View store owner rating.
- Logout.

---

### 2️⃣ Normal User

- Sign up.
- Log in.
- Update password.
- View all stores.
- Search stores by:
  - Name
  - Address
- Submit rating (1–5).
- Modify submitted rating.
- Logout.

---

### 3️⃣ Store Owner

- Log in.
- Update password.
- View:
  - List of users who rated their store.
  - Average rating of their store.
- Logout.

---

## ✅ Form Validations

| Field    | Validation Rules                                                   |
| -------- | ------------------------------------------------------------------ |
| Name     | 20–60 characters                                                   |
| Address  | Max 400 characters                                                 |
| Password | 8–16 characters, at least 1 uppercase letter & 1 special character |
| Email    | Valid email format                                                 |

---

## 🗄 Database Schema (High Level)

### Users Table

- id
- name
- email
- password
- address
- role (admin / normal_user / store_owner)
- created_at

### Stores Table

- id
- name
- email
- address
- owner_id (FK → users.id)

### Ratings Table

- id
- user_id (FK → users.id)
- store_id (FK → stores.id)
- rating (1–5)
- created_at

---

## 📊 Additional Features

- Sorting support (ASC/DESC) on:
  - Name
  - Email
  - Address
  - Role
- Clean RESTful API structure.
- Proper error handling.
- Role-based route protection.
- Secure backend validation.

---

## 🚀 Setup Instructions

### Backend

bash
cd backend
npm install
npm run dev
