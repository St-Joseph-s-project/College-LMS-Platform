import express from "express";
import { checkPermission, validateJWT, validateTenant } from "../../../middleware";
import {
  createCourseController,
  getAllCoursesController,
  getCourseByIdController,
  updateCourseController,
  deleteCourseController,
  updateVisibilityController,
} from "./courseController";
import { courseValidator } from "./courseValidator";

const router = express.Router();

// Get all courses
router.get(
  "/get-all",
  validateJWT,
  validateTenant,
  checkPermission("LMS_COURSE_VIEW"),
  getAllCoursesController
);

// Get course by ID
router.get(
  "/get/:id",
  validateJWT,
  validateTenant,
  checkPermission("LMS_COURSE_VIEW"),
  getCourseByIdController
);

// Create a new course
router.post(
  "/add",
  validateJWT,
  validateTenant,
  checkPermission("LMS_COURSE_ADD"),
  courseValidator.createCourse,
  createCourseController
);

// Update a course
router.put(
  "/update/:id",
  validateJWT,
  validateTenant,
  checkPermission("LMS_COURSE_UPDATE"),
  courseValidator.updateCourse,
  updateCourseController
);

// Delete a course
router.put(
  "/delete/:id",
  validateJWT,
  validateTenant,
  checkPermission("LMS_COURSE_DELETE"),
  deleteCourseController
);

// Update course visibility
router.put(
  "/update-visibility/:id",
  validateJWT,
  validateTenant,
  checkPermission("LMS_COURSE_UPDATE"),
  courseValidator.updateVisibility,
  updateVisibilityController
);

export default router;