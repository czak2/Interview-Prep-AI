import React, { useState } from "react";
import { ChevronDown, User, RotateCcw, Plus, Square } from "lucide-react";

const InterviewInterface = () => {
  const [activeQuestion, setActiveQuestion] = useState(null);

  const questions = [
    "What is JSX? Explain its role in React",
    "What is React.js and what are its main advantages?",
    "Explain the difference between 'props' and 'state' in React.",
    "How does the virtual DOM work in React and why is it important?",
    "Describe the lifecycle methods of a React component (focus on the commonly used ones).",
    "Explain the concept of event handling in React.",
    "How do you handle DOM manipulation in React? Why is it generally discouraged?",
  ];

  return (
    <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          </div>
          <div className="ml-4 text-sm text-gray-500">
            https://interviewprepai.com/interview-prep
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <RotateCcw className="w-4 h-4 text-gray-400" />
          <Plus className="w-4 h-4 text-gray-400" />
          <Square className="w-4 h-4 text-gray-400" />
        </div>
      </div>

      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900">Interview Prep AI</h3>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">
              Mike William
            </div>
            <div className="text-xs text-orange-500">Logout</div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h4 className="text-xl font-bold text-gray-900 mb-2">
          Frontend Developer
        </h4>
        <p className="text-gray-600 text-sm mb-4">
          React.js, DOM manipulation, CSS Flexbox
        </p>
        <div className="flex space-x-2">
          <span className="bg-gray-900 text-white px-3 py-1 rounded-full text-xs">
            Experience: 2 Years
          </span>
          <span className="bg-gray-900 text-white px-3 py-1 rounded-full text-xs">
            JS Q&A
          </span>
          <span className="bg-gray-900 text-white px-3 py-1 rounded-full text-xs">
            Last updated: 20th Apr 2023
          </span>
        </div>
      </div>

      <div>
        <h5 className="text-lg font-semibold text-gray-900 mb-4">
          Interview Q & A
        </h5>
        <div className="space-y-3">
          {questions.map((question, index) => (
            <div key={index} className="border border-gray-200 rounded-lg">
              <button
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
                onClick={() =>
                  setActiveQuestion(activeQuestion === index ? null : index)
                }
              >
                <span className="text-gray-700 font-medium">{question}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-purple-500 text-sm">🎯</span>
                  <span className="text-blue-500 text-sm">Learn More</span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transform ${
                      activeQuestion === index ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>
              {activeQuestion === index && (
                <div className="px-4 pb-4 text-sm text-gray-600 border-t border-gray-200 mt-2 pt-2">
                  <p>
                    This question helps assess your understanding of React
                    fundamentals...
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InterviewInterface;
