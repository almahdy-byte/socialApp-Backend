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

# 4. Start the development server
npm run dev
