import React from "react";
import { ArrowRight, Play, Star } from "lucide-react";

const HeroSection = ({ onGetStarted }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-yellow-50 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium mb-6">
              <span className="text-orange-500 mr-2">✦</span>
              AI Powered Interview Preparation
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Ace Your Next Interview with{" "}
              <span className="text-orange-500">AI-Powered</span> Learning
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Get personalized interview questions, detailed explanations, and
              AI-powered learning guides tailored to your target role and
              experience level.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                onClick={onGetStarted}
                className="px-8 py-4 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>

              <button className="px-8 py-4 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center border border-gray-200">
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </button>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex -space-x-2">
                <img
                  className="w-10 h-10 rounded-full border-2 border-white"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face&auto=format "
                  alt="User"
                />
                <img
                  className="w-10 h-10 rounded-full border-2 border-white"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=464 "
                  alt="User"
                />
                <img
                  className="w-10 h-10 rounded-full border-2 border-white"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face&auto=format "
                  alt="User"
                />
              </div>
              <div>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">10,000+</span> professionals
                  prepared
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white rounded-2xl shadow-xl p-6 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <div className="text-sm text-gray-500">
                  interview-prep-ai.com
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-blue-600 font-semibold text-sm">
                        Q
                      </span>
                    </div>
                    <p className="font-medium text-gray-900">
                      Explain React Hooks and their advantages
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 ml-11">
                    React Hooks are functions that let you use state and other
                    React features...
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-blue-600 font-semibold text-sm">
                        Q
                      </span>
                    </div>
                    <p className="font-medium text-gray-900">
                      How do you optimize performance in React?
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 ml-11">
                    Performance optimization in React can be achieved through
                    various techniques...
                  </p>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-orange-600 font-semibold text-sm">
                        AI
                      </span>
                    </div>
                    <p className="font-medium text-gray-900">
                      Detailed explanation available
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 ml-11">
                    Click "Learn More" to get an in-depth explanation with code
                    examples...
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-orange-200 rounded-full opacity-20 -z-10"></div>
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-yellow-200 rounded-full opacity-20 -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
