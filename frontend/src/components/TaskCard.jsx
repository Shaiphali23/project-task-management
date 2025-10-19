import React, { useState } from "react";
import { updateTask, deleteTask } from "../api";

export default function TaskCard({ task, onUpdated }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ 
    title: task.title, 
    description: task.description || "" 
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.title.trim()) {
      newErrors.title = "Title is required";
    } else if (form.title.trim().length < 2) {
      newErrors.title = "Title must be at least 2 characters";
    } else if (form.title.trim().length > 100) {
      newErrors.title = "Title must be less than 100 characters";
    }

    if (form.description.length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Update status
  const handleStatusChange = async (e) => {
    setIsLoading(true);
    try {
      await updateTask(task._id, { status: e.target.value });
      onUpdated();
    } catch (err) {
      console.error("Failed to update task status:", err);
      alert("Failed to update task status");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete task
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this task? This action cannot be undone.")) return;
    
    setIsLoading(true);
    try {
      await deleteTask(task._id);
      onUpdated();
    } catch (err) {
      console.error("Failed to delete task:", err);
      alert("Failed to delete task");
    } finally {
      setIsLoading(false);
    }
  };

  // Save edited task
  const handleSave = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      await updateTask(task._id, { 
        title: form.title.trim(), 
        description: form.description.trim() 
      });
      setIsEditing(false);
      setErrors({});
      onUpdated();
    } catch (err) {
      console.error("Failed to update task:", err);
      alert("Failed to update task");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setForm({ title: task.title, description: task.description || "" });
    setErrors({});
    setIsEditing(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "todo":
        return "bg-gray-100 text-gray-800 border-gray-300";
      case "inprogress":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "done":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "todo":
        return (
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "inprogress":
        return (
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case "done":
        return (
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      default:
        return null;
    }
  };

  const characterCount = form.description.length;
  const maxDescriptionLength = 500;

  return (
    <div className={`p-4 mb-3 bg-white rounded-xl shadow-sm border border-gray-200 transition-all duration-200 hover:shadow-md group ${
      isLoading ? "opacity-60" : ""
    }`}>
      {isEditing ? (
        // Edit Mode
        <div className="space-y-3">
          <div>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={`w-full border rounded-lg px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 ${
                errors.title 
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50" 
                  : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              }`}
              placeholder="Task title..."
              disabled={isLoading}
            />
            {errors.title && (
              <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.title}
              </p>
            )}
          </div>

          <div>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows="3"
              className={`w-full border rounded-lg px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 resize-none ${
                errors.description 
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50" 
                  : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              }`}
              placeholder="Task description..."
              disabled={isLoading}
            />
            <div className="flex justify-between mt-1">
              {errors.description ? (
                <p className="text-red-600 text-xs flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.description}
                </p>
              ) : (
                <div></div>
              )}
              <span className={`text-xs ${
                characterCount > maxDescriptionLength 
                  ? "text-red-500 font-semibold" 
                  : characterCount > maxDescriptionLength * 0.8 
                  ? "text-orange-500" 
                  : "text-gray-400"
              }`}>
                {characterCount}/{maxDescriptionLength}
              </span>
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1 text-sm"
            >
              {isLoading ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save
                </>
              )}
            </button>
            <button
              onClick={handleCancelEdit}
              disabled={isLoading}
              className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        // View Mode
        <div className="space-y-3">
          <div className="flex justify-between items-start gap-3">
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 text-sm leading-tight break-words">
                {task.title}
              </h4>
              {task.description && (
                <p className="text-gray-600 text-sm mt-2 leading-relaxed break-words">
                  {task.description}
                </p>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity md:opacity-100 flex-shrink-0">
              <button
                onClick={() => setIsEditing(true)}
                disabled={isLoading}
                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                title="Edit task"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                title="Delete task"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Status Selector */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <select
              value={task.status}
              onChange={handleStatusChange}
              disabled={isLoading}
              className={`text-xs font-medium px-2 py-1 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 ${getStatusColor(task.status)}`}
            >
              <option value="todo">To Do</option>
              <option value="inprogress">In Progress</option>
              <option value="done">Done</option>
            </select>
            
            <div className="flex items-center gap-1 text-gray-400">
              {getStatusIcon(task.status)}
              <span className="text-xs capitalize">
                {task.status === "inprogress" ? "In Progress" : task.status}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}