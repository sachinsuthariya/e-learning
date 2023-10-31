// Import only what we need from express
import { Router } from "express";
import { Validator } from "../../../validate";
import { ExamModel } from "./examModel";
import { ExamController } from "./examController";
import { Middleware } from "../../../middleware";

// Assign router to the express.Router() instance
const router: Router = Router();
const v: Validator = new Validator();
const examController = new ExamController(); // Use the ExamController for exams
const middleware = new Middleware();


// exam routes
router.post("/", middleware.isAuthenticated, v.validate(ExamModel), examController.create);
router.put("/:id", middleware.isAuthenticated, v.validate(ExamModel), examController.update);
// router.delete("/:id", examController.delete);
router.get("/list", middleware.isAuthenticatedUser, examController.allExams);
router.get("/", examController.allExams);

// enrollment user for exam routes
router.put("/:id/enroll-exam", middleware.isAuthenticatedStudent, examController.enrollExamUser);
router.get("/enrolled", middleware.isAuthenticatedStudent, examController.enrolledExams);
router.get("/enrolled-exams/:id", middleware.isAuthenticated, examController.enrolledExamsCheckAdmin);
router.get("/enrolled-students/:id", middleware.isAuthenticated, examController.enrolledStudentsCheckAdmin);

// get exam question
router.get("/:id/questions", middleware.isAuthenticatedStudent, examController.getExamQuestions)
router.post("/:id/:questionId/answer", middleware.isAuthenticatedStudent, examController.submitAnswer)

//get exam result 
router.get("/:id/:userId/result", middleware.isAuthenticatedStudent, examController.getExamResult)
router.get("/:id", middleware.isAuthenticatedUser, examController.getById);

// Export the express.Router() instance to be used by server.ts
export const ExamRoute: Router = router;
