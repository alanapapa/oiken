const express = require('express');
const { body } = require('express-validator');
const User = require('../models/User')
const authController = require("../controllers/authController");
const authMiddleware = require('../middlewares/authMiddleware');
const courseController = require('../controllers/courseController');


const router = express.Router();

router.route('/').get(authController.loginUser);
router.route('/signup').post(
    [
        body('username').not().isEmpty().withMessage(' Please Enter Your Name'),
        body('email').isEmail().withMessage(' Please Enter Valid Email')
        .custom((userEmail)=>{
            return User.findOne({email:userEmail}).then(user => {
                return Promise.reject(' Email is already exists')
            })
        }),
        body('password').notEmpty().withMessage(' Please Enter A Password')
    ],

    authController.createUser);
router.route('/login').post(authController.loginUser);
router.route('/logout').get(authController.logoutUser);
router.route('/profile').get(authMiddleware, authController.getProfilePage);
router.route('/create/:slug').get(authController.getCourseCreatePage);
router.route('/:id').delete(authController.deleteUser);
router.route('/subscribe').post(authController.subscribeUser);



module.exports = router;
