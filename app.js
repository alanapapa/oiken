const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const fileupload = require('express-fileupload');
const methodOverride = require("method-override");
const MongoStore = require("connect-mongo");
const pageRoute = require("./routes/pageRoute");
const courseRoute = require("./routes/courseRoute");
const blogRoute = require("./routes/blogRoute");
const categoryRoute = require("./routes/categoryRoute");
const categoryBlogRoute = require("./routes/categoryBlogRoute");
const userRoute = require("./routes/userRoute");

const app = express();

// connect DB

mongoose
  .connect("mongodb://localhost/oiken-db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("DB Connected Successfully");
  });

// temp engine
app.set("view engine", "ejs");

// global var
global.userIN = null;

const options = {
  dotfiles: "ignore",
  etag: false,
  extensions: ["htm", "html"],
  index: false,
  maxAge: "1d",
  redirect: false,
  setHeaders: function (res, path, stat) {
    res.set("x-timestamp", Date.now());
  },
};

// middlewares

app.use(express.static("public", options));
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(
  session({
    secret: "jeti_qazyna",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: "mongodb://localhost/oiken-db" }),
  })
);
app.use(flash());
app.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  next();
});
app.use(fileupload());
app.use(
  methodOverride("_method", {
    methods: ["POST", "GET"],
  })
);

// routes
app.use("*", (req, res, next) => {
  userIN = req.session.userID;
  next();
});
app.use("/", pageRoute);
app.use("/courses", courseRoute);
app.use("/categories", categoryRoute);
app.use("/blogs", blogRoute);
app.use("/blog-categories", categoryBlogRoute);
app.use("/users", userRoute);

app.use((req, res) => {
  res.status(404).redirect("/404");
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`App started on port ${port}`);
});
