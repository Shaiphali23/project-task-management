import React, { useState, useEffect } from "react";
import { createProject, updateProject } from "../api";

export default function ProjectForm({
  onCreated,
  editingProject,
  onCancelEdit,
  compact = false,
}) {
  const [form, setForm] = useState({ name: "", description: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingProject) {
      setForm({
        name: editingProject.name,
        description: editingProject.description || "",
      });
    } else {
      setForm({ name: "", description: "" });
    }
    setErrors({});
  }, [editingProject]);

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Project name is required";
    } else if (form.name.trim().length < 2) {
      newErrors.name = "Project name must be at least 2 characters";
    } else if (form.name.trim().length > 50) {
      newErrors.name = "Project name must be less than 50 characters";
    }

    if (form.description.length > 200) {
      newErrors.description = "Description must be less than 200 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (editingProject) {
        await updateProject(editingProject._id, {
          name: form.name.trim(),
          description: form.description.trim(),
        });
        onCancelEdit?.();
      } else {
        await createProject({
          name: form.name.trim(),
          description: form.description.trim(),
        });
      }

      setForm({ name: "", description: "" });
      setErrors({});
      onCreated();
    } catch (err) {
      console.error("Failed to save project:", err);
      setErrors({ submit: "Failed to save project. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setForm({ name: "", description: "" });
    setErrors({});
    onCancelEdit?.();
  };

  const characterCount = form.description.length;
  const maxDescriptionLength = 200;

  // Compact version for modal/inline use
  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="projectName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Project Name *
          </label>
          <input
            id="projectName"
            type="text"
            placeholder="Enter project name..."
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={`w-full border rounded-lg px-3 py-2 transition-colors focus:outline-none focus:ring-2 ${
              errors.name
                ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            }`}
            disabled={isLoading}
          />
          {errors.name && (
            <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="projectDescription"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description
          </label>
          <textarea
            id="projectDescription"
            placeholder="Describe your project (optional)..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows="3"
            className={`w-full border rounded-lg px-3 py-2 transition-colors focus:outline-none focus:ring-2 resize-none ${
              errors.description
                ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            }`}
            disabled={isLoading}
          />
          <div className="flex justify-between mt-1">
            {errors.description ? (
              <p className="text-red-600 text-xs flex items-center gap-1">
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {errors.description}
              </p>
            ) : (
              <div></div>
            )}
            <span
              className={`text-xs ${
                characterCount > maxDescriptionLength * 0.8
                  ? "text-orange-500"
                  : "text-gray-400"
              }`}
            >
              {characterCount}/{maxDescriptionLength}
            </span>
          </div>
        </div>

        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-700 text-sm flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {errors.submit}
            </p>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {editingProject ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={editingProject ? "M5 13l4 4L19 7" : "M12 4v16m8-8H4"}
                  />
                </svg>
                {editingProject ? "Update Project" : "Create Project"}
              </>
            )}
          </button>

          {(editingProject || compact) && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    );
  }

  // Full version for standalone use
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-6"
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {editingProject ? "Edit Project" : "Create New Project"}
        </h3>
        <p className="text-gray-600 text-sm mt-1">
          {editingProject
            ? "Update your project details"
            : "Start organizing your tasks with a new project"}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="projectName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Project Name *
          </label>
          <input
            id="projectName"
            type="text"
            placeholder="Enter project name..."
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={`w-full border rounded-xl px-4 py-3 transition-colors focus:outline-none focus:ring-2 focus:shadow-sm ${
              errors.name
                ? "border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50"
                : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            }`}
            disabled={isLoading}
          />
          {errors.name && (
            <p className="text-red-600 text-sm mt-2 flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="projectDescription"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Description
            <span className="text-gray-400 text-xs font-normal ml-1">
              (optional)
            </span>
          </label>
          <textarea
            id="projectDescription"
            placeholder="Describe your project goals, objectives, or any important details..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows="4"
            className={`w-full border rounded-xl px-4 py-3 transition-colors focus:outline-none focus:ring-2 focus:shadow-sm resize-none ${
              errors.description
                ? "border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50"
                : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            }`}
            disabled={isLoading}
          />
          <div className="flex justify-between mt-2">
            {errors.description ? (
              <p className="text-red-600 text-sm flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {errors.description}
              </p>
            ) : (
              <p className="text-gray-500 text-sm">
                Brief description of your project
              </p>
            )}
            <span
              className={`text-sm ${
                characterCount > maxDescriptionLength
                  ? "text-red-500 font-semibold"
                  : characterCount > maxDescriptionLength * 0.8
                  ? "text-orange-500"
                  : "text-gray-400"
              }`}
            >
              {characterCount}/{maxDescriptionLength}
            </span>
          </div>
        </div>

        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-700 text-sm flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {errors.submit}
            </p>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {editingProject ? "Updating Project..." : "Creating Project..."}
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={editingProject ? "M5 13l4 4L19 7" : "M12 4v16m8-8H4"}
                  />
                </svg>
                {editingProject ? "Update Project" : "Create Project"}
              </>
            )}
          </button>

          {editingProject && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
