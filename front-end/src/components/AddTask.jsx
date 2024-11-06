import React, { useState } from "react";
import axios from "axios";

const AddTaskModal = ({ onClose, onSave }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const handleSaveClick = async () => {
        if (title.trim() && description.trim()) {
            const authToken = localStorage.getItem("authToken");

            try {
                const response = await axios.post(
                    "http://localhost:3000/api/tasks",
                    { title, description },
                    {
                        headers: {
                            "X-API-TOKEN": authToken,
                        },
                    }
                );

                if (response.status === 201) {
                    // Call onSave with the new task data to update the list in Home
                    onSave(response.data);
                    setTitle("");
                    setDescription("");
                    onClose();
                }
            } catch (error) {
                console.error("Error adding new task:", error);
                alert("Failed to add task. Please try again.");
            }
        } else {
            alert("Both fields are required.");
        }
    };

    return (
        <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen">
                <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-4">Add New Task</h2>
                    <div className="mb-4">
                        <label className="block font-medium mb-2">Title</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="border rounded-md px-4 py-2 w-full" placeholder="Enter task title" />
                    </div>
                    <div className="mb-6">
                        <label className="block font-medium mb-2">Description</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="border rounded-md px-4 py-2 w-full" placeholder="Enter task description" />
                    </div>
                    <div className="flex justify-end">
                        <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none mr-2" onClick={handleSaveClick}>
                            Save
                        </button>
                        <button className="text-gray-500 hover:text-gray-600 font-medium focus:outline-none" onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddTaskModal;
