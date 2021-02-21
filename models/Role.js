const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: "member",
  },
  level: {
    type: Number,
    required: true,
    default: 0,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  isOwner: {
    type: Boolean,
    default: false,
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
