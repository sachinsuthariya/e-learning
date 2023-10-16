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
router.post("/", v.validate(CourseModel), courseController.create); // for internal use only
router.put("/:id", v.validate(CourseModel), courseController.update);
router.put("/status/:id", courseController.updateStatus);
router.delete("/:id", courseController.delete);
router.patch("/:id", courseController.restore);
router.get("/:id", courseController.getById);
router.get("/", courseController.allCourses); // all Courses

// Export the express.Router() instance to be used by server.ts
export const CourseRoute: Router = router;
