#📱 Social Media App – Backend (Node.js & Express)
This is the backend service for a Social Media Application that enables users to connect, share content, and interact in real-time. It includes secure authentication, media uploads, GraphQL queries, and chat features — all powered by modern web technologies.


🛠️ Technologies Used
Node.js

Express.js

MongoDB + Mongoose

GraphQL

Socket.io

Cloudinary + Multer (Image/File Uploads)

Bcrypt & Crypto (Password Security)

Nodemailer (Email Handling)

JWT (Authentication)

Google OAuth (Social Login)

Pagination

Helmet, CORS, Rate Limiter (Security Enhancements)

🌟 Features
🔐 Google OAuth Integration
Seamless third-party login using Google accounts.

💬 Real-Time Chat
Real-time messaging between users powered by Socket.io.

🖼️ Media Uploads
Images and files are uploaded using Multer and stored securely in the cloud via Cloudinary.

🔍 GraphQL API
Flexible and efficient data fetching with GraphQL schema and resolvers.

📄 Pagination Support
Improved performance and user experience with server-side pagination.

✅ Clean REST API
Structured REST endpoints with robust input validation and consistent error handling.

🧪 Setup & Run
bash
Copy
Edit
# 1. Clone the repository
git clone https://github.com/almahdy-byte/socialApp-Backend.git

# 2. Move into the project directory
cd socialApp-Backend

# 3. Install dependencies
npm install

# 4. Create a .env file based on .env.example

# 5. Start the development server
npm run dev
🚀 API Access
RESTful API for standard CRUD operations

GraphQL endpoint for optimized querying

Supports pagination for scalable feeds

📬 Real-Time Messaging
Implemented using Socket.io

Enables direct, real-time conversations between users

🔐 Security
Passwords are hashed with Bcrypt

JWT for authentication and protected routes

Helmet, CORS, and Rate Limiter for secure API access

Crypto used for token generation and reset mechanisms

🧑‍💻 Author
Developed by Mohamed Almahdy
For personal portfolio, experiments, and backend practice.

