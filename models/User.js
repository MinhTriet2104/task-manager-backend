const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  oauth2Id: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    // required: true,
  },
  password: {
    type: String,
    // required: true,
  },
  username: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: "https://i.imgur.com/5bh5qpe.jpg",
  },
  createAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  pushSubscription: {
    type: Object,
  },
});

// Duplicate the ID field.
userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
userSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("User", userSchema);
