import React from "react";
import HeroSection from "../components/landing/HeroSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import TestimonialsSection from "../components/landing/TestimonialsSection";
import PricingSection from "../components/landing/PricingSection";
import CTASection from "../components/landing/CTASection";
import Footer from "../components/landing/Footer";

function LandingPage({ onGetStarted }) {
  return (
    <div className="min-h-screen bg-yellow-50">
      <HeroSection onGetStarted={onGetStarted} />

      <FeaturesSection />

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get interview-ready in three simple steps with our AI-powered
              platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-500">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Create Your Profile
              </h3>
              <p className="text-gray-600">
                Sign up and tell us about your target role, experience level,
                and skills you want to focus on
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-500">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Generate Questions
              </h3>
              <p className="text-gray-600">
                Our AI creates personalized interview questions based on your
                profile and target role
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-500">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Practice & Learn
              </h3>
              <p className="text-gray-600">
                Review answers, explore detailed explanations, and master the
                concepts with our AI-powered learning guides
              </p>
            </div>
          </div>
        </div>
      </section>

      <TestimonialsSection />

      <PricingSection />

      <CTASection onGetStarted={onGetStarted} />

      <Footer />
    </div>
  );
}

export default LandingPage;
