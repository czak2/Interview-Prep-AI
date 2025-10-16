import React, { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Edit,
  Trash2,
  X,
  Plus,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import { getSessionColor } from "../utils/sessionColors";
import DeleteConfirmation from "../components/common/DeleteConfirmation";

function InterviewSessionDetails() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [questionDetails, setQuestionDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreQuestions, setHasMoreQuestions] = useState(true);
  const [allSessions, setAllSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    targetRole: "",
    experience: "",
    topics: "",
    description: "",
  });
  const [questionDetailsCache, setQuestionDetailsCache] = useState({});
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchSessionDetails = async () => {
      try {
        const { data } = await API.get(`/sessions/${sessionId}`);
        const sessionData = data.data.session;

        setSession(sessionData);
        setQuestions(sessionData.questions || []);
      } catch (error) {
        console.error("Failed to fetch session details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSessionDetails();
  }, [sessionId]);

  useEffect(() => {
    const fetchAllSessions = async () => {
      try {
        const { data } = await API.get("/sessions");
        setAllSessions(data.data.sessions || []);
      } catch (error) {
        console.error("Failed to fetch sessions:", error);
        setAllSessions([]);
      }
    };
    fetchAllSessions();
  }, []);

  const sessionIndex = allSessions
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .findIndex((s) => s._id === session?._id);

  const sessionColor =
    sessionIndex !== -1 ? getSessionColor(sessionIndex) : "bg-gray-100";

  const toggleQuestion = (index) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleLearnMore = async (question, index) => {
    if (selectedQuestion && selectedQuestion.index === index) {
      setSelectedQuestion(null);
      setQuestionDetails(null);
      return;
    }

    setSelectedQuestion({ ...question, index });

    if (questionDetailsCache[question._id]) {
      setQuestionDetails(questionDetailsCache[question._id]);
      return;
    }

    setLoadingDetails(true);
    setQuestionDetails(null);

    try {
      const { data } = await API.get(
        `/sessions/${sessionId}/questions/${question._id}/details`
      );

      const details = data.data;
      setQuestionDetailsCache((prev) => ({
        ...prev,
        [question._id]: details,
      }));

      setQuestionDetails(details);
    } catch (error) {
      console.error("Failed to fetch question details:", error);
      const fallbackDetails = {
        title: "Detailed Explanation",
        content:
          "We're having trouble loading the detailed explanation for this question. Please try again later.",
        sections: [],
      };

      setQuestionDetailsCache((prev) => ({
        ...prev,
        [question._id]: fallbackDetails,
      }));

      setQuestionDetails(fallbackDetails);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleLoadMore = async () => {
    if (loadingMore || !hasMoreQuestions) return;

    setLoadingMore(true);

    try {
      const { data } = await API.post(
        `/sessions/${sessionId}/generate-questions`
      );
      const newQuestions = data.data.questions;

      if (newQuestions && newQuestions.length > 0) {
        setQuestions((prev) => [...prev, ...newQuestions]);

        const updatedSession = { ...session };
        updatedSession.questions = [
          ...updatedSession.questions,
          ...newQuestions.map((q) => q._id),
        ];
        setSession(updatedSession);
      } else {
        setHasMoreQuestions(false);
      }
    } catch (error) {
      console.error("Failed to load more questions:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleEditSession = () => {
    setFormData({
      targetRole: session.title,
      experience: session.experience,
      topics: session.skills,
      description: session.description,
    });
    setShowEditModal(true);
  };

  const handleUpdateSession = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await API.put(`/sessions/${sessionId}`, {
        title: formData.targetRole,
        skills: formData.topics,
        experience: formData.experience,
        description: formData.description,
      });

      setSession(data.data.session);
      setShowEditModal(false);
    } catch (error) {
      console.error("Failed to update session:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await API.delete(`/sessions/${sessionId}`);
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to delete session:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading session details...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Session Not Found
        </h2>
        <p className="text-gray-600 mb-4">
          The requested interview session could not be found.
        </p>
        <Link
          to="/dashboard"
          className="px-4 py-2 bg-[#FF8A3D] text-white rounded-lg hover:bg-orange-500 transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className={`${sessionColor} rounded-lg p-6 shadow-md mb-6`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center font-bold text-gray-700">
              {session.title
                .split(" ")
                .map((word) => word[0])
                .join("")
                .toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {session.title}
              </h2>
              <p className="text-sm text-gray-600">{session.skills}</p>
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handleEditSession}
              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
              aria-label="Edit session"
            >
              <Edit className="w-4 h-4 text-gray-700" />
            </button>
            <button
              onClick={handleDeleteClick}
              className="p-2 bg-white rounded-full shadow-md hover:bg-red-50"
              aria-label="Delete session"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-gray-900 text-white px-3 py-1 rounded-full text-xs">
            Experience: {session.experience}
          </span>
          <span className="bg-gray-900 text-white px-3 py-1 rounded-full text-xs">
            {questions.length} Q&A
          </span>
          <span className="bg-gray-900 text-white px-3 py-1 rounded-full text-xs">
            Created On: {new Date(session.createdAt).toLocaleDateString()}
          </span>
        </div>

        <p className="text-sm text-gray-700">{session.description}</p>
      </div>

      <div className="flex gap-6" style={{ height: "calc(100vh - 280px)" }}>
        <div
          className={`${
            selectedQuestion ? "w-1/2" : "w-full"
          } bg-white rounded-lg p-6 shadow-md transition-all duration-300 flex flex-col`}
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Interview Q & A
          </h3>

          <div className="flex-1 overflow-y-auto">
            <ul className="space-y-4">
              {questions.map((item, index) => (
                <li
                  key={index}
                  className={`border rounded-lg overflow-hidden ${
                    selectedQuestion && selectedQuestion.index === index
                      ? "border-orange-500"
                      : "border-gray-200"
                  }`}
                >
                  <button
                    className="w-full px-4 py-3 flex items-center justify-between text-left bg-gray-50 hover:bg-gray-100 transition-colors"
                    onClick={() => toggleQuestion(index)}
                    aria-expanded={expandedQuestions[index]}
                  >
                    <div className="flex items-center space-x-2 flex-1">
                      <span className="text-gray-500 font-medium">
                        Q{index + 1}:
                      </span>
                      <p className="text-gray-800 font-medium break-words line-clamp-3">
                        {item.questionText}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLearnMore(item, index);
                        }}
                        className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs ${
                          selectedQuestion && selectedQuestion.index === index
                            ? "bg-orange-100 text-orange-600"
                            : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                        }`}
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Learn More</span>
                      </button>
                      {expandedQuestions[index] ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                  </button>

                  {expandedQuestions[index] && (
                    <div className="px-4 py-3 bg-white border-t border-gray-100">
                      <div className="prose max-w-none">
                        {item.answer.split("\n").map((paragraph, pIndex) => (
                          <div key={pIndex} className="mb-3">
                            {paragraph.includes("•") ? (
                              <div>
                                {paragraph
                                  .split("\n")
                                  .map((line, lineIndex) => {
                                    if (line.trim().startsWith("•")) {
                                      return (
                                        <div
                                          key={lineIndex}
                                          className="flex items-start mb-1"
                                        >
                                          <span className="text-blue-500 mr-2 mt-1">
                                            •
                                          </span>
                                          <span className="text-gray-700">
                                            {line.replace("•", "").trim()}
                                          </span>
                                        </div>
                                      );
                                    } else if (line.trim()) {
                                      return (
                                        <p
                                          key={lineIndex}
                                          className="text-gray-700 mb-2 font-medium"
                                        >
                                          {line}
                                        </p>
                                      );
                                    }
                                    return null;
                                  })}
                              </div>
                            ) : (
                              <p className="text-gray-700">{paragraph}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>

            <div className="flex justify-center mt-8">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore || !hasMoreQuestions}
                className={`flex items-center space-x-2 px-6 py-3 bg-black text-white rounded-lg transition-colors ${
                  loadingMore || !hasMoreQuestions
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-800"
                }`}
              >
                {loadingMore ? (
                  <>
                    <span className="animate-spin mr-2">↻</span>
                    Loading...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Load More Questions</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {selectedQuestion && (
          <div className="w-1/2 bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 flex flex-col">
            {loadingDetails ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">
                    Loading detailed information...
                  </p>
                </div>
              </div>
            ) : questionDetails ? (
              <>
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
                  <h3 className="text-lg font-bold text-gray-900">
                    {questionDetails.title || "Detailed Explanation"}
                  </h3>
                  <button
                    onClick={() => {
                      setSelectedQuestion(null);
                      setQuestionDetails(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                  {questionDetails.content && (
                    <div className="mb-6">
                      <p className="text-gray-700">{questionDetails.content}</p>
                    </div>
                  )}

                  {questionDetails.sections &&
                    questionDetails.sections.length > 0 && (
                      <div className="space-y-6">
                        {questionDetails.sections.map((section, index) => (
                          <div
                            key={index}
                            className="border-b border-gray-100 pb-6 last:border-0"
                          >
                            {section.title && (
                              <h4 className="text-md font-semibold text-gray-900 mb-3">
                                {section.title}
                              </h4>
                            )}

                            {section.content && (
                              <div className="text-gray-700 mb-4">
                                {section.content
                                  .split("\n")
                                  .map((paragraph, pIndex) => (
                                    <p key={pIndex} className="mb-2">
                                      {paragraph}
                                    </p>
                                  ))}
                              </div>
                            )}

                            {section.code && (
                              <div className="bg-gray-100 rounded-lg p-4 mb-4">
                                <pre className="text-sm text-gray-800 overflow-x-auto">
                                  <code>{section.code}</code>
                                </pre>
                              </div>
                            )}

                            {section.points && section.points.length > 0 && (
                              <ul className="list-disc pl-5 space-y-2">
                                {section.points.map((point, pointIndex) => (
                                  <li
                                    key={pointIndex}
                                    className="text-gray-700"
                                  >
                                    {point}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-gray-600">
                    No detailed information available for this question.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md relative">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Edit Interview Session
              </h2>
              <p className="text-gray-600">
                Update the details for your interview session.
              </p>
            </div>

            <form onSubmit={handleUpdateSession} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Role
                </label>
                <input
                  type="text"
                  value={formData.targetRole}
                  onChange={(e) =>
                    setFormData({ ...formData, targetRole: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  placeholder="e.g. Frontend Developer, UI/UX Designer"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Years of Experience
                </label>
                <input
                  type="text"
                  value={formData.experience}
                  onChange={(e) =>
                    setFormData({ ...formData, experience: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  placeholder="e.g. 1 year, 3 years, 5+ years"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Topics to Focus On
                </label>
                <input
                  type="text"
                  value={formData.topics}
                  onChange={(e) =>
                    setFormData({ ...formData, topics: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  placeholder="React, Node.js, MongoDB"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none resize-none"
                  rows="3"
                  placeholder="Any specific goals or notes for this session"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors flex justify-center items-center ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <>
                    <span className="animate-spin mr-2">↻</span>
                    Updating...
                  </>
                ) : (
                  "Update Session"
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      <DeleteConfirmation
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Interview Session"
        message={`Are you sure you want to delete "${session.title}"? This action cannot be undone.`}
      />
    </div>
  );
}

export default InterviewSessionDetails;
