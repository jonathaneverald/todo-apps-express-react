import React from "react";
import { XCircle, Edit3, CheckSquare } from "lucide-react";

const Task = ({ title, description, status, onComplete, onDelete, onDetails }) => (
    <div className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center mb-4">
        <div className="flex items-center">
            <button className="text-green-500 hover:text-green-600 focus:outline-none mr-4" onClick={onComplete}>
                <CheckSquare size={20} />
            </button>
            <div>
                <h3 className={`text-lg font-medium ${status === "Completed" ? "line-through text-gray-400" : ""}`}>{title}</h3>
                <p className={`text-gray-600 ${status === "Completed" ? "line-through text-gray-400" : ""}`}>{description}</p>
            </div>
        </div>
        <div className="flex space-x-4">
            <button className="text-red-500 hover:text-red-600 focus:outline-none" onClick={onDelete}>
                <XCircle size={20} />
            </button>
            <button className="text-blue-500 hover:text-blue-600 focus:outline-none" onClick={onDetails}>
                <Edit3 size={20} />
            </button>
        </div>
    </div>
);

export default Task;
