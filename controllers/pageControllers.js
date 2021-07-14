exports.getIndexPage = (req, res) => {
  res.status(200).render("index", {
    page_name: "index",
  });
};
exports.getAboutPage = (req, res) => {
  res.status(200).render("about", {
    page_name: "about",
  });
};
exports.getCoursesPage = (req, res) => {
  res.status(200).render("courses", {
    page_name: "courses",
  });
};
exports.getCourseSingle = (req, res) => {
  res.status(200).render("course", {
    page_name: "course",
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
