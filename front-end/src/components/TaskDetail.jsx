import React, { useState } from "react";
import axios from "axios";

const TaskDetailModal = ({ task, onClose, onSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editableTask, setEditableTask] = useState(task);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = async () => {
        const authToken = localStorage.getItem("authToken");
        try {
            const response = await axios.put(
                `http://localhost:3000/api/tasks/${editableTask.id}`,
                {
                    title: editableTask.title,
                    description: editableTask.description,
                },
                {
                    headers: {
                        "X-API-TOKEN": authToken,
                    },
                }
            );

            if (response.status === 200) {
                onSave(response.data); // Pass updated data to parent component
                setIsEditing(false);
                onClose();
            }
        } catch (error) {
            console.error("Error updating task:", error);
            alert("Failed to update the task. Please try again.");
        }
    };

    const handleCancelClick = () => {
        setEditableTask(task); // Reset to original values if canceled
        setIsEditing(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditableTask((prevTask) => ({
            ...prevTask,
            [name]: value,
        }));
    };

    return (
        <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen">
                <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-4">Task Details</h2>
                    <div className="mb-4">
                        <h3 className="text-lg font-medium">Title</h3>
                        <input
                            type="text"
                            name="title"
                            value={editableTask.title}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className={`border rounded-md px-4 py-2 w-full ${isEditing ? "border-blue-300" : "border-transparent bg-gray-100"}`}
                        />
                    </div>
                    <div className="mb-4">
                        <h3 className="text-lg font-medium">Description</h3>
                        <textarea
                            name="description"
                            value={editableTask.description}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className={`border rounded-md px-4 py-2 w-full ${isEditing ? "border-blue-300" : "border-transparent bg-gray-100"}`}
                        />
                    </div>
                    <div className="flex justify-end">
                        {isEditing ? (
                            <>
                                <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none mr-2" onClick={handleSaveClick}>
                                    Save
                                </button>
                                <button className="text-gray-500 hover:text-gray-600 font-medium focus:outline-none" onClick={handleCancelClick}>
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none" onClick={handleEditClick}>
                                Edit
                            </button>
                        )}
                        <button className="text-gray-500 hover:text-gray-600 font-medium focus:outline-none ml-2" onClick={onClose}>
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskDetailModal;
