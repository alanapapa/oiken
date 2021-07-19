const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const Category = require('../models/Category');
const Course = require('../models/Course');
const Subscriber = require('../models/Subscriber');


exports.createUser = async (req, res) => {
  try {
    await User.create(req.body);
    req.flash("success", "Account has been successfully created!");
    res.status(201).redirect('/login');
  } catch (error) {
    const errors = validationResult(req);
    for (let i=0; i < errors.array().length; i++) {
      req.flash("error", errors.array()[i].msg);
    }
    res.status(400).redirect('back');
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    await User.findOne({ email }, (err, user) => {
      if (user) {
        bcrypt.compare(password, user.password, (err, same) => {
          if (same) {
            req.session.userID = user._id;
            res.status(200).redirect('/users/profile');
          } else {
            req.flash("error", "Your password is not correct! Try again!");
            res.status(400).redirect('back');
          }
        });
      } else {
        req.flash("error", "User is not exist!");
        res.status(400).redirect('back');
      }
    })
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

exports.logoutUser = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/')
  })
}

exports.getProfilePage = async (req, res) => {

  const page = req.query.page || 1;
  const perPage = 10;
  const totalUsers = await User.find().countDocuments();


  const user = await User.findOne({ _id: req.session.userID }).populate('courses');
  const categories = await Category.find();
  const courses = await Course.find({ author: req.session.userID }).sort('-createdAt');
  const users = await User.find()
  .sort("-createdAt")
  .skip((page - 1) * perPage)
  .limit(perPage);
  res.status(200).render('profile', {
    user,
    users,
    categories,
    courses,
    current: page,
    pages: Math.ceil(totalUsers / perPage),
    page_name: 'profile'
  })
}

exports.getCourseCreatePage = async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug });
    if (course.author == req.session.userID) {
      const coursee = await Course.findOne({ slug: req.params.slug }).populate(["author", "module"]);
      const categorySlug = req.query.categories;
      const courses = await Course.find();
      const categories = await Category.find();
      res.status(200).render('create', {
        course,
        coursee,
        courses,
        categories,
        categorySlug,
        page_name: 'create'
      })
    } else {
      req.flash("error", "You do not have access!");
      res.status(403).redirect('/login');
    }
  } catch (error) {
    req.flash("error", "Something went wrong! Try again!");
    res.status(400).redirect('back');
  }
}

exports.deleteUser = async (req, res) => {
  try {
    const admin = await User.findById(req.session.userID);
    if(admin.role === 'admin'){
      await User.findByIdAndRemove(req.params.id);
      await Course.deleteMany({author:req.params.id});
      req.flash("success", 'User has been removed successfully!');
      res.status(200).redirect('back');
    } else {
      req.flash("error", "You do not have access!");
      res.status(403).redirect('/login');
    }
  } catch (err) {
    req.flash("error", "Something went wrong! Try again!");
    res.status(400).redirect('back');

  }
}

exports.subscribeUser = async (req, res) => {
  try {
    await Subscriber.create(req.body)
      req.flash("success", 'You have successfully subscribed!');
      res.status(200).redirect('/');
  } catch (err) {
    req.flash("error", "Something went wrong! Try again!");
    res.status(400).redirect('/');

  }
}