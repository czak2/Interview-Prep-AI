const mongoose = require("mongoose");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const InterviewSession = require("../models/InterviewSession");
const Question = require("../models/Question");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const createSession = async (req, res) => {
  try {
    const { title, skills, experience, description } = req.body;

    const newSession = await InterviewSession.create({
      user: req.user.id,
      title,
      skills,
      experience,
      description,
    });

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `Generate 5 interview questions for a ${title} role requiring ${experience} experience with these skills: ${skills}. 
    Return as a JSON array where each question has "questionText" and "answer" properties.`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const jsonString = text.replace(/```json|```/g, "").trim();
      const generatedQuestions = JSON.parse(jsonString);

      const questions = await Question.insertMany(
        generatedQuestions.map((q) => ({
          session: newSession._id,
          user: req.user.id,
          questionText: q.questionText,
          answer: q.answer,
          isAIGenerated: true,
        }))
      );

      newSession.questions = questions.map((q) => q._id);
      await newSession.save();

      const populatedSession = await InterviewSession.findById(
        newSession._id
      ).populate("questions");

      return res.status(201).json({
        status: "success",
        data: {
          session: populatedSession,
        },
      });
    } catch (aiError) {
      console.error("AI generation failed, using fallback questions", aiError);

      const fallbackQuestions = [
        {
          questionText: `Explain your experience with ${skills}`,
          answer: `As a ${experience} developer, I would approach ${skills} by...`,
          isAIGenerated: false,
        },
        {
          questionText: `What are the core concepts of ${
            skills.split(",")[0]
          }?`,
          answer: `The core concepts include...`,
          isAIGenerated: false,
        },
      ];

      const questions = await Question.insertMany(
        fallbackQuestions.map((q) => ({
          ...q,
          session: newSession._id,
          user: req.user.id,
        }))
      );

      newSession.questions = questions.map((q) => q._id);
      await newSession.save();

      const populatedSession = await InterviewSession.findById(
        newSession._id
      ).populate("questions");

      return res.status(201).json({
        status: "success",
        data: {
          session: populatedSession,
        },
      });
    }
  } catch (err) {
    console.error("Error in createSession:", err);
    return res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

const getUserSessions = async (req, res) => {
  try {
    const sessions = await InterviewSession.find({ user: req.user.id })
      .populate("questions")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      status: "success",
      results: sessions.length,
      data: {
        sessions,
      },
    });
  } catch (err) {
    console.error("Error in getUserSessions:", err);
    return res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

const getSessionDetails = async (req, res) => {
  try {
    const session = await InterviewSession.findOne({
      _id: req.params.id,
      user: req.user.id,
    }).populate({
      path: "questions",
      options: { sort: { createdAt: 1 } },
    });

    if (!session) {
      return res.status(404).json({
        status: "fail",
        message: "No session found with that ID",
      });
    }

    return res.status(200).json({
      status: "success",
      data: {
        session,
      },
    });
  } catch (err) {
    console.error("Error in getSessionDetails:", err);
    return res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

const updateSession = async (req, res) => {
  try {
    const { title, skills, experience, description } = req.body;

    const session = await InterviewSession.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { title, skills, experience, description },
      { new: true, runValidators: true }
    ).populate("questions");

    if (!session) {
      return res.status(404).json({
        status: "fail",
        message: "No session found with that ID",
      });
    }

    return res.status(200).json({
      status: "success",
      data: {
        session,
      },
    });
  } catch (err) {
    console.error("Error in updateSession:", err);
    return res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

const deleteSession = async (req, res) => {
  try {
    const session = await InterviewSession.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!session) {
      return res.status(404).json({
        status: "fail",
        message: "No session found with that ID",
      });
    }

    await Question.deleteMany({ session: req.params.id });

    return res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    console.error("Error in deleteSession:", err);
    return res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

const getQuestionDetails = async (req, res) => {
  try {
    const { sessionId, questionId } = req.params;

    const session = await InterviewSession.findOne({
      _id: sessionId,
      user: req.user.id,
    });

    if (!session) {
      return res.status(404).json({
        status: "fail",
        message: "No session found with that ID",
      });
    }

    const question = await Question.findOne({
      _id: questionId,
      session: sessionId,
      user: req.user.id,
    });

    if (!question) {
      return res.status(404).json({
        status: "fail",
        message: "No question found with that ID",
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Provide a detailed explanation for the following interview question: "${question.questionText}". 
    Include an introduction, key concepts, code examples if applicable, and best practices. 
    Format the response as a JSON object with the following structure:
    {
      "title": "Title of the explanation",
      "content": "Brief introduction",
      "sections": [
        {
          "title": "Section 1 Title",
          "content": "Section content with multiple paragraphs",
          "code": "Code example if applicable",
          "points": ["Key point 1", "Key point 2"]
        },
        {
          "title": "Section 2 Title",
          "content": "Section content",
          "code": "Another code example",
          "points": ["Key point 3", "Key point 4"]
        }
      ]
    }`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const jsonString = text.replace(/```json|```/g, "").trim();
      const detailedExplanation = JSON.parse(jsonString);

      return res.status(200).json({
        status: "success",
        data: detailedExplanation,
      });
    } catch (aiError) {
      console.error("AI generation failed for question details", aiError);

      const fallbackDetails = {
        title: `Understanding ${question.questionText}`,
        content: `This question explores your knowledge of ${
          question.questionText.split(" ")[0]
        } concepts. Let's break down the key aspects you should cover in your answer.`,
        sections: [
          {
            title: "Core Concepts",
            content: `When answering about ${question.questionText}, focus on the fundamental principles and how they apply in real-world scenarios.`,
            code: question.questionText.includes("React")
              ? `// Example of using React Hooks
import React, { useState, useEffect, useCallback } from 'react';

function MyComponent() {
  const [data, setData] = useState([]);
  
  const fetchData = useCallback(async () => {
    const response = await fetch('https://api.example.com/data ');
    const result = await response.json();
    setData(result);
  }, []);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  return <div>{/* Component JSX */}</div>;
}`
              : null,
            points: [
              "Explain the basic concept clearly and concisely",
              "Provide practical examples from your experience",
              "Discuss advantages and potential drawbacks",
            ],
          },
          {
            title: "Best Practices",
            content:
              "When answering this question in an interview, follow these guidelines to make a strong impression.",
            points: [
              "Structure your answer with an introduction, main points, and conclusion",
              "Use specific examples from your own projects",
              "Connect your answer to the specific requirements of the role",
              "Demonstrate your problem-solving approach",
            ],
          },
        ],
      };

      return res.status(200).json({
        status: "success",
        data: fallbackDetails,
      });
    }
  } catch (err) {
    console.error("Error in getQuestionDetails:", err);
    return res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

const generateMoreQuestions = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await InterviewSession.findOne({
      _id: sessionId,
      user: req.user.id,
    });

    if (!session) {
      return res.status(404).json({
        status: "fail",
        message: "Session not found",
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `Generate 5 more interview questions about ${session.skills} for a ${session.title} role at ${session.experience} level. 
    Return as JSON array with "questionText" and "answer" properties.`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      const jsonString = text.replace(/```json|```/g, "").trim();
      const generatedQuestions = JSON.parse(jsonString);

      const questions = await Question.insertMany(
        generatedQuestions.map((q) => ({
          session: session._id,
          user: req.user.id,
          questionText: q.questionText,
          answer: q.answer,
          isAIGenerated: true,
        }))
      );

      session.questions = [
        ...session.questions,
        ...questions.map((q) => q._id),
      ];
      await session.save();

      return res.status(200).json({
        status: "success",
        data: {
          questions,
        },
      });
    } catch (aiError) {
      console.error("AI generation failed for more questions", aiError);

      const fallbackQuestions = [
        {
          questionText: `Explain your experience with ${
            session.skills.split(",")[0]
          }`,
          answer: `As a ${session.experience} developer, I would approach ${
            session.skills.split(",")[0]
          } by...`,
          isAIGenerated: false,
        },
        {
          questionText: `What are the advanced concepts of ${
            session.skills.split(",")[0]
          }?`,
          answer: `The advanced concepts include...`,
          isAIGenerated: false,
        },
        {
          questionText: `How would you optimize ${
            session.skills.split(",")[0]
          } performance?`,
          answer: `Performance optimization can be achieved through...`,
          isAIGenerated: false,
        },
        {
          questionText: `Describe a challenging project involving ${
            session.skills.split(",")[0]
          }`,
          answer: `In one of my recent projects, I had to...`,
          isAIGenerated: false,
        },
        {
          questionText: `What are the best practices for ${
            session.skills.split(",")[0]
          } development?`,
          answer: `Some best practices include...`,
          isAIGenerated: false,
        },
      ];

      const questions = await Question.insertMany(
        fallbackQuestions.map((q) => ({
          ...q,
          session: session._id,
          user: req.user.id,
        }))
      );

      session.questions = [
        ...session.questions,
        ...questions.map((q) => q._id),
      ];
      await session.save();

      return res.status(200).json({
        status: "success",
        data: {
          questions,
        },
      });
    }
  } catch (err) {
    console.error("Error in generateMoreQuestions:", err);
    return res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

module.exports = {
  createSession,
  getUserSessions,
  getSessionDetails,
  updateSession,
  deleteSession,
  getQuestionDetails,
  generateMoreQuestions,
};
