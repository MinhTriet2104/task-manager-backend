const express = require("express");
const router = express.Router();

const Lane = require("../models/Lane");
const Project = require("../models/Project");

router.get("/", async (req, res) => {
  try {
    const lane = await Lane.find({});
    res.status(200).json(lane);
  } catch {
    res.status(400).send("Can't get data");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const lane = await Lane.findById(req.params.id);
    res.status(200).json(lane);
  } catch (err) {
    res.status(400).send("Can't get data\n" + err);
  }
});

router.post("/", async (req, res) => {
  try {
    const lane = new Lane({
      name: req.body.name.toUpperCase(),
    });
    const newLane = await lane.save();

    const project = await Project.findById(req.body.projectId);
    project.lanes.push(newLane.id);

    await project.save();

    res.status(201).json(newLane);
  } catch (err) {
    res.status(400).send("Created Fail\n" + err);
  }
});

// router.delete("/:id", async (req, res) => {
//   try {
//     const task = await Task.findById(req.params.id);
//     const deletedTask = await task.remove();

//     const project = await Project.findOne({
//       tasks: deletedTask.id,
//     });

//     const index = project.tasks.indexOf(deletedTask.id);
//     project.tasks.splice(index, 1);

//     await project.save();

//     res.status(200).json(deletedTask.id);
//   } catch (err) {
//     res.status(400).send("Deleted Fail\n" + err);
//   }
// });

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

// router.patch("/:id", async (req, res) => {
//   try {
//     const task = await Task.findById(req.params.id);

//     const dateAccept = req.body.dateAccept;
//     const dueDate = req.body.dueDate;
//     const status = req.body.status;

//     if (dateAccept) task.dateAccept = dateAccept;
//     if (dueDate) task.dueDate = dueDate;
//     if (status) task.status = status;

//     const newTask = await task.save();
//     res.status(200).json({ id: newTask.id, status: newTask.status });
//   } catch (err) {
//     res.status(400).send("Updated Fail\n" + err);
//   }
// });

module.exports = router;