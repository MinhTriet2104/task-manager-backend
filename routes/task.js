const express = require("express");
const moment = require("moment");
const router = express.Router();
const notificationHandler = require("../notification");

const Project = require("../models/Project");
const Task = require("../models/Task");
const User = require("../models/User");
const Comment = require("../models/Comment");
const Lane = require("../models/Lane");
const History = require("../models/History");

const PER_PAGE = 10;

router.get("/", async (req, res) => {
  try {
    const task = await Task.find({});
    res.json(task);
  } catch {
    res.status(400).send("Can't get data");
  }
});

router.get("/:id/comment", async (req, res) => {
  try {
    const page = +req.query.page;
    const cachedNewCmt = +req.query.cachedNewCmt;

    const skip = PER_PAGE * (page - 1) + cachedNewCmt;
    const limit = PER_PAGE * page + 1;

    const comments = await Comment.find({ taskId: req.params.id })
      .sort("-time")
      .skip(skip)
      .limit(limit)
      .populate("sender")
      .exec();

    let hasMoreCmt = false;
    if (comments.length > 10) {
      comments.length = 10;
      hasMoreCmt = true;
    }

    res.json({ comments: comments, hasMoreCmt: hasMoreCmt });
  } catch (err) {
    res.status(400).send("Can't get data\n" + err);
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

router.post("/:id/comment", async (req, res) => {
  try {
    let newComment = await Comment.create({ ...req.body.comment });
    newComment = await newComment.populate("sender").execPopulate();

    res.status(201).json(newComment);
  } catch (err) {
    res.status(400).send("Created Fail\n" + err);
  }
});

router.post("/", async (req, res) => {
  try {
    const project = req.body.project;

    const task = new Task({ ...req.body.task });
    const newTask = await task.save();

    const lane = await Lane.findById(req.body.laneId);
    // project.lanes[index].tasks.push(newTask.id);
    lane.tasks.push(newTask.id);

    await lane.save();

    newTask.assignees.forEach(async (assignee) => {
      try {
      // notificationHandler.addTaskNotification(assignee, newTask, project);

        const curUser = await User.findById(assignee);
        if (!curUser.notifications[project.id])
          curUser.notifications[project.id] = [];

        curUser.notifications[project.id].unshift({
          type: "add",
          taskId: newTask.id,
          createAt: moment(),
          seen: false,
        });
        
        curUser.notifications[project.id].unshift({
          type: "expire 1d",
          taskId: newTask.id,
          createAt: moment(newTask.dueDate).subtract(1, "days").calendar(),
          dueDate: newTask.dueDate,
          seen: false,
        });

        curUser.notifications[project.id].unshift({
          type: "expire 1h",
          taskId: newTask.id,
          createAt: moment(newTask.dueDate).subtract(1, "hours").calendar(),
          dueDate: newTask.dueDate,
          seen: false,
        });

        curUser.markModified('notifications');

        await curUser.save();
      } catch (err) {
        console.log(err);
      }
    });

    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).send("Created Fail\n" + err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    const comments = await Comment.find({ taskId: req.params.id });

    comments.forEach(cmt => cmt.remove());
    const deletedTask = await task.remove();

    const project = await Project.findOne({
      lanes: req.body.laneId,
    });

    const deletedTaskHistory = new History({
      user: req.body.userId,
      projectId: project.id,
      content: `deleted the Task: ${deletedTask.name}`
    });
    deletedTaskHistory.save();

    const lane = await Lane.findById(req.body.laneId);

    const index = lane.tasks.indexOf(deletedTask.id);
    lane.tasks.splice(index, 1);

    await lane.save();

    deletedTask.assignees.forEach(async assignee => {
      const curUser = await User.findById(assignee);

      const filteredNotification = curUser.notifications[project.id].filter(notify => notify.taskId !== deletedTask.id);
      curUser.notifications[project.id] = filteredNotification;

      curUser.markModified('notifications');
      curUser.save();
    });

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

router.patch("/:id/detail", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    for (let prop in req.body) {
      task[prop] = req.body[prop];
    }

    const newTask = await task.save();

    res.status(200).json(newTask.id);
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
