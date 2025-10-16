import React from "react";

const FeaturesSection = () => {
  return (
    <div className="mt-16">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
        Features That Make You Shine
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 cursor-pointer">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Tailored Just for You
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Get interview questions and model answers based on your role,
            experience, and specific focus areas — no generic practice here.
          </p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Learn at Your Own Pace
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Expand answers only when you're ready. Dive deeper into any concept
            instantly with AI-powered detailed explanations.
          </p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Capture Your Insights
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Add personal notes to any question and pin important ones to the top
            — making your learning more organized and impactful.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Understand the "Why" Behind Answers
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Beyond just answers — unlock detailed concept explanations generated
            by AI, helping you truly master each topic.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Save, Organize, and Revisit
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Easily save your interview sets, organize them neatly in your
            dashboard, and pick up your preparation right where you left off.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
