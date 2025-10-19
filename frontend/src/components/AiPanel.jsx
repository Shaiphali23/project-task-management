// src/components/AiPanel.jsx
import React, { useState } from "react";
import { summarizeProject, askQuestion } from "../api";

export default function AIPanel({ tasks }) {
  const [summary, setSummary] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isAsking, setIsAsking] = useState(false);
  const [activeTab, setActiveTab] = useState("summary"); // "summary" or "qa"

  const handleSummarize = async () => {
    if (!tasks.length) {
      alert("No tasks available to summarize. Create some tasks first!");
      return;
    }

    setIsSummarizing(true);
    setSummary("");
    
    try {
      const res = await summarizeProject(tasks);
      setSummary(res.data.text || "No summary generated. Please try again.");
      setActiveTab("summary");
    } catch (err) {
      console.error("Failed to summarize project:", err);
      setSummary("❌ Failed to generate summary. Please check your connection and try again.");
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleAsk = async (e) => {
    e.preventDefault();
    
    if (!question.trim()) {
      alert("Please enter a question first!");
      return;
    }

    if (!tasks.length) {
      alert("No tasks available to ask about. Create some tasks first!");
      return;
    }

    setIsAsking(true);
    setAnswer("");
    
    try {
      const res = await askQuestion(tasks[0], question);
      setAnswer(res.data.text || "No answer generated. Please try rephrasing your question.");
      setActiveTab("qa");
    } catch (err) {
      console.error("Failed to get answer:", err);
      setAnswer("❌ Failed to get answer. Please check your connection and try again.");
    } finally {
      setIsAsking(false);
    }
  };

  const clearSummary = () => {
    setSummary("");
  };

  const clearQA = () => {
    setQuestion("");
    setAnswer("");
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const todo = tasks.filter(t => t.status === "todo").length;
    const inProgress = tasks.filter(t => t.status === "inprogress").length;
    const done = tasks.filter(t => t.status === "done").length;

    return { total, todo, inProgress, done };
  };

  const stats = getTaskStats();

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">AI Assistant</h2>
            <p className="text-gray-600 text-sm">Powered by Gemini AI</p>
          </div>
        </div>

        {/* Task Stats */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="text-lg font-semibold text-gray-900">{stats.total}</div>
            <div className="text-xs text-gray-600">Total Tasks</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="text-lg font-semibold text-gray-900">{stats.done}</div>
            <div className="text-xs text-gray-600">Completed</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("summary")}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
            activeTab === "summary"
              ? "text-purple-600 border-b-2 border-purple-600 bg-purple-50"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Summary
          </div>
        </button>
        <button
          onClick={() => setActiveTab("qa")}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
            activeTab === "qa"
              ? "text-purple-600 border-b-2 border-purple-600 bg-purple-50"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Q&A
          </div>
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {/* Summary Tab */}
        {activeTab === "summary" && (
          <div className="h-full flex flex-col p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Project Summary</h3>
              {summary && (
                <button
                  onClick={clearSummary}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  title="Clear summary"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {!summary ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h4 className="text-gray-700 font-medium mb-2">Generate Project Summary</h4>
                <p className="text-gray-500 text-sm mb-6">
                  Get an AI-powered overview of all tasks in your project
                </p>
                <button
                  onClick={handleSummarize}
                  disabled={isSummarizing || tasks.length === 0}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSummarizing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Generate Summary
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto">
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-200">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-purple-900 mb-2">AI Summary</h4>
                      <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">
                        {summary}
                      </div>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={handleSummarize}
                  disabled={isSummarizing}
                  className="w-full mt-4 bg-white border border-purple-600 text-purple-600 py-2.5 px-4 rounded-lg font-medium hover:bg-purple-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Regenerate Summary
                </button>
              </div>
            )}
          </div>
        )}

        {/* Q&A Tab */}
        {activeTab === "qa" && (
          <div className="h-full flex flex-col p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Ask Questions</h3>
              {(question || answer) && (
                <button
                  onClick={clearQA}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  title="Clear conversation"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            <div className="flex-1 flex flex-col">
              {!answer ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="text-gray-700 font-medium mb-2">Ask About Your Project</h4>
                  <p className="text-gray-500 text-sm mb-6">
                    Get AI-powered insights about your tasks and progress
                  </p>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto mb-4">
                  {/* Question */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <div className="flex-1 bg-gray-100 rounded-xl p-3">
                      <p className="text-gray-700 text-sm">{question}</p>
                    </div>
                  </div>

                  {/* Answer */}
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div className="flex-1 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-3 border border-indigo-200">
                      <h4 className="font-semibold text-indigo-900 mb-1 text-sm">AI Assistant</h4>
                      <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">
                        {answer}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Question Input */}
              <form onSubmit={handleAsk} className="space-y-3">
                <div>
                  <textarea
                    placeholder="Ask about your project tasks, progress, or anything else..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    rows="3"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                    disabled={isAsking}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isAsking || !question.trim() || tasks.length === 0}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isAsking ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Thinking...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      Ask Question
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}