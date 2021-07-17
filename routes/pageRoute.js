const express = require("express");
const pageController = require("../controllers/pageControllers");
const redirectMiddleware = require("../middlewares/redirectMiddleware");

const router = express.Router();

router.route("/").get(pageController.getIndexPage);
router.route("/blog").get(pageController.getBlogPage);
router.route("/about").get(pageController.getAboutPage);
router.route("/login").get(redirectMiddleware, pageController.getLoginPage);
router.route("/register").get(redirectMiddleware, pageController.getRegisterPage);
router.route("/contact").get(pageController.getContactPage);
router.route("/blog-single").get(pageController.getBlogSinglePage);
router.route("/404").get(pageController.get404Page);

module.exports = router;
