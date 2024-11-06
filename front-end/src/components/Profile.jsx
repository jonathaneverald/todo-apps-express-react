import React, { useState, useEffect } from "react";
import axios from "axios";

const ProfileModal = ({ onClose }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");

    // Function to fetch the current user profile
    const fetchUserProfile = async () => {
        const authToken = localStorage.getItem("authToken");
        try {
            const response = await axios.get("http://localhost:3000/api/users/current", {
                headers: {
                    "X-API-TOKEN": authToken,
                },
            });

            const { username, name } = response.data.data;
            setUsername(username);
            setName(name);
        } catch (error) {
            console.error("Error fetching user profile:", error);
            alert("Failed to load profile data");
        }
    };

    // Function to update the user profile
    const updateUserProfile = async () => {
        const authToken = localStorage.getItem("authToken");
        try {
            await axios.patch(
                "http://localhost:3000/api/users/current",
                { name, password },
                {
                    headers: {
                        "X-API-TOKEN": authToken,
                    },
                }
            );
            alert("Profile updated successfully");
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile");
        }
    };

    // Handle Save button click
    const handleSaveClick = () => {
        updateUserProfile();
        setIsEditing(false);
    };

    // Fetch user profile on component mount
    useEffect(() => {
        fetchUserProfile();
    }, []);

    return (
        <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen">
                <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-6">Profile</h2>
                    <div className="mb-4">
                        <label htmlFor="username" className="block font-medium mb-2">
                            Username
                        </label>
                        <input type="text" id="username" className="border rounded-md px-4 py-2 w-full" value={username} disabled />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="name" className="block font-medium mb-2">
                            Name
                        </label>
                        <input type="text" id="name" className="border rounded-md px-4 py-2 w-full" value={name} onChange={(e) => setName(e.target.value)} disabled={!isEditing} />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block font-medium mb-2">
                            Password
                        </label>
                        <input type="password" id="password" className="border rounded-md px-4 py-2 w-full" value={password} onChange={(e) => setPassword(e.target.value)} disabled={!isEditing} />
                    </div>
                    <div className="flex justify-end">
                        {isEditing ? (
                            <>
                                <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none mr-2" onClick={handleSaveClick}>
                                    Save
                                </button>
                                <button className="text-gray-500 hover:text-gray-600 font-medium focus:outline-none" onClick={() => setIsEditing(false)}>
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none" onClick={() => setIsEditing(true)}>
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

export default ProfileModal;
