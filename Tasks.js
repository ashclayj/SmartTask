import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null); // Task details
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [assignedUser, setAssignedUser] = useState(''); // New assigned user
    const [newStatus, setNewStatus] = useState(''); // New status

    // Fetch tasks from backend
    useEffect(() => {
        axios.get('/tasks')
            .then(response => setTasks(response.data))
            .catch(error => console.error("❌ Error fetching tasks:", error.message));
    }, []);

    // OPEN Task Detail Modal
    const openTask = (task) => {
        setSelectedTask(task);
        setAssignedUser(task.assigned_user || '');
        setNewStatus(task.status);
    };

    // CLOSE Modal
    const closeTask = () => {
        setSelectedTask(null);
    };

    // ADD New Task
    const addTask = async (e) => {
        e.preventDefault();
        if (!title.trim() || !description.trim()) {
            alert("Title and description are required!");
            return;
        }

        try {
            const response = await axios.post('/tasks', {
                title,
                description,
                status: 'pending'
            });

            setTasks([...tasks, response.data]);
            setTitle('');
            setDescription('');
        } catch (error) {
            console.error("❌ Error adding task:", error.message);
        }
    };

    // DELETE Task
    const deleteTask = async (id) => {
        try {
            await axios.delete(`/tasks/${id}`);
            setTasks(tasks.filter(task => task.id !== id));
            closeTask();
        } catch (error) {
            console.error("❌ Error deleting task:", error.message);
        }
    };

    // MARK Task as Completed
    const completeTask = async (id) => {
        try {
            const response = await axios.put(`/tasks/${id}/complete`);
            setTasks(tasks.map(task =>
                task.id === id ? { ...task, status: "completed" } : task
            ));
            closeTask();
        } catch (error) {
            console.error("❌ Error marking task as complete:", error.message);
        }
    };

    // UPDATE Task (Assign User & Change Status)
    const updateTask = async () => {
        if (!selectedTask) return;
        try {
            const response = await axios.put(`/tasks/${selectedTask.id}`, {
                status: newStatus,
                assigned_user: assignedUser
            });

            setTasks(tasks.map(task =>
                task.id === selectedTask.id ? response.data : task
            ));
            closeTask();
        } catch (error) {
            console.error("❌ Error updating task:", error.message);
        }
    };

    return (
        <div>
            <h2>Task List</h2>

            {/* Add New Task Form */}
            <form onSubmit={addTask}>
                <input
                    type="text"
                    placeholder="Task Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Task Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
                <button type="submit">Add Task</button>
            </form>

            {/* Task List */}
            <ul>
                {tasks.map(task => (
                    <li key={task.id} onClick={() => openTask(task)} style={{ cursor: 'pointer', marginBottom: '10px' }}>
                        <strong>{task.title}</strong>: {task.description} ({task.status})
                    </li>
                ))}
            </ul>

            {/* Task Detail Modal */}
            {selectedTask && (
                <div className="modal">
                    <h3>{selectedTask.title}</h3>
                    <p>{selectedTask.description}</p>

                    {/* Assign User */}
                    <label>Assign to:</label>
                    <input
                        type="text"
                        value={assignedUser}
                        onChange={(e) => setAssignedUser(e.target.value)}
                    />

                    {/* Change Status */}
                    <label>Status:</label>
                    <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>

                    {/* Buttons */}
                    <button onClick={updateTask}>Save Changes</button>
                    <button onClick={() => completeTask(selectedTask.id)}>✅ Mark as Completed</button>
                    <button onClick={() => deleteTask(selectedTask.id)}>❌ Delete</button>
                    <button onClick={closeTask}>Close</button>
                </div>
            )}
        </div>
    );
};

export default Tasks;
