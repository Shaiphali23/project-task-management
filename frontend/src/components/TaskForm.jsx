import React, { useState } from "react";
import { createTask } from "../api";

export default function TaskForm({ projectId, onCreated, compact = false }) {
  const [form, setForm] = useState({ title: "", description: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showForm, setShowForm] = useState(compact);

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.title.trim()) {
      newErrors.title = "Task title is required";
    } else if (form.title.trim().length < 2) {
      newErrors.title = "Task title must be at least 2 characters";
    } else if (form.title.trim().length > 100) {
      newErrors.title = "Task title must be less than 100 characters";
    }

    if (form.description.length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await createTask({ 
        ...form, 
        projectId, 
        status: "todo",
        title: form.title.trim(),
        description: form.description.trim()
      });
      
      setForm({ title: "", description: "" });
      setErrors({});
      onCreated();
      
      // Auto-close form in compact mode after successful creation
      if (compact) {
        setShowForm(false);
      }
    } catch (err) {
      console.error("Failed to create task:", err);
      setErrors({ submit: "Failed to create task. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setForm({ title: "", description: "" });
    setErrors({});
    setShowForm(false);
  };

  const characterCount = form.description.length;
  const maxDescriptionLength = 500;

  // Compact version with toggle button
  if (compact && !showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group"
      >
        <div className="flex items-center justify-center gap-2 text-gray-600 group-hover:text-blue-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="font-medium">Add New Task</span>
        </div>
      </button>
    );
  }

  // Form content (used in both compact and full versions)
  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="taskTitle" className="block text-sm font-medium text-gray-700 mb-2">
          Task Title *
        </label>
        <input
          id="taskTitle"
          type="text"
          placeholder="What needs to be done?"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className={`w-full border rounded-lg px-3 py-2 transition-colors focus:outline-none focus:ring-2 ${
            errors.title 
              ? "border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50" 
              : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          }`}
          disabled={isLoading}
          autoFocus={compact}
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
        <label htmlFor="taskDescription" className="block text-sm font-medium text-gray-700 mb-2">
          Description
          <span className="text-gray-400 text-xs font-normal ml-1">(optional)</span>
        </label>
        <textarea
          id="taskDescription"
          placeholder="Add more details about this task..."
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows="3"
          className={`w-full border rounded-lg px-3 py-2 transition-colors focus:outline-none focus:ring-2 resize-none ${
            errors.description 
              ? "border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50" 
              : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          }`}
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
            <p className="text-gray-500 text-xs">
              Add context, requirements, or notes
            </p>
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

      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-700 text-sm flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.submit}
          </p>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Creating Task...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Task
            </>
          )}
        </button>
        
        {compact && (
          <button
            type="button"
            onClick={handleCancel}
            disabled={isLoading}
            className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );

  // Render based on compact mode
  if (compact) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-semibold text-gray-800">New Task</h3>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {formContent}
      </div>
    );
  }

  // Full version
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Create New Task</h3>
        <p className="text-gray-600 text-sm mt-1">Add a new task to your project</p>
      </div>
      {formContent}
    </div>
  );
}