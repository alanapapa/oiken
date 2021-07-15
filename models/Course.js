const mongoose = require("mongoose");
const slugify = require("slugify");
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // author: {
  //     type: Schema.Types.ObjectId,
  //     ref: 'User'
  // },
  details: {
    duration: {
      period: String,
      quantity: Number,
    },
    subj: String,
    lectures: { type: Number, default: 0, min: 0 },
    quizzes: { type: Number, default: 0, min: 0 },
    certificate: { type: Boolean, default: false },
    // lang: { type: Schema.Types.ObjectId, ref: 'Language' },
    price: { type: Number, default: 0 },
  },
  slug: {
    type: String,
    unique: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }
});

CourseSchema.pre("validate", function (next) {
  this.slug = slugify(this.name, {
    lower: true,
    strict: true,
  });
  next();
});

const Course = mongoose.model("Course", CourseSchema);
module.exports = Course;
