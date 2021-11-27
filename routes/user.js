const express = require("express");
const router = express.Router();

const User = require("../models/User");

router.get("/", async (req, res) => {
  try {
    const page = +req.query.page;
    const perPage = +req.query.perPage;
    const keyword = req.query.keyword;

    const skip = perPage * (page - 1);
    const limit = perPage * page;

    let user;
    if (keyword === "") {
      user = await User.find({}).sort("-time").skip(skip).limit(limit).exec();
    } else {
      user = await User.find({ email: { $regex: keyword, $options: "i" } })
        .sort("-time")
        .skip(skip)
        .limit(limit)
        .exec();
    }
    const totalItems = await User.countDocuments({}).exec();

    res.json({ user: user, totalItems: totalItems });
  } catch (err) {
    res.status(400).send("Can't get data\n" + err);
  }
});

router.get("/:id/login", async (req, res) => {
  try {
    let user = await User.findOne({ oauth2Id: req.params.id }).exec();

    return res.json(user);
  } catch (err) {
    res.status(400).send("Can't get data\n" + err);
  }
});

router.get("/:id/notification", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    return res.json(user.notifications);
  } catch (err) {
    res.status(400).send("Can't get data\n" + err);
  }
});

router.post("/:id/notification", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    user.notifications = req.body.notifications;
    await user.save();

    return res.status(200).send();
  } catch (err) {
    res.status(400).send("Can't get data\n" + err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    let user = await User.find({ oauth2Id: req.params.id }).exec();
    user = user[0];
    if (!user) {
      user = await User.findById(req.params.id);
    }

    return res.json(user);
  } catch (err) {
    res.status(400).send("Can't get data\n" + err);
  }
});

router.post("/", async (req, res) => {
  try {
    const user = new User({
      oauth2Id: req.body.oauth2Id,
      username: req.body.username,
      email: req.body.email,
      avatar: req.body.avatar,
    });
    const newUser = await user.save();

    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).send("Created Fail\n" + err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    // await user.remove();
    // res.send("Deleted Successfully");
  } catch (err) {
    res.status(400).send("Deleted Fail\n" + err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    user.email = req.body.email || user.email;
    user.password = req.body.password || user.password;
    user.username = req.body.username || user.username;

    await user.save();
    res.status(200).send("Updated Successfully");
  } catch (err) {
    res.status(400).send("Updated Fail\n" + err);
  }
});

router.patch("/:id/relogin", async (req, res) => {
  try {
    let user = await User.find({ oauth2Id: req.params.id }).exec();
    user = user[0];
    user.username = req.body.username || user.username;
    user.avatar = req.body.avatar || user.avatar;

    const updatedUser = await user.save();
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(400).send("Updated Fail\n" + err);
  }
});

router.patch("/:id/edit", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    user.username = req.body.username;
    user.isAdmin = req.body.isAdmin;

    const savedUser = await user.save();

    res.status(200).json(savedUser);
  } catch (err) {
    res.status(400).send("Updated Fail\n" + err);
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    const notifications = req.body.notifications;

    if (notifications) user.notifications = notifications;

    const savedUser = await user.save();

    res.status(200).json(savedUser);
  } catch (err) {
    res.status(400).send("Updated Fail\n" + err);
  }
});

module.exports = router;
