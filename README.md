# SmartTask
Task Management System

Project Overview
SmartTask is a task managament system designed to help users track, create, and orgainize task to remain productive. This prject uses React frontend, Node.js backend, and PostgreSQL database. 

System Requirements 
To run this project, the following software need to be installed.
  Node.js
  PostgreSQL
  Git
  Web browser 

  Setup Instructions

  cd smarttask

  Set Up the Backend
  1. Navigate to the backend folder: cd smarttask-backend
  2. Install backend dependencies: npm install
  3. Creat a .env file
  4. Open .env and enter you databse credentials:
     a. DB_USER
     b. DB_HOST
     c. DB_NAME
     d. DB_PASSWORD
     e. DB_PORT
  5. Set up the database: psql -U postgres -d smarttask -f queries.sql
  6. Start backend server

Set Up the Frontend
1. Open a new terminal and go to frontend folder: cd smarttask-frontend
2. Intall frontend dependencies: npm install
3. Make sure proxy is set in package.json
4. Start server: npm start
5. Open brower and go to local host

Key Features
1. Create Tasks
2. View Task List
3. Assign Users
4. Update Task Status
5. Delete Tasks

     

