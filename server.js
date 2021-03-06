// .env
require("dotenv").config();

// Declare variable
const express = require("express");
const app = express();
const cors = require("cors"); // cors
const mongoose = require("mongoose");

// Connect database
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("Database connected"))
  .catch((err) => console.log("Database connect error: " + err));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ extended: true }));
app.use(
  cors({
    origin: "*", // allow to server to accept request from different origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // allow session cookie from browser to pass through
  })
);

// Router
const projectRouter = require("./routes/project");
const laneRouter = require("./routes/lane");
const taskRouter = require("./routes/task");
const roleRouter = require("./routes/role");
const userRouter = require("./routes/user");
const messageRouter = require("./routes/message");
const subscriptionRouter = require("./routes/subscription");

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/project", projectRouter);
app.use("/lane", laneRouter);
app.use("/task", taskRouter);
app.use("/role", roleRouter);
app.use("/user", userRouter);
app.use("/message", messageRouter);
app.use("/subscription", subscriptionRouter);

// Not found route
app.get("*", (req, res) => res.status(404).send("404 Not Found"));

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = process.env.DEV_MODE ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ error: { message: err.message, code: err.code } });
});

// Running
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server is running on port ${port}`));
