import React, { useEffect, useState } from "react";
import { getProjects, getTasksByProject } from "./api";
import ProjectList from "./components/ProjectList";
import KanbanBoard from "./components/KanbanBoard";
import AIPanel from "./components/AiPanel";

const App = () => {
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [activeView, setActiveView] = useState("projects"); // projects, board, ai

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const loadProjects = async () => {
    const res = await getProjects();
    setProjects(res.data);
    if (res.data.length && !currentProject) setCurrentProject(res.data[0]);
  };

  const loadTasks = async (projectId) => {
    const res = await getTasksByProject(projectId);
    setTasks(res.data);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (currentProject) loadTasks(currentProject._id);
  }, [currentProject]);

  // Mobile navigation
  const MobileNav = () => (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center h-16">
        <button
          onClick={() => setActiveView("projects")}
          className={`flex flex-col items-center p-2 rounded-lg transition-all ${
            activeView === "projects" 
              ? "text-blue-600 bg-blue-50" 
              : "text-gray-600 hover:text-blue-600"
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          </svg>
          <span className="text-xs mt-1">Projects</span>
        </button>
        
        <button
          onClick={() => setActiveView("board")}
          className={`flex flex-col items-center p-2 rounded-lg transition-all ${
            activeView === "board" 
              ? "text-blue-600 bg-blue-50" 
              : "text-gray-600 hover:text-blue-600"
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
          </svg>
          <span className="text-xs mt-1">Board</span>
        </button>
        
        <button
          onClick={() => setActiveView("ai")}
          className={`flex flex-col items-center p-2 rounded-lg transition-all ${
            activeView === "ai" 
              ? "text-green-600 bg-green-50" 
              : "text-gray-600 hover:text-green-600"
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <span className="text-xs mt-1">AI Assistant</span>
        </button>
      </div>
    </div>
  );

  // Desktop Layout
  const DesktopLayout = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 gap-6 hidden md:flex">
      {/* Projects Sidebar */}
      <div className="w-80 flex-shrink-0">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 h-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Projects</h2>
          <p className="text-gray-600 text-sm mb-6">Manage your projects and tasks</p>
          <ProjectList
            projects={projects}
            onSelect={setCurrentProject}
            selected={currentProject}
            reloadProjects={loadProjects}
          />
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 min-w-0">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 h-full">
          {currentProject ? (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">{currentProject.name}</h1>
                <p className="text-gray-600 mt-1">{currentProject.description}</p>
              </div>
              <KanbanBoard
                projectId={currentProject._id}
                tasks={tasks}
                loadTasks={() => loadTasks(currentProject._id)}
              />
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No Project Selected</h3>
              <p className="text-gray-500">Select or create a project to get started</p>
            </div>
          )}
        </div>
      </div>

      {/* AI Panel */}
      <div className="w-96 flex-shrink-0">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 h-full">
          <AIPanel tasks={tasks} />
        </div>
      </div>
    </div>
  );

  // Mobile Layout
  const MobileLayout = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pb-16">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-40">
        <h1 className="text-xl font-bold text-gray-800 text-center">
          {activeView === "projects" && "Projects"}
          {activeView === "board" && (currentProject?.name || "Task Board")}
          {activeView === "ai" && "AI Assistant"}
        </h1>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeView === "projects" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <ProjectList
              projects={projects}
              onSelect={(project) => {
                setCurrentProject(project);
                setActiveView("board");
              }}
              selected={currentProject}
              reloadProjects={loadProjects}
            />
          </div>
        )}

        {activeView === "board" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            {currentProject ? (
              <div>
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">{currentProject.name}</h2>
                  <p className="text-gray-600 text-sm">{currentProject.description}</p>
                </div>
                <KanbanBoard
                  projectId={currentProject._id}
                  tasks={tasks}
                  loadTasks={() => loadTasks(currentProject._id)}
                />
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-gray-700 mb-1">No Project Selected</h3>
                <p className="text-gray-500 text-sm">Go to Projects tab to select one</p>
                <button
                  onClick={() => setActiveView("projects")}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Browse Projects
                </button>
              </div>
            )}
          </div>
        )}

        {activeView === "ai" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <AIPanel tasks={tasks} />
          </div>
        )}
      </div>

      <MobileNav />
    </div>
  );

  return isMobile ? <MobileLayout /> : <DesktopLayout />;
};

export default App;