const mongoose = require("mongoose");

const interviewSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Session must belong to a user"],
    },
    title: {
      type: String,
      required: [true, "Please provide a title"],
    },
    skills: {
      type: String,
      required: [true, "Please specify skills"],
    },
    experience: {
      type: String,
      required: [true, "Please specify experience level"],
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    questions: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Question",
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  }
);

// Update lastUpdated timestamp before saving
interviewSessionSchema.pre("save", function (next) {
  this.lastUpdated = Date.now();
  next();
});
interviewSessionSchema.pre(/^find/, function (next) {
  this.populate({
    path: "questions",
    select: "-__v",
  });
  next();
});

const InterviewSession = mongoose.model(
  "InterviewSession",
  interviewSessionSchema
);
module.exports = InterviewSession;
