const express = require("express");
const { body } = require('express-validator');
const pageController = require("../controllers/pageControllers");
const redirectMiddleware = require("../middlewares/redirectMiddleware");

const router = express.Router();

router.route("/").get(pageController.getIndexPage);
router.route("/blog").get(pageController.getBlogPage);
router.route("/about").get(pageController.getAboutPage);
router.route("/login").get(redirectMiddleware, pageController.getLoginPage);
router.route("/register").get(redirectMiddleware, pageController.getRegisterPage);
router.route("/contact").get(pageController.getContactPage);
router.route("/contact").post(
    [
    body('name').not().isEmpty().withMessage(' Please Enter Your Name'),
    body('email').isEmail().withMessage(' Please Enter Valid Email'),
    body('message').not().isEmpty().withMessage(' Please Enter A Message')
],
pageController.sendEmail);
router.route("/blog-single").get(pageController.getBlogSinglePage);
router.route("/404").get(pageController.get404Page);

module.exports = router;
