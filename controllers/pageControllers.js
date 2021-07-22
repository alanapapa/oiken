const nodemailer = require("nodemailer");
const { validationResult } = require("express-validator");
const Course = require("../models/Course");
const User = require("../models/User");
const Category = require("../models/Category");

exports.getIndexPage = async (req, res) => {
  const courses = await Course.find().populate(['author', 'category']);
  const totalStudents = await User.countDocuments({role: 'student'});
  const totalTeachers = await User.countDocuments({role: 'teacher'});
  const totalCourses = await Course.find().countDocuments();
  const totalCategories = await Category.find().countDocuments();
  res.status(200).render("index", {
    courses,
    totalStudents,
    totalTeachers,
    totalCourses,
    totalCategories,
    page_name: "index",
  });
};
exports.getAboutPage = async (req, res) => {
  const totalStudents = await User.countDocuments({role: 'student'});
  const totalTeachers = await User.countDocuments({role: 'teacher'});
  const totalCourses = await Course.find().countDocuments();
  const totalCategories = await Category.find().countDocuments();
  res.status(200).render("about", {
    totalStudents,
    totalTeachers,
    totalCourses,
    totalCategories,
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
exports.sendEmail = async (req, res) => {
  try {
    if (req.body.name && req.body.email && req.body.message) {
      const outputMessage = `
        <h3>Mail Details</h3>
          <ul>
            <li>Name: ${req.body.name}</li>
            <li>Email: ${req.body.email}</li>
          </ul>
        <h3>Message</h3>
        <p>${req.body.message}</p>
        `;
      let transporter = nodemailer.createTransport({
        host: "smtp.yandex.ru",
        port: 465,
        secure: true,
        auth: {
          user: "oiken@alnp.pw",
          pass: "l>S[O*?!]hM.(5{_",
        },
      });

      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: '"OIKEN" <oiken@alnp.pw>', // sender address
        to: "oiken@alnp.pw", // list of receivers
        subject: "Oiken New Message", // Subject line
        html: outputMessage, // html body
      });

      req.flash("success", "Message sent successfully!");
      res.status(200).redirect("back");
    } else {
      const errors = validationResult(req);
      for (let i = 0; i < errors.array().length; i++) {
        req.flash("error", errors.array()[i].msg);
      }
        res.status(400).redirect("back");
    }
  } catch (err) {
    req.flash('error', 'Something happened... Try again!')
    res.status(400).redirect("back");
  }
};
