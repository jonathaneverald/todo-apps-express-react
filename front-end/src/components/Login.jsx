import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:3000/api/users/login", { username, password });
            if (response.status === 200) {
                // Store the token in local storage
                localStorage.setItem("authToken", response.data.data.token);
                // Navigate to the tasks page
                navigate("/tasks");
            } else {
                setErrorMessage("Login failed. Please check your username and password.");
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setErrorMessage("Invalid username or password.");
            } else {
                setErrorMessage("An error occurred. Please try again.");
            }
        }
    };

    const handleRegisterClick = () => {
        navigate("/register");
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6">Login</h2>
                {errorMessage && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{errorMessage}</div>}
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label htmlFor="username" className="block font-medium mb-2">
                            Username
                        </label>
                        <input
                            type="username"
                            id="username"
                            className="border rounded-md px-4 py-2 w-full"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
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
                    <button type="button" className="text-blue-500 hover:text-blue-600 font-medium mb-4" onClick={handleRegisterClick}>
                        Doesn't have account? Register here
                    </button>
                    <div className="flex justify-between items-center mb-6">
                        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md">
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
