const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  lanes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lane",
    },
  ],
  roles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
    },
  ],
  createAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

// Duplicate the ID field.
projectSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
projectSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("Project", projectSchema);
