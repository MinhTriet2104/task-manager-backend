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
    const task = new Task({
      creator: req.body.creator,
      assignee: req.body.assignee,
      name: req.body.name,
      description: req.body.description,
      difficult: req.body.difficult,
      dueDate: req.body.dueDate,
    });
    const newTask = await task.save();

    const lane = await Lane.findById(req.body.laneId);
    // project.lanes[index].tasks.push(newTask.id);
    lane.tasks.push(newTask.id);

    await lane.save();

    res.status(201).json(newTask.id);
  } catch (err) {
    res.status(400).send("Created Fail\n" + err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    const deletedTask = await task.remove();

    const lane = await Lane.findById(req.body.laneId);

    const index = lane.tasks.indexOf(deletedTask.id);
    lane.tasks.splice(index, 1);

    await lane.save();

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
    const tasks = req.body.tasks;
    const srcLaneId = req.body.sourceLaneId;
    const targetLaneId = req.body.targetLaneId;

    if (dateAccept) task.dateAccept = dateAccept;
    if (dueDate) task.dueDate = dueDate;

    const newTask = await task.save();

    if (tasks && srcLaneId && targetLaneId) {
      const srcLane = await Lane.findById(srcLaneId);
      const targetLane = await Lane.findById(targetLaneId);

      if (srcLaneId !== targetLaneId) {
        const index = srcLane.tasks.indexOf(task.id);
        srcLane.tasks.splice(index, 1);
        await srcLane.save();
      }

      targetLane.tasks = tasks;
      await targetLane.save();
    }

    res.status(200).json(newTask.id);
  } catch (err) {
    res.status(400).send("Updated Fail\n" + err);
  }
});

module.exports = router;
