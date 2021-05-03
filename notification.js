const webpush = require("web-push");
const moment = require("moment");

const User = require("./models/User");

const NotificationHandler = {
  addTaskNotification: async function (userId, task, project) {
    const user = await User.findById(userId);
    const pushSubscription = user.pushSubscription;

    if (!pushSubscription) return;

    console.log(pushSubscription);

    webpush
      .sendNotification(
        pushSubscription,
        JSON.stringify({
          title: `New Task Coming!`,
          text: `You receive new Task name: ${task.name}, on Project ${
            project.name
          }. Deadline: ${moment(task.dueDate).format("DD/MM/YYYY hh:mm")}`,
          image:
            "https://scontent-hkt1-1.xx.fbcdn.net/v/t1.6435-9/152044644_10220763307375627_3332272147721777657_n.jpg?_nc_cat=110&ccb=1-3&_nc_sid=09cbfe&_nc_ohc=p-V7VlIeTxcAX_wqAwy&_nc_ht=scontent-hkt1-1.xx&oh=7e3941e16d47ce86db76ff288b6b05e0&oe=60B3EF9D",
          tag: "new-task",
          url: `/project/${project.id}`,
        })
      )
      .catch((err) => {
        console.log(err);
      });
  },
};

module.exports = NotificationHandler;
