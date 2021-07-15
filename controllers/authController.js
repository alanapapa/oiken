const bcrypt = require('bcrypt');
const User = require("../models/User");

exports.createUser= async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({
      status: "success",
      user,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

exports.loginUser= async (req, res) => {
  try {
    const {email, password} = req.body;
    
    await User.findOne({email}, (err, user) => {
      if(user) {
        bcrypt.compare(password, user.password, (err, same)=>{
          if (same) {
            req.session.userID = user._id;
            res.status(200).redirect('/');
          }
        })
      }
    })
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};
