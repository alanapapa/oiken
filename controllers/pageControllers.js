const Course = require("../models/Course");

exports.getIndexPage = async (req, res) => {
  const courses = await Course.find();
  res.status(200).render("index", {
    courses,
    page_name: "index",
  });
};
exports.getAboutPage = (req, res) => {
  res.status(200).render("about", {
    page_name: "about",
  });
};
exports.getContactPage = (req, res) => {
  res.status(200).render("contact", {
    page_name: "contact",
  });
};
exports.getBlogPage = (req, res) => {
  res.status(200).render("blog", {
    page_name: "blog",
  });
};
exports.getBlogSinglePage = (req, res) => {
  res.status(200).render("blog-single", {
    page_name: "blog-single",
  });
};
exports.getLoginPage = (req, res) => {
  res.status(200).render("login", {
    page_name: "login",
  });
};
exports.getRegisterPage = (req, res) => {
  res.status(200).render("register", {
    page_name: "register",
  });
};
exports.get404Page = (req, res) => {
  res.status(404).render("404", {
    page_name: "404",
  });
};
