🏥 MediVibe – Hospital Management System with Bed Availability

MediVibe is a full-stack MERN (MongoDB, Express.js, React.js, Node.js) web application designed to modernize hospital operations by providing real-time bed availability tracking, patient management, and role-based workflow control within a centralized digital platform.
Hospitals often struggle with inefficient bed allocation, delayed admissions, manual coordination between departments, and lack of real-time visibility into occupancy status. MediVibe addresses these challenges by introducing a structured, secure, and interactive system that ensures transparency, faster decision-making, and improved resource utilization.
The platform is built using a Single Page Application (SPA) architecture, ensuring seamless navigation, fast rendering, and dynamic content updates without full page reloads. The backend follows a RESTful API architecture, enabling scalable communication between frontend services and the MongoDB database while maintaining clean and modular code structure.

🚀 Core Objectives

Provide real-time visibility of hospital bed occupancy.
Streamline patient admission and discharge processes.
Enable role-based access for different hospital staff.
Improve coordination between departments.
Ensure secure authentication and protected system access.
Deliver a modern, interactive, and professional user experience.

🔐 Role-Based Dashboard System

MediVibe implements secure authentication using JWT and role-based authorization. 
Each user type has a dedicated dashboard customized to their responsibilities:

👑 Admin Dashboard

Overview statistics (Total Users, Total Beds, Occupancy Rate, Active Patients, Critical Cases)
Manage Users (Create, Update, Delete)
Manage Beds (Update availability status)
Manage Patients
Assign Patients to Doctors/Nurses
Generate Reports
Real-time refresh functionality

🩺 Doctor Dashboard

Current Duty Status
Assigned Patients
Upcoming Duties
Patient Details and Bed Status
Duty and shift tracking

👩‍⚕️ Nurse Dashboard

Current Shift Status
Assigned Patients
Upcoming Shifts
Patient care overview

🧾 Receptionist Dashboard

Admit New Patients
View Patient Records
Bed Availability Monitoring
Quick statistics (Total Patients, Available Beds)

🛠 Staff Dashboard

Available and Occupied Beds
Active Patients Overview
Admit & Discharge Actions
Task Management

Each dashboard includes a dynamic refresh feature that updates live data without reloading the entire application.

📊 Key Features

✅ Real-time bed availability tracking (ICU, General, Emergency, etc.)
✅ Color-coded occupancy system (Green = Available, Red = Occupied)
✅ Patient admission and discharge workflows
✅ Secure role-based authentication
✅ RESTful API integration
✅ Interactive professional UI
✅ Dynamic dashboard updates
✅ Structured database schema using MongoDB
✅ Modular and scalable backend architecture

🛠 Technology Stack
Frontend

React.js
React Router DOM
Axios
Tailwind CSS / Custom CSS
Responsive SPA Architecture

Backend

Node.js
Express.js
RESTful API Design
JWT Authentication
bcrypt for password encryption

Database

MongoDB
Mongoose ODM

Tools & Development

Git & GitHub
Postman (API Testing)
VS Code

🏗 System Architecture

MediVibe follows a client-server architecture:
React handles the UI layer and state management.
Express & Node.js manage business logic and API endpoints.
MongoDB stores user data, bed records, and patient details.
JWT ensures secure session handling.
REST APIs enable clean separation between frontend and backend.

🎯 Why MediVibe?

MediVibe is not just a CRUD-based hospital project. It is designed to simulate real-world hospital workflow systems with:
Clear user separation
Operational transparency
Secure data handling
Real-time dashboard analytics
Professional UI/UX

The system demonstrates full-stack development expertise, backend logic structuring, authentication flow, database design, and scalable application architecture.
