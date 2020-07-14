const express = require("express");
const router = express.Router();

const Task = require("../models/Task");
const Project = require("../models/Project");
const Lane = require("../models/Lane");

router.get("/", async (req, res) => {
  try {
    const task = await Task.find({});
    res.json(task);
  } catch {
    res.status(400).send("Can't get data");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("creator")
      .populate("assignees")
      .exec();
    res.json(task);
  } catch (err) {
    res.status(400).send("Can't get data\n" + err);
  }
});

router.post("/", async (req, res) => {
  try {
    // const task = new Task({
    //   creator: req.body.creator,
    //   assignee: req.body.assignee,
    //   name: req.body.name,
    //   description: req.body.description,
    //   difficult: req.body.difficult,
    //   status: req.body.status,
    //   dueDate: req.body.dueDate,
    // });
    // const newTask = await task.save();

    const lane = await Lane.findById(req.body.laneId);
    // project.lanes[index].tasks.push(newTask.id);
    lane.tasks.push(req.body.taskId);

    await lane.save();

    res.status(201).json(lane);
  } catch (err) {
    res.status(400).send("Created Fail\n" + err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    const deletedTask = await task.remove();

    const project = await Project.findOne({
      tasks: deletedTask.id,
    });

    const index = project.tasks.indexOf(deletedTask.id);
    project.tasks.splice(index, 1);

    await project.save();

    res.status(200).json(deletedTask.id);
  } catch (err) {
    res.status(400).send("Deleted Fail\n" + err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    task.assignees = req.body.owner || task.assignees;
    task.name = req.body.name || task.name;

    await task.save();
    res.status(200).send("Updated Successfully");
  } catch (err) {
    res.status(400).send("Updated Fail\n" + err);
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    const dateAccept = req.body.dateAccept;
    const dueDate = req.body.dueDate;
    const status = req.body.status;

    if (status && status !== -1) {
      task.status = status;
    } else {
      const deletedTask = await task.remove();
      return res.status(200).json(deletedTask.id);
    }

    if (dateAccept) task.dateAccept = dateAccept;
    if (dueDate) task.dueDate = dueDate;

    const newTask = await task.save();
    res.status(200).json({ id: newTask.id, status: newTask.status });
  } catch (err) {
    res.status(400).send("Updated Fail\n" + err);
  }
});

module.exports = router;
