const mongoose = require("mongoose");

const laneSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
    default: "linear-gradient(-225deg, #A445B2 0%, #D41872 52%, #FF0066 100%)",
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
