# Fitness & Wellness Tracker API

This project is a full-featured RESTful API for tracking workouts, fitness goals, and daily wellness logs. It represents the final capstone project for a backend development course and demonstrates secure authentication, role-based authorization, database design, and professional API documentation.

---

## Features

- RESTful API built with Node.js and Express
- Relational database using SQLite and Sequelize ORM
- JWT-based authentication (register, login, logout)
- Role-based authorization (user, coach)
- Ownership-based access control
- Full CRUD operations for all resources
- Centralized error handling and request logging
- Unit testing with Jest and Supertest
- Postman API documentation with example requests

---

## 🛠 Tech Stack

- **Node.js**
- **Express.js**
- **SQLite**
- **Sequelize ORM**
- **JWT (jsonwebtoken)**
- **bcrypt**
- **Jest & Supertest**
- **Postman**

---

## 📦 Resource Types

- **Users**
- **Workouts**
- **Goals**
- **Wellness Logs**

Each resource has its own database table and supports full CRUD operations.

---

## 🔐 Authentication & Authorization

### Authentication
- Users register with a hashed password
- Login returns a JWT token
- Protected routes require a `Bearer` token in headers

### Authorization
- **User**: can access and modify their own data
- **Coach**: can view all user data
- Role-based middleware enforces permissions
- Ownership checks prevent unauthorized access

---

## TestinG
Basic unit tests are included for core functionality using Jest and Supertest.

```bash
###npm test

## Final postman link: https://documenter.getpostman.com/view/49930747/2sB3dTsTAM
## Render link: https://fitness-wellness-api.onrender.com