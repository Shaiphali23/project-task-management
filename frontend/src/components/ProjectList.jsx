import React, { useState } from "react";
import ProjectForm from "./ProjectForm";
import { deleteProject } from "../api";

export default function ProjectList({ projects, onSelect, selected, reloadProjects }) {
  const [editingProject, setEditingProject] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this project? All tasks will be lost.")) {
      await deleteProject(id);
      reloadProjects();
    }
  };

  const handleEdit = (project, e) => {
    e.stopPropagation();
    setEditingProject(project);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingProject(null);
    reloadProjects();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProject(null);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Your Projects</h2>
          <p className="text-gray-600 text-sm mt-1">
            {projects.length} project{projects.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Create Project Button */}
      <button
        onClick={() => {
          setEditingProject(null);
          setShowForm(true);
        }}
        className="w-full mb-6 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Create New Project
      </button>

      {/* Project Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 md:relative md:bg-transparent md:flex md:inset-auto md:p-0 md:mb-6">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md md:max-w-full md:w-auto md:static md:shadow-none md:border md:border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {editingProject ? "Edit Project" : "Create Project"}
              </h3>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600 md:hidden"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <ProjectForm
              onCreated={handleFormSuccess}
              editingProject={editingProject}
              onCancelEdit={handleCancel}
              compact={true}
            />
          </div>
        </div>
      )}

      {/* Projects List */}
      <div className="flex-1 overflow-y-auto">
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Projects Yet</h3>
            <p className="text-gray-500 mb-4">Create your first project to get started</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Create Project
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {projects.map((project) => (
              <div
                key={project._id}
                onClick={() => onSelect(project)}
                className={`p-4 rounded-xl cursor-pointer border-2 transition-all duration-200 group relative overflow-hidden
                  ${selected?._id === project._id
                    ? "border-blue-500 bg-blue-50 shadow-md"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"}`}
              >
                {/* Selection Indicator */}
                {selected?._id === project._id && (
                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                )}

                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-semibold text-lg truncate ${
                      selected?._id === project._id ? "text-blue-900" : "text-gray-900"
                    }`}>
                      {project.name}
                    </h3>
                    <p className={`text-sm mt-1 line-clamp-2 ${
                      selected?._id === project._id ? "text-blue-700" : "text-gray-600"
                    }`}>
                      {project.description || "No description"}
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-xs">
                      <span className={`px-2 py-1 rounded-full ${
                        selected?._id === project._id 
                          ? "bg-blue-200 text-blue-800" 
                          : "bg-gray-100 text-gray-600"
                      }`}>
                        Created: {new Date(project.createdAt || project.createdDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity md:opacity-100">
                    <button
                      onClick={(e) => handleEdit(project, e)}
                      className={`p-2 rounded-lg transition-colors ${
                        selected?._id === project._id
                          ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                      title="Edit project"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => handleDelete(project._id, e)}
                      className={`p-2 rounded-lg transition-colors ${
                        selected?._id === project._id
                          ? "bg-red-100 text-red-600 hover:bg-red-200"
                          : "bg-gray-100 text-red-500 hover:bg-red-50"
                      }`}
                      title="Delete project"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mobile Bottom Spacing */}
      <div className="h-4 md:h-0"></div>
    </div>
  );
}