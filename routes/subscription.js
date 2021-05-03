const express = require("express");
const router = express.Router();

const crypto = require("crypto");
const webpush = require("web-push");

const User = require("../models/User");

const subscriptions = {};
const vapidKeys = {
  privateKey: "7GVY1ikHIcksy6CXs5AiL0Fp-x9nvGoVVQgnLwgq0WI",
  publicKey:
    "BC0HbCVa2teiohQY-mAOcerBCZNitvdbit9bIg7EzAKmxhZOxZi-wsUTLGv3XsvVgpb1qDF91x9E8OBhqySVKME",
};

webpush.setVapidDetails(
  "mailto:example@yourdomain.org",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

function createHash(input) {
  const md5sum = crypto.createHash("md5");
  md5sum.update(Buffer.from(input));
  return md5sum.digest("hex");
}

async function addTaskNotification(pushSubscription) {
  webpush
    .sendNotification(
      pushSubscription,
      JSON.stringify({
        title: "New Product Available ",
        text: "HEY! Take a look at this brand new t-shirt!",
        image: "/images/jason-leung-HM6TMmevbZQ-unsplash.jpg",
        tag: "new-product",
        url: "/new-product-jason-leung-HM6TMmevbZQ-unsplash.html",
      })
    )
    .catch((err) => {
      console.log(err);
    });
}

router.get("/:id", async (req, res) => {
  const userId = req.params.id;

  const user = await User.findById(userId);
  const pushSubscription = user.pushSubscription;

  webpush
    .sendNotification(
      pushSubscription,
      JSON.stringify({
        title: "You Have New Task!!!",
        text: "HEY! Take a look at this brand new t-shirt!",
        image: "/images/jason-leung-HM6TMmevbZQ-unsplash.jpg",
        tag: "new-product",
        url: "/new-product-jason-leung-HM6TMmevbZQ-unsplash.html",
      })
    )
    .catch((err) => {
      console.log(err);
    });

  res.status(202).json({});
});

router.post("/", async (req, res) => {
  const userId = req.body.userId;
  const subscriptionRequest = req.body.data;
  
  const user = await User.findById(userId);
  user.pushSubscription = subscriptionRequest;

  const savedUser = await user.save();

  res.status(201).json({ id: savedUser.id, user: savedUser });
});

module.exports = router;
