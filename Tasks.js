import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [assignedUser, setAssignedUser] = useState('');
    const [newStatus, setNewStatus] = useState('');
    const [dueFilter, setDueFilter] = useState('all');
    const [userList, setUserList] = useState([]);


    useEffect(() => {
        axios
            .get('/tasks')
            .then((response) => {
                console.log('Fetched tasks:', response.data);
                setTasks(response.data);
            })
            .catch((error) => console.error("Error fetching tasks:", error.message));
    }, []);

    useEffect(() => {
        // Fake users
        const fakeUsers = [
            { name: "Ashley Johnson" },
            { name: "Jordan Lewis" },
            { name: "Taylor Jones" },
            { name: "Chris Bong" }
        ];
        setUserList(fakeUsers);
    }, []);


    const openTask = (task) => {
        setSelectedTask(task);
        setAssignedUser(task.assigned_user || '');
        setNewStatus(task.status);
    };

    const closeTask = () => {
        setSelectedTask(null);
    };

    const addTask = async (e) => {
        e.preventDefault();
        console.log("Add Task button clicked");
        if (!title.trim() || !description.trim()) {
            alert('Title and description are required!');
            return;
        }

        try {
            const response = await axios.post('/tasks', {
                title,
                description,
                status: 'pending',
                due_date: dueDate,
            });

            setTasks([...tasks, response.data]);
            setTitle('');
            setDescription('');
            setDueDate('');
        } catch (error) {
            console.error(' Error adding task:', error.message);
        }
    };
    //deleting task
    const deleteTask = async (id) => {
        try {
            await axios.delete(`/tasks/${id}`);
            setTasks(tasks.filter((task) => task.id !== id));
            closeTask();
        } catch (error) {
            console.error(' Error deleting task:', error.message);
        }
    };

    const completeTask = async (id) => {
        try {
            const response = await axios.put(`/tasks/${id}/complete`);
            setTasks(
                tasks.map((task) =>
                    task.id === id ? { ...task, status: 'completed' } : task
                )
            );
            closeTask();
        } catch (error) {
            console.error(' Error marking task as complete:', error.message);
        }
    };

    const updateTask = async () => {
        if (!selectedTask) return;
        try {
            const response = await axios.put(`/tasks/${selectedTask.id}`, {
                status: newStatus,
                assigned_user: assignedUser,
            });

            setTasks(
                tasks.map((task) =>
                    task.id === selectedTask.id ? response.data : task
                )
            );
            closeTask();
        } catch (error) {
            console.error(' Error updating task:', error.message);
        }
    };

    const filteredTasks = tasks.filter((task) => {
        const taskDue = task.due_date || task.dueDate;
        const today = new Date().toISOString().split('T')[0];

        if (dueFilter === 'today') return taskDue === today;
        if (dueFilter === 'overdue') return taskDue < today;
        return true;
    });

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <h2 className="text-2xl font-bold mb-2">Task List</h2>

            {/* Add New Task Form */}
            <form
                onSubmit={addTask}
                className="bg-white p-4 rounded shadow space-y-4"
            >
                <div className="flex flex-col gap-2">
                    <input
                        type="text"
                        placeholder="Task Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="border p-2 rounded"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Task Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="border p-2 rounded"
                        required
                    />
                    <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="border p-2 rounded"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Add Task
                </button>
            </form>

            {/* Task Cards */}
            <div className="space-y-4">
                {filteredTasks.map((task) => (
                    <div
                        key={task.id}
                        onClick={() => openTask(task)}
                        className="bg-white p-4 rounded shadow cursor-pointer hover:bg-gray-50 transition"
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-semibold">{task.title}</h3>
                                <p className="text-sm text-gray-600">{task.description}</p>
                                <p className="text-xs text-gray-400">
                                    Due: {new Date(task.due_date || task.dueDate).toLocaleDateString()}
                                </p> 
                                {task.assigned_user && (
                                    <p className="text-xs text-gray-500 italic">
                                        Assigned to: {task.assigned_user}
                                    </p>
                                )}


                            </div>
                            <span
                                className={`px-2 py-1 text-xs font-medium rounded-full ${task.status === 'completed'
                                    ? 'bg-green-100 text-green-700'
                                    : task.status === 'in-progress'
                                        ? 'bg-yellow-100 text-yellow-700'
                                        : 'bg-gray-200 text-gray-800'
                                    }`}
                            >
                                {task.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {selectedTask && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow max-w-md w-full space-y-4">
                        <h3 className="text-xl font-bold">{selectedTask.title}</h3>
                        <p>{selectedTask.description}</p>

                        <div className="space-y-2">
                            <label className="block font-medium">Assign to:</label>
                            <select
                                value={assignedUser}
                                onChange={(e) => setAssignedUser(e.target.value)}
                                className="w-full border p-2 rounded"
                            >
                                <option value="">-- Select a user --</option>
                                {userList.map((user) => (
                                    <option key={user.name} value={user.name}>
                                        {user.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="block font-medium">Status:</label>
                            <select
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                                className="w-full border p-2 rounded"
                            >
                                <option value="pending">Pending</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>

                        <div className="flex flex-wrap gap-2 justify-end pt-4">
                            <button
                                onClick={updateTask}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Save Changes
                            </button>
                            <button
                                onClick={() => completeTask(selectedTask.id)}
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                            >
                                ✅ Complete
                            </button>
                            <button
                                onClick={() => deleteTask(selectedTask.id)}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            >
                                ❌ Delete
                            </button>
                            <button
                                onClick={closeTask}
                                className="text-gray-600 hover:underline"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Tasks;

