const fs = require('fs');
const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");
const Module = require("../models/Module");

exports.createCourse = async (req, res) => {
  try {
    const uploadsDir = 'public/uploads';
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }
    console.log(req.body)
    if (req.files) {
      let uploadImage = req.files.image;
      let uploadPath = __dirname + '/../public/uploads/' + uploadImage.name;
      uploadImage.mv(uploadPath, async () => {
        const course = await Course.create({
          ...req.body,
          image: '/uploads/' + uploadImage.name,
        });
        const path = "/users/create/" + course.slug;
        req.flash('success', "Course has been created successfully!");
        res.status(201).redirect(path);
      });
    } else {
      const course = await Course.create(req.body);
      const path = "/users/create/" + course.slug;
      req.flash('success', "Course has been created successfully!");
      res.status(201).redirect(path);
    }
  } catch (error) {
    console.log(error)
    req.flash('error', "Something went wrong!");
    res.status(400).redirect('back');
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const perPage = 4;
    const totalCourses = await Course.find().countDocuments();

    const categorySlug = req.query.categories;
    const query = req.query.search;

    const category = await Category.findOne({ slug: categorySlug });

    let filter = {};
    if (categorySlug) {
      filter = { category: category._id };
    }

    if (query) {
      filter = {name: query};
    }

    if (!query && !category) {
      filter.name = "";
      filter.category = null;
    }

    const courses = await Course.find({
      $or:[
        {name: { $regex: '.*' + filter.name + '.*', $options: 'i'}},
        {category: filter.category}
      ]
    })
      .sort("-createdAt")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate(['author', 'category']);

      
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
      ["author", "module"]
    );
    const coursee = await Course.findOne({ slug: req.params.slug }).populate(["author", "module"]);
    
    const user = await User.findById(req.session.userID);
    res.status(200).render("course", {
      user,
      course,
      coursee,
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

exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findOne({slug:req.params.slug});
    if(req.session.userID == course.author){
      if (course.image != null) {
        let img = __dirname + '/../public' + course.image;
        fs.unlinkSync(img);
      }
      await Course.findByIdAndDelete(course._id);
      req.flash("success", `${course.name} has been removed successfully!`);
      res.status(200).redirect('back');
    } else {
      req.flash("error", "You do not have access!");
      res.status(403).redirect('/login');
    }
  } catch (err) {
    console.log(err)
    req.flash("error", "Something went wrong! Try again!");
    res.status(400).redirect('back');

  }
}

exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findOne({slug:req.params.slug});
    if(req.session.userID == course.author){
      if (req.files) {
        let uploadImage = req.files.image;
        let uploadPath = __dirname + '/../public/uploads/' + uploadImage.name;
        uploadImage.mv(uploadPath, () => {
          Course.updateOne({_id: course._id}, {
            ...req.body,
            image: '/uploads/' + uploadImage.name,
          });
        });
        course.image = '/uploads/' + uploadImage.name;
      } else {
        await Course.findByIdAndUpdate(course._id, {...req.body});
      }
      course.save();
      req.flash("success", `${course.name} has been updated successfully!`);
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

exports.createModule = async (req, res) => {
  try {
    const module = await Module.create(req.body);
    const course = await Course.findById(req.body.course_id);
    await course.module.push({ _id: module._id });
    await course.save();
    req.flash('success', `${module.title} has been created successfully!`);
    res.status(201).redirect('back');
  } catch (error) {
    req.flash('error', "Module has been not created! Try again!");
    res.status(400).redirect('back');
  }
};

exports.deleteModule = async (req, res) => {
  try {
    await Module.findByIdAndDelete({_id:req.params._id});
    req.flash("success", "Module has been removed successfully!");
    res.status(200).redirect('back');
  } catch (err) {
    req.flash("error", "Something went wrong! Try again!");
    res.status(400).redirect('back');
  }
}

exports.updateModule = async (req, res) => {
  try {
    const module = await Module.findByIdAndUpdate(req.params._id, {...req.body});
    req.flash('success', `${module.title} has been updated successfully!`);
    res.status(201).redirect('back');

  } catch (error) {
    req.flash('error', "Module has been not created! Try again!");
    res.status(400).redirect('back');
  }
};