# AuthForge Express

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An open-source authentication backend built with **Node.js**, **Express.js**, and **MongoDB**.  
It includes JWT-based authentication, refresh tokens with database sessions, role-based access control, rate limiting, and password management. Designed for real-world projects and easily extendable.

---

## 🔹 Features

- ✅ User registration & login with hashed passwords  
- ✅ JWT authentication (access + refresh tokens)  
- ✅ Database-backed refresh tokens (sessions stored in MongoDB)  
- ✅ Role-based authorization (`user` & `admin`)  
- ✅ Password change & session invalidation  
- ✅ Logout & logout-all devices  
- ✅ Rate limiting per IP (prevents brute force login)  
- ✅ Error handling with standardized `ApiError`  
- ✅ Environment configuration centralization (`env.js`)  
- ✅ RESTful API design  

---

## 🔹 Tech Stack

- Node.js (v18+)  
- Express.js  
- MongoDB (local or Atlas)  
- Mongoose  
- JWT for authentication  
- Bcrypt for password hashing  
- dotenv for environment variables  
- Nodemon for development  

---

## 🔹 Project Structure

```bash
src/
├─ config/
│  ├─ db.js
│  └─ env.js
├─ controllers/
│  ├─ logout.controller.js
│  ├─ refresh.controller.js
│  ├─ session.controller.js
│  └─ user.controller.js
├─ middlewares/
│  ├─ auth.middleware.js
│  ├─ error.middleware.js
│  ├─ rateLimit.middleware.js
│  ├─ role.middleware.js
│  └─ validate.middleware.js
├─ models/
│  ├─ Session.model.js
│  └─ User.model.js
├─ routes/
│  ├─ admin.routes.js
│  ├─ index.js
│  ├─ logout.routes.js
│  ├─ refresh.routes.js
│  ├─ session.routes.js
│  └─ user.routes.js
├─ services/
│  ├─ refresh.service.js
│  ├─ session.service.js
│  └─ user.service.js
├─ utils/
│  ├─ ApiError.js
│  └─ jwt.js
├─ validators/
│  ├─ session.validator.js
│  └─ user.validator.js
├─ app.js
└─ server.js
```


🔹 Installation
1️⃣ Clone the repository

```bash
git clone https://github.com/hamidukarimi/authforge-express.git
cd authforge-express

```
2️⃣ Install dependencies
```bash
npm install
```

3️⃣ Create .env file

You must create a .env file in the root of the project.

You can copy from .env.example:

```bash
cp .env.example .env
```
Or manually create one with:

```bash
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_uri
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRES_IN=10m
JWT_REFRESH_EXPIRES_IN=7d
```

🔹 Running the Server
Development mode (with nodemon)

```bash
npm run dev
```
roduction mode
```bash
npm start
```

By default, the server runs on:
```bash
http://localhost:5000
```

🔹 API Overview
Authentication Routes

| Route                    | Method | Description                                  |
| ------------------------ | ------ | -------------------------------------------- |
| `/api/users/`            | POST   | Register a new user                          |
| `/api/sessions/`         | POST   | Login user (returns access & refresh tokens) |
| `/api/logout/`           | POST   | Logout current session                       |
| `/api/logout/logoutAll`  | POST   | Logout all sessions                          |
| `/api/token/`            | POST   | Get new access token using refresh token     |
| `/api/users/me/password` | PUT    | Change password (authenticated)              |

Headers

```bash
Authorization: Bearer <access_token>
Content-Type: application/json
```
🔹 Example: Login
Request
```bash
POST /api/sessions/
Content-Type: application/json

```

```bash
{
  "email": "user@example.com",
  "password": "password123"
}

```

Response
```bash
{
  "success": true,
  "message": "User logged in successfully",
  "data": {
    "user": {
      "_id": "64f1a2b3c4d5e6f7g8h9",
      "name": "John Doe",
      "email": "user@example.com",
      "role": "user"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsIn..."
  }
}
```
🔹 Contributing

This project is open-source.

You are welcome to fork, submit pull requests, or open issues.

```bash
git checkout -b feature/my-feature
git commit -m "feat: add my feature"
git push origin feature/my-feature
```
Then open a Pull Request.

🔹 License

This project is licensed under the MIT License.
See the LICENSE file for details.

🔹 Notes

Easily extensible with email verification, password reset, or OAuth providers.

Ensure environment variables are properly configured before deployment.

Never commit JWT secrets to public repositories.


⭐ Support

If you find this project useful, consider giving it a star ⭐ on GitHub.

Made with ❤️ by Hamid Karimi