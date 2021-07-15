const Blog = require("../models/Blog");
const CategoryBlog = require("../models/CategoryBlog");
const Course = require("../models/Blog");

exports.createBlog = async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    res.status(201).json({
      status: "success",
      blog,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

exports.getAllBlogs = async (req, res) => {
  try {
    const categorySlug = req.query.categories;
    const category = await CategoryBlog.findOne({ slug: categorySlug });

    let filter = {};
    if (categorySlug) {
      filter = { category: category._id };
    }

    const blogs = await Blog.find(filter);
    const categories = await CategoryBlog.find();
    res.status(200).render("blogs", {
      blogs,
      categories,
      categorySlug,
      page_name: 'blogs',
    });
  } catch (error) {
    res.status(400).json({
      status: "my fail",
      error,
    });
  }
};


exports.getBlog = async (req, res) => {
  try {
    const categorySlug = req.query.categories;
    const blogs = await Blog.find();
    const categories = await CategoryBlog.find();
    const blog = await Blog.findOne({ slug: req.params.slug });
    res.status(200).render("blog", {
      blog,
      blogs,
      categories,
      categorySlug,
      page_name: "blog",
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      err,
    });
  }
};
