const mongoose = require("mongoose");
const slugify = require("slugify");
const crypto = require("crypto");
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
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
  details: {
    duration: {
      period: String,
      quantity: Number,
    },
    subj: String,
    lectures: { type: Number, default: 0, min: 0 },
    quizzes: { type: Number, default: 0, min: 0 },
    certificate: { type: Boolean, default: false },
    price: { type: Number, default: 0 },
  },
  slug: {
    type: String,
    unique: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
});

CourseSchema.pre("validate", function (next) {
  const uniqSlug = this.name + '-' + crypto.randomBytes(2).toString("hex");
  this.slug = slugify(uniqSlug, {
    lower: true,
    strict: true
  });
  next();
});

const Course = mongoose.model("Course", CourseSchema);
module.exports = Course;
