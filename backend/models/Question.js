const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InterviewSession",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    questionText: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    isAIGenerated: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Create and export the model
const Question = mongoose.model("Question", questionSchema);
module.exports = Question;
