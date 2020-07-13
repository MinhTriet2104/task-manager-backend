const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: "member",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

// Duplicate the ID field.
roleSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
roleSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("Role", roleSchema);
