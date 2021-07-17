const bcrypt = require('bcrypt');
const User = require('../models/User');
const Category = require('../models/Category');
const Course = require('../models/Course')

exports.createUser= async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).redirect('/login');
  } catch (error) {
    res.status(400).json({
      status: "Fail: Account not created",
      error,
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const {email, password} = req.body;
    
    await User.findOne({email}, (err, user) => {
      if(user) {
        bcrypt.compare(password, user.password, (err, same)=>{
            req.session.userID = user._id;
            res.status(200).redirect('/users/profile');
        })
      } else {
        req.flash("error", "User is not exist!");
        res.status(400).redirect('/login');
      }
    } )
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
  const user = await User.findOne({_id:req.session.userID}).populate('courses');
  const categories = await Category.find();
  const courses = await Course.find({author: req.session.userID});
  res.status(200).render('profile', {
    user,
    categories,
    courses,
    page_name: 'profile'
  })
}

exports.getCourseCreatePage = async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug });
    if (course.author == req.session.userID) {
      const categorySlug = req.query.categories;
      const courses = await Course.find();
      const categories = await Category.find();
      res.status(200).render('create', {
        course,
        courses,
        categories,
        categorySlug,
        page_name: 'create'
      })
    }
  } catch (error) {
    req.flash("error", "Forbidden!");
    res.status(403).redirect('/');
  }
}

exports.deleteCourse = async (req, res) => {
  try {
    console.log(req.params.slug)
    const course = await Course.findOne({ slug: req.params.slug });
    await Course.findByIdAndDelete(course._id);
    res.status(200).redirect('back');
  } catch(err){
    console.log(err)
    res.status(400).send('do not deleted')

  }
} 