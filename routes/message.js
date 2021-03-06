const express = require("express");
const router = express.Router();

// const Project = require("../models/Project");
// const User = require("../models/User");
const Message = require("../models/Message");

router.get("/", async (req, res) => {
  try {
    const projectId = req.body.projectId;

    const messages = await Message.find({ projectId });

    res.json(messages);
  } catch {
    res.status(400).send("Can't get data");
  }
});

// router.get("/:id", async (req, res) => {
//   try {
//     const project = await Project.findById(req.params.id)
//       .populate("owner")
//       .populate("roles")
//       .populate({
//         path: "lanes",
//         populate: {
//           path: "tasks",
//           populate: [
//             {
//               path: "assignee",
//               model: User,
//             },
//             {
//               path: "creator",
//               model: User,
//             },
//           ],
//         },
//       })
//       .exec();
//     res.json(project);
//   } catch (err) {
//     res.status(400).send("Can't get data\n" + err);
//   }
// });

// router.post("/", async (req, res) => {
//   const project = new Project({
//     name: req.body.name,
//     owner: req.body.owner,
//   });
//   project
//     .save()
//     .then(() => res.status(201).send("Created Successfully"))
//     .catch((err) => res.status(400).send("Created Fail\n" + err));
// });

// router.delete("/:id", async (req, res) => {
//   try {
//     const project = await Project.findById(req.params.id);
//     await project.remove();
//     res.send("Deleted Successfully");
//   } catch (err) {
//     res.status(400).send("Deleted Fail\n" + err);
//   }
// });

// router.put("/:id", async (req, res) => {
//   try {
//     const project = await Project.findById(req.params.id);

//     project.name = req.body.name || project.name;
//     project.owner = req.body.owner || project.owner;

//     await project.save();
//     res.status(200).send("Updated Successfully");
//   } catch (err) {
//     res.status(400).send("Updated Fail\n" + err);
//   }
// });

// router.patch("/:id", async (req, res) => {
//   try {
//     const project = await Project.findById(req.params.id);
//     const lanes = project.lanes;

//     const lastIndex = req.body.lastIndex;
//     const newIndex = req.body.newIndex;

//     [lanes[lastIndex], lanes[newIndex]] = [lanes[newIndex], lanes[lastIndex]];
//     project.markModified("lanes");

//     await project.save();
//     res.status(200).send("Updated Successfully");
//   } catch (err) {
//     res.status(400).send("Updated Fail\n" + err);
//   }
// });

module.exports = router;
