const express = require('express');
const courseController = require("../controllers/courseController");
const roleMiddleware = require("../middlewares/roleMiddleware");


const router = express.Router();

router.route('/').post(roleMiddleware(["teacher", "admin"]), courseController.createCourse);
router.route('/new').post(roleMiddleware(["teacher", "admin"]), courseController.create1Course);
router.route('/').get(courseController.getAllCourses);
router.route('/course/:slug').get(courseController.getCourse);
router.route('/enroll').post(courseController.enrollCourse);
router.route('/leave').post(courseController.leaveCourse);
router.route('/:slug').delete(courseController.deleteCourse);
router.route('/course/:slug').put(courseController.updateCourse);
router.route('/create/:slug').post(courseController.createModule);
router.route('/delete/:_id').delete(courseController.deleteModule);
router.route('/update/:_id').put(courseController.updateModule);


module.exports = router;
