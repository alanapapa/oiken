const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ModuleSchema = new Schema({
    title: {
      type: String,
      default: "New Module"
    },
    cont: {
      type: String
    },
    course_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
});




const Module = mongoose.model("Module", ModuleSchema);
module.exports = Module;
