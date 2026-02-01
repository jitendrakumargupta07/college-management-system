# 🎓 College Management System

A full-stack **College Management System** built using the **MERN stack** that streamlines student, admin, academic, and fee management in one platform.

This system provides **role-based access** for Students and Admins, secure authentication using JWT, and a modern responsive UI.

---

## 🚀 Live Demo
*(Add links after deployment)*  
- **Frontend:** https://your-frontend-url  
- **Backend API:** https://your-backend-url  

---

## 🛠️ Tech Stack

### Frontend
- React.js
- React Router
- Axios
- Tailwind CSS
- Vite / CRA

### Backend
- Node.js
- Express.js
- MongoDB (Atlas)
- Mongoose
- JWT Authentication
- Multer (File Uploads)
- PDFKit & ExcelJS (Reports)

---

## ✨ Features

### 👨‍🎓 Student Portal
- Student Registration & Login
- Admission Form Submission
- View Profile & Update Details
- View Exam Timetable
- View Subjects & Results
- Download Result PDF
- Download Admit Card
- Pay Fees & View Fee Status
- View Notices
- Change Password

---

### 👨‍💼 Admin Portal
- Admin Login (Role-based access)
- Dashboard with system statistics
- Approve / Reject Student Admissions
- Manage Students (View, Update, Delete)
- Create & Manage Subjects
- Create & Manage Exam Timetables
- Upload Results & Admit Cards
- Create & Manage Notices
- Fee Management (Create Requests, Update Status)
- Generate Reports (PDF / Excel)
  - Student Report
  - Fee Report

---

## 🔐 Authentication & Authorization
- JWT-based authentication
- Protected routes
- Admin-only access using middleware
- Secure password hashing

---

## 📁 Project Structure

college-management-system/
│
├── backend/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── middleware/
│ ├── uploads/
│ ├── server.js
│ └── package.json
│
├── frontend/
│ ├── src/
│ ├── public/
│ └── package.json
│
├── .gitignore
└── README.md


---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
PORT=5000
MONGODB_URI=your_mongodb_atlas_url
JWT_SECRET=your_jwt_secret
NODE_ENV=development


### Frontend (`frontend/.env`)
REACT_APP_API_URL=http://localhost:5000


> ⚠️ **Do not push `.env` files to GitHub**

---

## ▶️ Run Locally

### 1️⃣ Clone Repository
```bash
git clone https://github.com/jitendrakumargupta07/college-management-system.git
cd college-management-system
2️⃣ Backend Setup
cd backend
npm install
npm start
Backend runs on:
http://localhost:5000

3️⃣ Frontend Setup
cd frontend
npm install
npm start
Frontend runs on:
http://localhost:3000

🔑 Demo Admin Credentials
(For testing purposes)

Email: admin@college.com
Password: admin123
📊 Reports
Student Reports (PDF / Excel)

Fee Reports (PDF / Excel)

🧠 Future Enhancements
Email notifications

Payment gateway integration

Attendance module

Role-based permissions

Mobile responsiveness improvements

👨‍💻 Author
Jitendra Kumar Gupta

GitHub: https://github.com/jitendrakumargupta07

