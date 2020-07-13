const mongoose = require("mongoose");

const laneSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
  createAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

// Duplicate the ID field.
laneSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
laneSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("Lane", laneSchema);
