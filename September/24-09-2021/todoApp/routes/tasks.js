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
      console.log(countTask);

      //let titles = result.map((task) => task.title);
      //let descriptions = result.map((task) => task.description);

      //console.log(titles);
      //console.log(descriptions);

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
  let isLogin = false;
  if (req.session.userid) {
    isLogin = true;
  }
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

router.get("/delete/:id", function (req, res, next) {
  let task_id = req.params.id;
  Task.deleteOne({ _id: task_id })
    .then(() => {
      res.redirect("/task");
    })
    .catch((err) => {
      next(err);
    });
});

router.get("/edit-task/:id", function (req, res, next) {
  let isLogin = false;
  if (req.session.userid) {
    isLogin = true;
  }
  let task_id = req.params.id;
  Task.findOne({ _id: task_id })
    .then((task) => {
      console.log(task);
      let title = task.title;
      let description = task.description;
      let id = task._id;
      res.render("edit-task", {
        isLogin: isLogin,
        title: title,
        description: description,
        id: id,
      });
    })
    .catch((err) => {
      next(err);
    });
});

router.post("/edit-task/:id", function (req, res, next) {
  let taskid = req.params.id;
  let title = req.body.title;
  let description = req.body.description;
  let userid = req.session.userid;
  Task.findOneAndUpdate(
    { _id: taskid },
    { title: title, description: description, user_id: userid }
  )
    .then(() => {
      res.redirect("/task");
    })
    .catch((err) => {
      next(err);
    });
});
module.exports = router;
