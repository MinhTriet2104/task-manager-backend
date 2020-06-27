const express = require("express");
const router = express.Router();

const User = require("../models/User");

router.get("/", async (req, res) => {
  try {
    const user = await User.find({});
    res.json(user);
  } catch {
    res.status(400).send("Can't get data");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(400).send("Can't get data\n" + err);
  }
});

router.post("/", async (req, res) => {
  try {
    const user = new User({
      email: req.body.email,
      password: req.body.password,
      username: req.body.username,
    });
    await user.save();

    res.status(201).send("Created Successfully");
  } catch (err) {
    res.status(400).send("Created Fail\n" + err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    await user.remove();
    res.send("Deleted Successfully");
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

// router.patch("/:id", async (req, res) => {
//   try {
//     const task = await Task.findById(req.params.id);

//     const dateAccept = req.body.dateAccept;
//     const dueDate = req.body.dueDate;
//     const status = req.body.status;

//     if (dateAccept) task.dateAccept = dateAccept;
//     if (dueDate) task.dueDate = dueDate;
//     if (status) task.status = status;

//     await task.save();
//     res.status(200).send("Updated Successfully");
//   } catch (err) {
//     res.status(400).send("Updated Fail\n" + err);
//   }
// });

module.exports = router;
