var express = require("express");
const isAuth = require("../middlewares/auth");
const User = require("../models/User");
var router = express.Router();
const Task = require("../models/Task");
const mongoose = require("mongoose");

/* GET home page. */
router.get("/task", isAuth, function (req, res, next) {
  let isLogin = false;
  if (req.session.userid) {
    isLogin = true;
  }
  let userId = req.session.userid;

  Task.find({
    user_id: { $eq: userId },
  })
    .lean()
    .then((result) => {
      let countTask = result.length;
      console.log(result);
      //let titles = result.map((task) => task.title);
      //let descriptions = result.map((task) => task.description);

      //console.log(titles);
      //console.log(descriptions);
      console.log(result[0]);
      res.render("task", {
        task: result,
        isLogin: isLogin,
        countTask: countTask,
      });
    })
    .catch((err) => {
      next(err);
    });
});

router.get("/add-task", isAuth, function (req, res, next) {
  let isLogin = false;
  if (req.session.userid) {
    isLogin = true;
  }
  res.render("add-task", { isLogin: isLogin });
});
router.post("/add-task", isAuth, function (req, res, next) {
  let { title, description } = req.body;
  if (!title || !description) {
    return res.render("add-task", {
      error: "please fill up all the fields",
      isError: true,
      isLogin: isLogin,
    });
  }
  let task = Task({
    ...req.body,
    user_id: mongoose.Types.ObjectId(req.session.userid),
  });

  task
    .save()
    .then((result) => {
      res.redirect("/task");
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
