const nodemailer = require("nodemailer");
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
exports.sendEmail = async (req, res) => {
  try {
  const outputMessage = `
  <h3>Mail Details</h3>
  <ul>
    <li>Name: ${req.body.name}</li>
    <li>Email: ${req.body.email}</li>
  </ul>
  <h3>Message</h3>
  <p>${req.body.message}</p>
  `
  let transporter = nodemailer.createTransport({
    host: "smtp.yandex.ru",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'oiken@alnp.pw', // generated ethereal user
      pass: 'ikfK{H(]@>', // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"OIKEN" <oiken@alnp.pw>', // sender address
    to: "oiken@alnp.pw", // list of receivers
    subject: "Oiken New Message", // Subject line
    html: outputMessage, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

  req.flash('success', 'Message sent successfully!');

  res.status(200).redirect('back')
} catch(err) {
  req.flash('error', "Something went wrong! Please try again later.");
  res.status(400).redirect('back');
}
}
