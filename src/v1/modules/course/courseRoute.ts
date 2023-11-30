// Import only what we need from express
import { Router } from "express";
import { Validator } from "../../../validate";
import { CourseModel } from "./courseModel";
import { CourseController } from "./courseController";
import { Middleware } from "../../../middleware";

// Assign router to the express.Router() instance
const router: Router = Router();
const v: Validator = new Validator();
const courseController = new CourseController();
const middleware = new Middleware();

// course routes
router.post("/", middleware.isAuthenticated, v.validate(CourseModel), courseController.create); // for internal use only
router.put("/:id", middleware.isAuthenticated, v.validate(CourseModel), courseController.update);
router.put("/status/:id", middleware.isAuthenticated, courseController.updateStatus);
router.delete("/:id", middleware.isAuthenticated, courseController.delete);
router.patch("/:id", middleware.isAuthenticated, courseController.restore);
// router.get('/youtube-live/auth/:id', courseController.createMeeting);
router.post('/zoom-live/auth', courseController.createMeeting);
router.post('/zoom-generate-signature', courseController.createSignature);
// router.get('/startLiveStream', courseController.startLiveStream);
router.get('/allCourses', courseController.appAllCourses); // app only route

// course enrollment
router.put("/:id/enroll-course", middleware.isAuthenticated, courseController.enrollCourseUser);
router.get("/enrolled-students/:id", middleware.isAuthenticated, courseController.enrolledStudentsCheckAdmin);
router.get("/enrolled", middleware.isAuthenticatedStudent, courseController.enrolledCourses);
router.get("/enrolled-courses/:id", middleware.isAuthenticated, courseController.enrolledCoursesCheckAdmin);

router.get("/:id", courseController.getById);
router.get("/", courseController.allCourses); // all Courses


// Export the express.Router() instance to be used by server.ts
export const CourseRoute: Router = router;
