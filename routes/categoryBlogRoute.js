const express = require('express');
const categoryBlogController = require("../controllers/categoryBlogController");

const router = express.Router();

router.route('/').post(categoryBlogController.createCategoryBlog);

module.exports = router;
