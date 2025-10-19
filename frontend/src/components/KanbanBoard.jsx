// src/components/KanbanBoard.jsx
import React, { useState } from "react";
import TaskForm from "./TaskForm";
import TaskCard from "./TaskCard";
import { updateTask } from "../api";

export default function KanbanBoard({ projectId, tasks, loadTasks }) {
  const statuses = [
    { id: "todo", title: "To Do", color: "bg-gray-100", accent: "border-gray-300" },
    { id: "inprogress", title: "In Progress", color: "bg-blue-50", accent: "border-blue-300" },
    { id: "done", title: "Done", color: "bg-green-50", accent: "border-green-300" }
  ];

  const [draggedTask, setDraggedTask] = useState(null);
  const [dragOverStatus, setDragOverStatus] = useState(null);

  // Drag event handlers
  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
    // Add slight delay for better UX
    setTimeout(() => {
      e.target.classList.add("opacity-30");
    }, 0);
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove("opacity-30");
    setDraggedTask(null);
    setDragOverStatus(null);
  };

  const handleDragOver = (e, status) => {
    e.preventDefault();
    setDragOverStatus(status);
  };

  const handleDragLeave = (e) => {
    // Only remove dragOverStatus if not dragging over a child
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverStatus(null);
    }
  };

  const handleDrop = async (e, targetStatus) => {
    e.preventDefault();
    e.target.classList.remove("opacity-30");
    
    if (!draggedTask || draggedTask.status === targetStatus) {
      setDragOverStatus(null);
      return;
    }

    try {
      await updateTask(draggedTask._id, { status: targetStatus });
      loadTasks(); // Refresh tasks after status update
    } catch (err) {
      console.error("Failed to update task status:", err);
      alert("Failed to move task");
    }

    setDraggedTask(null);
    setDragOverStatus(null);
  };

  const getStatusCount = (status) => {
    return tasks.filter(task => task.status === status).length;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "todo":
        return (
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "inprogress":
        return (
          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case "done":
        return (
          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Task Board</h1>
        <p className="text-gray-600">Drag and drop tasks between columns to update their status</p>
      </div>

      {/* Task Form - Compact version */}
      <div className="mb-6">
        <TaskForm projectId={projectId} onCreated={loadTasks} compact={true} />
      </div>

      {/* Kanban Columns */}
      <div className="flex-1 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
          {statuses.map((status) => {
            const statusTasks = tasks.filter(task => task.status === status.id);
            const taskCount = statusTasks.length;
            const isDragOver = dragOverStatus === status.id;

            return (
              <div
                key={status.id}
                className={`flex flex-col rounded-2xl border-2 transition-all duration-200 ${
                  isDragOver 
                    ? `${status.accent} border-dashed bg-opacity-80 scale-[1.02]` 
                    : `${status.accent} border-dashed border-transparent`
                } ${status.color}`}
                onDragOver={(e) => handleDragOver(e, status.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, status.id)}
              >
                {/* Column Header */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(status.id)}
                      <h3 className="font-semibold text-gray-800 text-lg">{status.title}</h3>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      status.id === "todo" ? "bg-gray-200 text-gray-700" :
                      status.id === "inprogress" ? "bg-blue-200 text-blue-700" :
                      "bg-green-200 text-green-700"
                    }`}>
                      {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
                    </span>
                  </div>
                </div>

                {/* Tasks Container */}
                <div className="flex-1 p-4 overflow-y-auto max-h-[calc(100vh-300px)]">
                  {taskCount === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 mx-auto mb-3 bg-white rounded-full flex items-center justify-center border border-dashed border-gray-300">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <p className="text-gray-500 text-sm">No tasks here</p>
                      <p className="text-gray-400 text-xs mt-1">Drag tasks here or create new ones</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {statusTasks.map((task) => (
                        <div
                          key={task._id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, task)}
                          onDragEnd={handleDragEnd}
                          className="cursor-grab active:cursor-grabbing transition-transform duration-200 hover:scale-[1.02]"
                        >
                          <TaskCard task={task} onUpdated={loadTasks} />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Drop Zone Indicator */}
                  {isDragOver && taskCount === 0 && (
                    <div className="border-2 border-dashed border-gray-400 rounded-xl p-6 text-center bg-white bg-opacity-50">
                      <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                      <p className="text-gray-600 text-sm">Drop here to move</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Instructions */}
      <div className="md:hidden mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-blue-700 text-sm">Tap and hold to drag tasks between columns</p>
        </div>
      </div>
    </div>
  );
}