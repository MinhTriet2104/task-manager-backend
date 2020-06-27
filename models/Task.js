const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  assignees: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  deliveryDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  dateAccept: {
    type: Date,
  },
  dueDate: {
    type: Date,
  },
  status: {
    type: String,
    required: true,
    default: "pending",
  },
  difficult: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
});

module.exports = mongoose.model("Task", taskSchema);
