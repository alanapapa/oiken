const express = require('express');
const pageRoute = require('./routes/pageRoute')

const app = express();

// temp engine
app.set("view engine", "ejs");

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
app.use('/', pageRoute);
app.use((req, res)=> {res.status(404).redirect('/404')} );


const port = 3000;
app.listen(port, () => {
  console.log(`App started on port ${port}`);
});
