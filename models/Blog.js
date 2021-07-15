const mongoose = require("mongoose");
const slugify = require("slugify");
const crypto = require("crypto");
const Schema = mongoose.Schema;

const BlogSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  slug: {
    type: String,
    unique: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CategoryBlog",
  },
});

BlogSchema.pre("validate", function (next) {
  const uniqSlug = this.title + "-" + crypto.randomBytes(2).toString("hex");
  this.slug = slugify(uniqSlug, {
    lower: true,
    strict: true,
  });
  next();
});

const Blog = mongoose.model("Blog", BlogSchema);
module.exports = Blog;
