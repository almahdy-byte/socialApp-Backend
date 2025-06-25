📱 Social Media App – Backend (Node.js & Express)
This is the backend of a Social Media Platform that allows users to connect, share posts, chat in real-time, and manage their profiles. Built using a modern tech stack with REST & GraphQL APIs, media handling, and authentication features.

🛠️ Technologies Used
Node.js & Express.js

MongoDB & Mongoose

GraphQL – Flexible API querying

Socket.io – Real-time messaging

Cloudinary & Multer – Media uploads (images/videos)

Bcrypt & Crypto – Secure password handling

JWT – Token-based user authentication

Google OAuth – Social login integration

Nodemailer – Email verification/reset

Pagination – Optimized data loading

Helmet, CORS, Rate Limiter – API security

🌟 Features
👤 Users
Register, login (email/password or Google)

Edit profiles, profile pictures, and bio

Follow/unfollow other users

📝 Posts
Create, edit, delete posts

Upload images or videos

Like and comment on posts

💬 Real-Time Messaging
Private 1-to-1 chat between users

Typing indicators and read receipts (via Socket.io)

🔐 Authentication & Security
Passwords hashed with Bcrypt

JWT-based login & session handling

OAuth login with Google

API protected with Helmet, CORS, and Rate Limiting

🖼️ Media Uploads
Handled with Multer

Uploaded securely to Cloudinary

🚀 APIs
REST endpoints for main functionalities

GraphQL API for optimized data fetching

Pagination support in feed and messages

🧪 Setup & Run
bash
Copy
Edit
# 1. Clone the repository
git clone https://github.com/your-username/social-media-backend.git

# 2. Move into the project folder
cd social-media-backend

# 3. Install all dependencies
npm install

# 4. Configure environment variables
# Create a .env file based on .env.example

# 5. Run the development server
npm run dev
