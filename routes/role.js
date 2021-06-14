const express = require("express");
const router = express.Router();

const Role = require("../models/Role");
const Project = require("../models/Project");

router.get("/", async (req, res) => {
  try {
    const role = await Role.find({});
    res.json(role);
  } catch {
    res.status(400).send("Can't get data");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    res.json(role);
  } catch (err) {
    res.status(400).send("Can't get data\n" + err);
  }
});

router.post("/", async (req, res) => {
  try {
    const role = new Role({
      name: req.body.name,
      user: req.body.user,
    });
    const newRole = await role.save();

    const project = await Project.findById(req.body.projectId);
    project.roles.push(newRole);

    await project.save();

    res.status(201).send("Created Successfully");
  } catch (err) {
    res.status(400).send("Created Fail\n" + err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    const project = await Project.findById(req.body.projectId);

    project.members = project.members.filter(
      (member) => member.id !== role.user
    );
    project.roles = project.roles.filter(
      (projectRole) => projectRole.id !== role.id
    );
    if (project.removedMembers && project.removedMembers.length >= 0) {
      project.removedMembers.push(role.user);
    } else {
      project.removedMembers = [role.user];
    }

    project.markModified("members");
    project.markModified("roles");
    project.markModified("removedMembers");

    await project.save();

    await role.remove();
    res.send("Deleted Successfully");
  } catch (err) {
    res.status(400).send("Deleted Fail\n" + err);
  }
});

// router.put("/:id", async (req, res) => {
//   try {
//     const task = await Task.findById(req.params.id);

//     task.assignees = req.body.owner || task.assignees;
//     task.name = req.body.name || task.name;

//     await task.save();
//     res.status(200).send("Updated Successfully");
//   } catch (err) {
//     res.status(400).send("Updated Fail\n" + err);
//   }
// });

router.patch("/:id", async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);

    const name = req.body.dateAccept;
    if (name) role.name = name;

    await role.save();
    res.status(200).send("Updated Successfully");
  } catch (err) {
    res.status(400).send("Updated Fail\n" + err);
  }
});

module.exports = router;
