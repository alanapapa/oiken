const CategoryBlog = require("../models/CategoryBlog");

exports.createCategoryBlog = async (req, res) => {
  try {
    const categoryBlog = await CategoryBlog.create(req.body);
    res.status(201).json({
      status: "success",
      categoryBlog,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};
