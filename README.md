📱 Social Media App - Backend (Node.js & Express)
This is the backend service for a Social Media Application that enables users to register, connect, share media, and chat in real-time. The app uses RESTful and GraphQL APIs, supports media uploads, and ensures secure authentication and communication.

🛠️ Technologies Used
Node.js

Express.js

MongoDB + Mongoose

GraphQL

Socket.io

Cloudinary + Multer (File Uploads)

Bcrypt & Crypto (Password Security)

Nodemailer (Emailing)

JWT (Authentication)

Google OAuth (Social Login)

Pagination

Helmet, CORS, Rate Limiter (Security Enhancements)

🌟 Features
👤 Users
Register and login with email/password or Google

View and edit their profile and media

Follow/unfollow other users

View posts and interact with others

📝 Posts & Media
Create, edit, and delete posts

Upload images and media using Multer & Cloudinary

Like and comment on posts

💬 Messaging
Real-time 1:1 chat system using Socket.io

Instant messaging with typing indicators and notifications

🔐 Security & Authentication
Passwords are securely hashed using Bcrypt

JWT for token-based session handling

Google OAuth for seamless third-party login

API protected using Helmet, CORS, and Rate Limiter

📤 File & Media Uploads
Image and media uploads handled via Multer

Files stored securely in the cloud using Cloudinary

🚀 API Access
Clean and modular RESTful API for core features

GraphQL support for optimized and flexible data access

Pagination for improved performance on feeds and comments

📬 Realtime Chat
Socket.io enables real-time private messaging between users

Includes typing indicators and instant delivery

🧪 Setup & Run
bash
Copy
Edit
# 1. Clone the repository
git clone https://github.com/your-username/social-media-backend.git

# 2. Install dependencies
cd social-media-backend
npm install

# 3. Create a .env file based on .env.example

# 4. Start the development server
npm run dev
