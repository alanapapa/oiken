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
  slugged: {
    type: Boolean,
    default: false,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  content: {
    type: String
  },
  publish: {
    type: Boolean,
    default: false
  },
  moduleCount: {
    type: Number,
    default: 1
  },
  module: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
    },
  ],
  image: String,
})

CourseSchema.pre("validate", function (next) {
  const course = this;
  if (course.slugged === false) {
    const uniqSlug = this.name + '-' + crypto.randomBytes(2).toString("hex");
    this.slug = slugify(uniqSlug, {
      lower: true,
      strict: true
    });
    course.slugged = true;
  }
  next();
});

const Course = mongoose.model("Course", CourseSchema);
module.exports = Course;
