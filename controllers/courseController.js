const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");

exports.createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);
    const path = "/users/create/" + course.slug;
    res.status(201).redirect(path);
  } catch (error) {
    res.status(400).json({
      status: "yes fail",
      error,
    });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const perPage = 4;
    const totalCourses = await Course.find().countDocuments();

    const categorySlug = req.query.categories;
    const category = await Category.findOne({ slug: categorySlug });

    let filter = {};
    if (categorySlug) {
      filter = { category: category._id };
    }

    const courses = await Course.find(filter)
      .sort("-createdAt")
      .skip((page - 1) * perPage)
      .limit(perPage);
    const categories = await Category.find();
    res.status(200).render("courses", {
      courses,
      categories,
      categorySlug,
      current: page,
      pages: Math.ceil(totalCourses / perPage),
      page_name: "courses",
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug }).populate(
      "author"
    );
    const user = await User.findById(req.session.userID);

    res.status(200).render("course", {
      user,
      course,
      page_name: "course",
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      err,
    });
  }
};

exports.enrollCourse = async (req, res, next) => {
  try {
    const user = await User.findById(req.session.userID);
    await user.courses.push({ _id: req.body.course_id });
    await user.save();
    res.status(200).redirect("back");
  } catch (err) {
    res.status(400).json({
      status: "fail",
      err,
    });
  }
};

exports.leaveCourse = async (req, res) => {
  try {
    const user = await User.findById(req.session.userID);
    await user.courses.pull({ _id: req.body.course_id });
    await user.save();
    res.status(200).redirect("back");
  } catch (err) {
    res.status(400).json({
      status: "Not leaved",
      err,
    });
  }
};
