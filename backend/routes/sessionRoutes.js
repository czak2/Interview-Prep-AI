const express = require("express");
const sessionController = require("../controllers/sessionController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(authMiddleware.protect);

router.post("/", sessionController.createSession);
router.get("/", sessionController.getUserSessions);
router.get("/:id", sessionController.getSessionDetails);
router.put("/:id", sessionController.updateSession);
router.delete("/:id", sessionController.deleteSession);
router.get(
  "/:sessionId/questions/:questionId/details",
  sessionController.getQuestionDetails
);
router.post(
  "/:sessionId/generate-questions",
  sessionController.generateMoreQuestions
);

module.exports = router;
