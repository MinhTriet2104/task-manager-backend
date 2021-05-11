const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  assignees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
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
    required: true,
  },
  status: {
    type: Number,
    required: true,
    default: 1,
    min: 1,
    max: 4,
  },
  difficult: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  list: {
    type: Array,
    default: [],
  },
  complete: {
    type: Boolean,
    required: true,
    default: false,
  },
});

// Duplicate the ID field.
taskSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
taskSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("Task", taskSchema);
