const Category = require("../models/Category");
const User = require("../models/User");

exports.createCategory = async (req, res) => {
  const admin = await User.findById(req.session.userID);
  try {
    if (admin.role === 'admin') {
    const category = await Category.create(req.body);
    req.flash('success', `Category "${category.name}" has been created successfully!`);
    res.status(201).redirect('back');
  } else {
    req.flash("error", "You do not have access!");
    res.status(403).redirect('/login');
  }
} catch(err) {
  req.flash("error", "Category: Something went wrong! Try again!");
  res.status(400).redirect('back');
}
};

exports.deleteCategory = async (req, res) => {
  const admin = await User.findById(req.session.userID);
  try {
    if (admin.role === 'admin') {
      const category = await Category.findByIdAndRemove(req.params.id);
      req.flash('success', `Category "${category.name}" has been removed successfully!`);
      res.status(200).redirect('back');
    } else {
      req.flash("error", "You do not have access!");
      res.status(403).redirect('/login');
    }
  } catch(err) {
    req.flash("error", "Category: Something went wrong! Try again!");
    res.status(400).redirect('back');
  }
}