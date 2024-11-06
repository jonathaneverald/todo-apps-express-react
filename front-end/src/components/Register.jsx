import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterPage = () => {
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "http://localhost:3000/api/users",
                { username, name, password },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.status === 200) {
                setSuccessMessage("Registration successful! Redirecting to login...");
                setTimeout(() => navigate("/"), 2000);
            } else {
                setErrorMessage("Registration failed. Please try again.");
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setErrorMessage(error.response.data.message || "Username already exists.");
            } else {
                setErrorMessage("An error occurred. Please try again.");
            }
        }
    };

    const handleLoginClick = () => {
        navigate("/");
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6">Register</h2>
                {errorMessage && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{errorMessage}</div>}
                {successMessage && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">{successMessage}</div>}
                <form onSubmit={handleRegister}>
                    <div className="mb-4">
                        <label htmlFor="username" className="block font-medium mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            className="border rounded-md px-4 py-2 w-full"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="name" className="block font-medium mb-2">
                            Name
                        </label>
                        <input type="text" id="name" className="border rounded-md px-4 py-2 w-full" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block font-medium mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="border rounded-md px-4 py-2 w-full"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="button" className="text-blue-500 hover:text-blue-600 font-medium mb-4" onClick={handleLoginClick}>
                        Already have an account? Login
                    </button>
                    <div className="flex justify-between items-center mb-6">
                        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md">
                            Register
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
