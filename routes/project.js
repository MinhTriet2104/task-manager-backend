const express = require("express");
const router = express.Router();

const Project = require("../models/Project");
const Role = require("../models/Role");
const User = require("../models/User");

router.get("/", async (req, res) => {
  try {
    const projects = await Project.find({});
    res.json(projects);
  } catch {
    res.status(400).send("Can't get data");
  }
});

// Get user project
router.get("/user/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const projects = await Project.find({ members: userId }).exec();
    res.json(projects);
  } catch {
    res.status(400).send("Can't get data");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("owner")
      .populate("members")
      .populate("roles")
      .populate({
        path: "lanes",
        populate: {
          path: "tasks",
          populate: [
            {
              path: "assignees",
              model: User,
            },
            {
              path: "creator",
              model: User,
            },
          ],
        },
      })
      .exec();
    res.json(project);
  } catch (err) {
    res.status(400).send("Can't get data\n" + err);
  }
});

router.post("/", async (req, res) => {
  const project = new Project({
    name: req.body.name,
    owner: req.body.owner,
  });
  project
    .save()
    .then(() => res.status(201).json({ id: project.id }))
    .catch((err) => res.status(400).send("Created Fail\n" + err));
});

router.post("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) res.status(404).send();
    else res.status(200).send();
  } catch {
    res.status(404).send();
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    await project.remove();
    res.send("Deleted Successfully");
  } catch (err) {
    res.status(400).send("Deleted Fail\n" + err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    project.name = req.body.name || project.name;
    project.owner = req.body.owner || project.owner;

    await project.save();
    res.status(200).send("Updated Successfully");
  } catch (err) {
    res.status(400).send("Updated Fail\n" + err);
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    const lanes = project.lanes;

    const lastIndex = req.body.lastIndex;
    const newIndex = req.body.newIndex;

    [lanes[lastIndex], lanes[newIndex]] = [lanes[newIndex], lanes[lastIndex]];
    project.markModified("lanes");

    await project.save();
    res.status(200).send("Updated Successfully");
  } catch (err) {
    res.status(400).send("Updated Fail\n" + err);
  }
});

router.patch("/roles/:id", async (req, res) => {
  try {
    const reqRoles = req.body.roles;

    reqRoles.forEach(async (reqRole) => {
      const role = await Role.findById(reqRole.id);
      role.level = reqRole.level;

      await role.save();
    });

    res.status.send(200);
  } catch (err) {
    console.log(err);
    res.status(404).send();
  }
});

module.exports = router;
