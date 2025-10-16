import React from "react";
import { ArrowRight } from "lucide-react";

const CTASection = ({ onGetStarted }) => {
  return (
    <section className="py-16 px-4 bg-gradient-to-r from-orange-500 to-yellow-500">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Ready to Ace Your Next Interview?
        </h2>
        <p className="text-xl text-white opacity-90 mb-8 max-w-2xl mx-auto">
          Join thousands of professionals who've landed their dream jobs with
          our AI-powered interview preparation platform.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onGetStarted}
            className="px-8 py-4 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center justify-center"
          >
            Get Started Free
            <ArrowRight className="ml-2 w-5 h-5" />
          </button>

          <button className="px-8 py-4 bg-transparent text-white rounded-lg font-medium hover:bg-white hover:bg-opacity-20 transition-colors border border-white">
            Schedule a Demo
          </button>
        </div>

        <p className="text-white opacity-75 mt-6 text-sm">
          No credit card required • Free plan available • Cancel anytime
        </p>
      </div>
    </section>
  );
};

export default CTASection;
