const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express(); // Declare 'app' before using it

app.use(cors({ origin: 'http://localhost:3000' })); // Allow React requests
app.use(express.json()); // Allow JSON in requests

// Database connection
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "smarttask",
    password: process.env.DB_PASSWORD, 
    port: 5432
});

pool.connect()
    .then(() => console.log('✅ Connected to PostgreSQL'))
    .catch(err => console.error('Database connection error:', err));

// GET tasks
app.get('/tasks', async (req, res) => {
    try {
        const tasks = await pool.query('SELECT * FROM tasks');
        res.json(tasks.rows);
    } catch (err) {
        console.error("Database error:", err.message);
        res.status(500).send('Server Error');
    }
});

// DELETE a task by ID
app.delete('/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
        res.json({ message: "Task deleted successfully!" });
    } catch (err) {
        console.error("Error deleting task:", err.message);
        res.status(500).send('Server Error');
    }
});


// UPDATE task status & assign user
app.put('/tasks/:id', async (req, res) => {
    try {
        const { status, assigned_user } = req.body;
        const { id } = req.params;

        const updatedTask = await pool.query(
            'UPDATE tasks SET status = $1, assigned_user = $2 WHERE id = $3 RETURNING *',
            [status, assigned_user, id]
        );

        res.json(updatedTask.rows[0]);
    } catch (err) {
        console.error("Error updating task:", err.message);
        res.status(500).send('Server Error');
    }
});

// MARK task as completed
app.put('/tasks/:id/complete', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedTask = await pool.query(
            'UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *',
            ['completed', id]
        );

        res.json(updatedTask.rows[0]);
    } catch (err) {
        console.error("Error updating task:", err.message);
        res.status(500).send('Server Error');
    }
});

// POST task
app.post('/tasks', async (req, res) => {
    try {
        const { title, description, status } = req.body;
        const newTask = await pool.query(
            'INSERT INTO tasks (title, description, status) VALUES ($1, $2, $3) RETURNING *',
            [title, description, status || 'pending']
        );
        res.json(newTask.rows[0]); // Send back the created task
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, '127.0.0.1', () => console.log(`Server running on http://127.0.0.1:${PORT}`));


