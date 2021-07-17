const express = require('express');
const authController = require("../controllers/authController");
const authMiddleware = require('../middlewares/authMiddleware');
const courseController = require('../controllers/courseController');


const router = express.Router();

router.route('/signup').post(authController.createUser);
router.route('/login').post(authController.loginUser);
router.route('/logout').get(authController.logoutUser);
router.route('/profile').get(authMiddleware, authController.getProfilePage);
router.route('/create/:slug').get(authController.getCourseCreatePage);
router.route('/delete/:slug').get(authController.deleteCourse);



module.exports = router;
