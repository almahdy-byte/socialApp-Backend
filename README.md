# 📱 Social Media App - Backend (Node.js & Express)

This is the backend service for a **Social Media Application** that allows users to register, connect, share media content, and chat in real-time. The application offers a mix of **RESTful** and **GraphQL** APIs, supports media uploads, and implements strong authentication and real-time communication.

---

## 🛠️ Technologies Used

- **Node.js**
- **Express.js**
- **MongoDB** + **Mongoose**
- **GraphQL**
- **Socket.io**
- **Cloudinary** + **Multer** (Media Uploads)
- **Bcrypt** & **Crypto** (Password Security)
- **Nodemailer** (Email Support)
- **JWT** (Authentication)
- **Google OAuth** (Social Login)
- **Pagination**
- **Helmet**, **CORS**, **Rate Limiter** (Security Enhancements)

---

## 🌟 Features

### 👤 Users
- Register and login using email/password or Google account
- View and edit profile information
- Upload profile pictures and other media
- Follow/unfollow users
- Explore posts from followed users

### 📝 Posts & Media
- Create, update, and delete posts
- Upload media (images/videos) using **Multer** and store them in **Cloudinary**
- Like, comment, and engage with posts

### 💬 Messaging
- Real-time 1-on-1 messaging via **Socket.io**
- Includes typing indicators and instant message delivery
- Conversation history and notifications support

---

## 🔐 Security & Authentication

- Passwords are hashed using **Bcrypt**
- Authentication via **JWT** tokens
- Optional login via **Google OAuth**
- API protected using **Helmet**, **CORS**, and **Rate Limiter**

---

## 📤 File & Media Uploads

- Handled with **Multer**
- Stored and served securely using **Cloudinary**

---

## 🚀 API Access

- Clean and modular **RESTful API**
- Optional **GraphQL** API for flexible and efficient data queries
- Pagination implemented on feeds, users, and comments

---

## 📬 Realtime Chat

- Built using **Socket.io**
- Real-time private messaging with instant delivery
- Includes **typing indicators** and message notifications

---

## 🧪 Setup & Run

```bash
# 1. Clone the repository
git clone https://github.com/your-username/social-media-backend.git

# 2. Install dependencies
cd social-media-backend
npm install

# 3. Create a .env file based on .env.example
# Server
PORT=3000

# Database
DB_URI=mongodb://localhost:27017/socialApp

# Security
SECRET_KEY=BAL7
SALT=8

# JWT Tokens
USER_ACCESS_TOKEN=your_user_access_token
USER_REFRESH_TOKEN=your_user_refresh_token
ADMIN_ACCESS_TOKEN=your_admin_access_token
ADMIN_REFRESH_TOKEN=your_admin_refresh_token

# Google OAuth
CLIENT_ID=your_google_client_id

# Cloudinary
CLOUD_NAME=your_cloudinary_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret

#email's sender
EMAIL = your_email
PASSWORD= your_password

# AI (Optional)
GEMINI_AI_KEY=your_gemini_api_key



# 4. Start the development server
npm run dev
