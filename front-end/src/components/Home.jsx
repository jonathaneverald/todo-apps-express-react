import React, { useState, useEffect, useCallback } from "react";
import { User, LogOut } from "lucide-react";
import Task from "./Task";
import ProfileModal from "./Profile";
import TaskDetailModal from "./TaskDetail";
import AddTaskModal from "./AddTask";
import axios from "axios";

const HomePage = () => {
    const [tasks, setTasks] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const debounceDelay = 1000;

    const fetchTasks = useCallback(async (page = 1, query = "") => {
        const authToken = localStorage.getItem("authToken");
        try {
            const response = await axios.get("http://localhost:3000/api/tasks", {
                headers: {
                    "X-API-TOKEN": authToken,
                },
                params: { page, size: 10, title: query || undefined },
            });
            setTasks(response.data.data);
            setCurrentPage(response.data.paging.current_page);
            setTotalPages(response.data.paging.total_page);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    }, []);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset to the first page for new search results
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            fetchTasks(currentPage, searchQuery);
        }, debounceDelay);

        return () => clearTimeout(handler);
    }, [currentPage, searchQuery, fetchTasks]);

    const handleAddTask = () => {
        fetchTasks(); // Re-fetch tasks from the backend
        setShowAddModal(false);
    };

    const handleDeleteTask = async (taskId) => {
        try {
            const authToken = localStorage.getItem("authToken");
            await axios.delete(`http://localhost:3000/api/tasks/${taskId}`, {
                headers: { "X-API-TOKEN": authToken },
            });
            fetchTasks(currentPage);
        } catch (error) {
            console.error("Error deleting tasks:", error);
            alert("Failed to delete tasks. Please try again.");
        }
    };

    const handleCompleteTask = async (task) => {
        const newStatus = task.status === "Completed" ? "Incomplete" : "Completed";
        try {
            const authToken = localStorage.getItem("authToken");
            await axios.put(
                `http://localhost:3000/api/tasks-status/${task.id}`,
                { status: newStatus },
                {
                    headers: {
                        "X-API-TOKEN": authToken,
                    },
                }
            );
            fetchTasks(currentPage); // Reload the tasks to reflect the updated status
        } catch (error) {
            console.error("Error updating task status:", error);
            alert("Failed to update task status. Please try again.");
        }
    };

    const handleTaskDetails = (task) => {
        setSelectedTask(task); // Set the selected task for the modal
    };

    const handleSaveTask = () => {
        fetchTasks(currentPage);
    };

    const handleCloseTaskDetails = () => {
        setSelectedTask(null); // Close the modal by clearing the selected task
    };

    const handleLogout = async () => {
        const authToken = localStorage.getItem("authToken");
        try {
            await axios.delete("http://localhost:3000/api/users/current", {
                headers: {
                    "X-API-TOKEN": authToken,
                },
            });
            // On success, remove the authToken and redirect
            localStorage.removeItem("authToken");
            window.location.href = "/"; // Redirect to the login or home page
        } catch (error) {
            console.error("Error logging out:", error);
            alert("Failed to log out. Please try again.");
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            {/* Header */}
            <header className="bg-white shadow py-4">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Tasks</h1>
                    <input type="text" placeholder="Search tasks..." value={searchQuery} onChange={handleSearchChange} className="border rounded-md px-4 py-2 w-1/3" />
                    <div className="flex space-x-4">
                        <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none" onClick={() => setShowAddModal(true)}>
                            Add Task
                        </button>
                        <button className="text-blue-500 hover:text-blue-600 font-medium focus:outline-none" onClick={() => setShowProfileModal(true)}>
                            <User size={20} />
                        </button>
                        <button className="text-red-500 hover:text-red-600 font-medium focus:outline-none" onClick={handleLogout}>
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Task List */}
            <div className="container mx-auto py-8">
                {tasks.map((task) => (
                    <Task
                        key={task.id}
                        id={task.id}
                        title={task.title}
                        description={task.description}
                        status={task.status}
                        onComplete={() => handleCompleteTask(task)}
                        onDelete={() => handleDeleteTask(task.id)}
                        onDetails={() => handleTaskDetails(task)}
                    />
                ))}
            </div>

            {/* Pagination Controls */}
            <div className="container mx-auto py-4 flex justify-center">
                <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-l-md focus:outline-none" onClick={handlePreviousPage} disabled={currentPage === 1}>
                    Previous
                </button>
                <span className="px-4 py-2 text-gray-700">{`Page ${currentPage} of ${totalPages}`}</span>
                <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-r-md focus:outline-none" onClick={handleNextPage} disabled={currentPage === totalPages}>
                    Next
                </button>
            </div>

            {/* Add Task Modal */}
            {showAddModal && (
                <AddTaskModal
                    onClose={() => setShowAddModal(false)} // Close AddTaskModal
                    onSave={handleAddTask} // Save the new task to state
                />
            )}

            {/* Profile Modal */}
            {showProfileModal && (
                <ProfileModal
                    onClose={() => setShowProfileModal(false)} // Close ProfileModal
                />
            )}

            {/* Task Detail Modal */}
            {selectedTask && (
                <TaskDetailModal
                    task={selectedTask}
                    onClose={handleCloseTaskDetails} // Close TaskDetailModal
                    onSave={handleSaveTask} // Save changes to task
                />
            )}
        </div>
    );
};

export default HomePage;
