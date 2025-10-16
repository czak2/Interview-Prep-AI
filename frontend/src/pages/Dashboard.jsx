import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  X,
  Edit,
  Trash2,
  TrendingUp,
  Target,
  Award,
  Clock,
  ArrowRight,
  Briefcase,
  Calendar,
  Hash,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import { getSessionColor } from "../utils/sessionColors";
import DeleteConfirmation from "../components/common/DeleteConfirmation";

function Dashboard() {
  const [interviewSessions, setInterviewSessions] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);
  const [sessionToDelete, setSessionToDelete] = useState(null);
  const [formData, setFormData] = useState({
    targetRole: "",
    experience: "",
    topics: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalQuestions: 0,
    recentActivity: 0,
    topSkill: "",
  });
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const { data } = await API.get("/sessions");
        const sessions = data.data.sessions;
        setInterviewSessions(sessions);

        const totalQuestions = sessions.reduce(
          (acc, session) => acc + (session.questions?.length || 0),
          0
        );
        const recentSessions = sessions.filter((session) => {
          const sessionDate = new Date(session.createdAt);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return sessionDate > weekAgo;
        }).length;

        const skillCounts = {};
        sessions.forEach((session) => {
          const skills = session.skills.split(",").map((skill) => skill.trim());
          skills.forEach((skill) => {
            skillCounts[skill] = (skillCounts[skill] || 0) + 1;
          });
        });

        const topSkill = Object.keys(skillCounts).reduce(
          (a, b) => (skillCounts[a] > skillCounts[b] ? a : b),
          ""
        );

        setStats({
          totalSessions: sessions.length,
          totalQuestions,
          recentActivity: recentSessions,
          topSkill,
        });
      } catch (error) {
        console.error("Failed to fetch sessions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();

    if (submitting) return;

    try {
      setSubmitting(true);
      const { data } = await API.post("/sessions", {
        title: formData.targetRole,
        skills: formData.topics,
        experience: formData.experience,
        description: formData.description,
      });
      setInterviewSessions([...interviewSessions, data.data.session]);

      setStats((prev) => ({
        ...prev,
        totalSessions: prev.totalSessions + 1,
        totalQuestions:
          prev.totalQuestions + (data.data.session.questions?.length || 0),
      }));

      setShowCreateModal(false);
      setFormData({
        targetRole: "",
        experience: "",
        topics: "",
        description: "",
      });
    } catch (error) {
      console.error("Failed to create session:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSession = (session) => {
    setCurrentSession(session);
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

    if (submitting) return;

    try {
      setSubmitting(true);
      const { data } = await API.put(`/sessions/${currentSession._id}`, {
        title: formData.targetRole,
        skills: formData.topics,
        experience: formData.experience,
        description: formData.description,
      });

      const updatedSessions = interviewSessions.map((session) =>
        session._id === currentSession._id ? data.data.session : session
      );
      setInterviewSessions(updatedSessions);

      setShowEditModal(false);
      setCurrentSession(null);
      setFormData({
        targetRole: "",
        experience: "",
        topics: "",
        description: "",
      });
    } catch (error) {
      console.error("Failed to update session:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (session) => {
    setSessionToDelete(session);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await API.delete(`/sessions/${sessionToDelete._id}`);
      const updatedSessions = interviewSessions.filter(
        (session) => session._id !== sessionToDelete._id
      );
      setInterviewSessions(updatedSessions);

      setStats((prev) => ({
        ...prev,
        totalSessions: prev.totalSessions - 1,
        totalQuestions:
          prev.totalQuestions - (sessionToDelete.questions?.length || 0),
      }));

      setShowDeleteModal(false);
      setSessionToDelete(null);
    } catch (error) {
      console.error("Failed to delete session:", error);
    }
  };

  if (loading && interviewSessions.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.fullName}!
          </h1>
          <p className="text-lg text-gray-600">
            Ready to ace your next interview? Let's continue your preparation
            journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100 mr-4">
                <Target className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Sessions
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.totalSessions}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 mr-4">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Questions Practiced
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.totalQuestions}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 mr-4">
                <Award className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Top Skill</p>
                <p className="text-lg font-semibold text-gray-900">
                  {stats.topSkill || "None"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Your Interview Sessions
              </h3>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Session
              </button>
            </div>
          </div>

          {interviewSessions.length === 0 ? (
            <div className="text-center py-12">
              <Target className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No interview sessions
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new interview session.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Session
                </button>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {interviewSessions.map((session, index) => (
                <div
                  key={session._id}
                  className="group hover:bg-gray-50 transition-colors"
                >
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div
                          className={`w-10 h-10 rounded-lg ${getSessionColor(
                            index
                          )} flex items-center justify-center mr-4`}
                        >
                          <span className="text-white font-bold">
                            {session.title
                              .split(" ")
                              .map((word) => word[0])
                              .join("")
                              .toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">
                            {session.title}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {session.skills} • {session.experience}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {session.questions?.length || 0} Q&A
                        </span>
                        <Link
                          to={`/dashboard/${session._id}`}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-orange-600 bg-orange-100 hover:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                        >
                          Practice
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                          <button
                            onClick={() => handleEditSession(session)}
                            className="p-1 rounded text-gray-400 hover:text-gray-600"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(session)}
                            className="p-1 rounded text-gray-400 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Recent Activity
          </h3>
          <div className="flow-root">
            <ul className="-mb-8">
              <li>
                <div className="relative pb-8">
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center ring-8 ring-white">
                        <Plus className="h-4 w-4 text-white" />
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm text-gray-500">
                          Created a new session
                        </p>
                      </div>
                      <div className="text-right text-sm whitespace-nowrap text-gray-500">
                        <p>
                          {stats.recentActivity > 0
                            ? "Today"
                            : "No recent activity"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="w-full">
                    <div className="flex items-center mb-4">
                      <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-orange-100 sm:mx-0 sm:h-10 sm:w-10">
                        <Briefcase className="h-6 w-6 text-orange-600" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          Create New Interview Session
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Set up a personalized interview practice session
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleCreateSession} className="space-y-6">
                      <div>
                        <label
                          htmlFor="targetRole"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Target Role
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Briefcase className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            id="targetRole"
                            value={formData.targetRole}
                            onChange={(e) =>
                              handleInputChange("targetRole", e.target.value)
                            }
                            className="focus:ring-orange-500 focus:border-orange-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                            placeholder="e.g. Frontend Developer"
                            required
                            disabled={submitting}
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="experience"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Experience Level
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Calendar className="h-5 w-5 text-gray-400" />
                          </div>
                          <select
                            id="experience"
                            value={formData.experience}
                            onChange={(e) =>
                              handleInputChange("experience", e.target.value)
                            }
                            className="focus:ring-orange-500 focus:border-orange-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                            required
                            disabled={submitting}
                          >
                            <option value="">Select experience level</option>
                            <option value="Entry Level (0-1 years)">
                              Entry Level (0-1 years)
                            </option>
                            <option value="Junior (1-3 years)">
                              Junior (1-3 years)
                            </option>
                            <option value="Mid-Level (3-5 years)">
                              Mid-Level (3-5 years)
                            </option>
                            <option value="Senior (5+ years)">
                              Senior (5+ years)
                            </option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="topics"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Topics to Focus On
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Hash className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            id="topics"
                            value={formData.topics}
                            onChange={(e) =>
                              handleInputChange("topics", e.target.value)
                            }
                            className="focus:ring-orange-500 focus:border-orange-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                            placeholder="e.g. React, JavaScript, CSS"
                            required
                            disabled={submitting}
                          />
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          Separate multiple topics with commas
                        </p>
                      </div>

                      <div>
                        <label
                          htmlFor="description"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Description (Optional)
                        </label>
                        <div className="mt-1">
                          <textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) =>
                              handleInputChange("description", e.target.value)
                            }
                            rows={3}
                            className="focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 border"
                            placeholder="Any specific goals or notes for this session"
                            disabled={submitting}
                          />
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleCreateSession}
                  disabled={submitting}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-600 text-base font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    "Create Session"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  disabled={submitting}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="w-full">
                    <div className="flex items-center mb-4">
                      <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-orange-100 sm:mx-0 sm:h-10 sm:w-10">
                        <Edit className="h-6 w-6 text-orange-600" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          Edit Interview Session
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Update your interview practice session
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleUpdateSession} className="space-y-6">
                      <div>
                        <label
                          htmlFor="editTargetRole"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Target Role
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Briefcase className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            id="editTargetRole"
                            value={formData.targetRole}
                            onChange={(e) =>
                              handleInputChange("targetRole", e.target.value)
                            }
                            className="focus:ring-orange-500 focus:border-orange-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                            placeholder="e.g. Frontend Developer"
                            required
                            disabled={submitting}
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="editExperience"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Experience Level
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Calendar className="h-5 w-5 text-gray-400" />
                          </div>
                          <select
                            id="editExperience"
                            value={formData.experience}
                            onChange={(e) =>
                              handleInputChange("experience", e.target.value)
                            }
                            className="focus:ring-orange-500 focus:border-orange-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                            required
                            disabled={submitting}
                          >
                            <option value="">Select experience level</option>
                            <option value="Entry Level (0-1 years)">
                              Entry Level (0-1 years)
                            </option>
                            <option value="Junior (1-3 years)">
                              Junior (1-3 years)
                            </option>
                            <option value="Mid-Level (3-5 years)">
                              Mid-Level (3-5 years)
                            </option>
                            <option value="Senior (5+ years)">
                              Senior (5+ years)
                            </option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="editTopics"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Topics to Focus On
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Hash className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            id="editTopics"
                            value={formData.topics}
                            onChange={(e) =>
                              handleInputChange("topics", e.target.value)
                            }
                            className="focus:ring-orange-500 focus:border-orange-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                            placeholder="e.g. React, JavaScript, CSS"
                            required
                            disabled={submitting}
                          />
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          Separate multiple topics with commas
                        </p>
                      </div>

                      <div>
                        <label
                          htmlFor="editDescription"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Description (Optional)
                        </label>
                        <div className="mt-1">
                          <textarea
                            id="editDescription"
                            value={formData.description}
                            onChange={(e) =>
                              handleInputChange("description", e.target.value)
                            }
                            rows={3}
                            className="focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 border"
                            placeholder="Any specific goals or notes for this session"
                            disabled={submitting}
                          />
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleUpdateSession}
                  disabled={submitting}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-600 text-base font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    "Update Session"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  disabled={submitting}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <DeleteConfirmation
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSessionToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Interview Session"
        message={`Are you sure you want to delete "${sessionToDelete?.title}"? This action cannot be undone.`}
      />
    </div>
  );
}

export default Dashboard;
