const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SubscriberSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  }
});

const Subscriber = mongoose.model("Subscriber", SubscriberSchema);
module.exports = Subscriber;
