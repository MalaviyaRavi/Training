const mongoose = require("mongoose");

//models
const Post = require("../models/post");

exports.index = async function (req, res, next) {
  try {
    res.render("index", { title: "Chart Project" });
  } catch (error) {
    next(error);
  }
};

//generate X - axis data
function getXAxis(unit) {
  let today = new Date();
  let xAxis = [];
  if (unit == "hourly") {
    let currentHour = today.getHours();
    if (currentHour < 10) {
      currentHour = "0" + currentHour;
    }
    xAxis = [currentHour.toString()];
    for (let i = 1; i < 7; i++) {
      let newDate = new Date(today.setHours(today.getHours() - 1));
      let hour = newDate.getHours();
      if (hour < 10) {
        hour = "0" + hour;
      }
      xAxis.push(hour.toString());
    }
  } else if (unit == "daily") {
    let currentDay = today.getDate();
    if (currentDay < 10) {
      currentDay = "0" + currentDay.toString();
    }
    xAxis = [currentDay + "-" + String(today.getMonth() + 1)];
    for (let i = 1; i < 7; i++) {
      let newDate = new Date(today.setDate(today.getDate() - 1));
      let newDay = newDate.getDate();
      if (newDay < 10) {
        newDay = "0" + newDay.toString();
      }
      xAxis.push(newDay + "-" + String(newDate.getMonth() + 1));
    }
  } else if (unit == "monthly") {
    xAxis = [today.getMonth() + 1 + "-" + today.getFullYear()];
    for (let i = 1; i < 7; i++) {
      let newDate = new Date(today.setMonth(today.getMonth() - 1));
      let newMonth = newDate.getMonth() + 1;
      if (newMonth < 10) {
        newMonth = "0" + newMonth.toString();
      }
      xAxis.push(newMonth + "-" + newDate.getFullYear());
    }
  } else if (unit == "yearly") {
    for (let i = 0; i < 7; i++) {
      let newDate = new Date(today.setFullYear(today.getFullYear() - 1));
      xAxis.push(String(newDate.getFullYear() + 1));
    }
  }
  return xAxis;
}

exports.chart = async function (req, res, next) {
  try {
    let { chartBy } = req.params;
    let xAxis = getXAxis(chartBy);
    let data = [];

    let tillThen = {
      hourly: 1000 * 60 * 60 * 7,
      daily: 1000 * 60 * 60 * 24 * 7,
      monthly: 1000 * 60 * 60 * 24 * 30 * 7,
      yearly: 1000 * 60 * 60 * 24 * 30 * 12 * 7,
    };

    let query = [
      {
        $match: {
          postOn: {
            $gt: new Date(new Date().getTime() - tillThen[chartBy]),
          },
        },
      },
    ];

    if (chartBy == "hourly") {
      query.push({
        $group: {
          _id: {
            hour: { $hour: { date: "$postOn" } },
          },
          postOn: {
            $first: { $dateToString: { format: "%H", date: "$postOn" } },
          },
          totalPosts: { $sum: 1 },
        },
      });
    } else if (chartBy == "daily") {
      query.push({
        $group: {
          _id: {
            day: { $dayOfMonth: { date: "$postOn", timezone: "Asia/Kolkata" } },
          },
          postOn: {
            $first: { $dateToString: { format: "%d-%m", date: "$postOn" } },
          },
          totalPosts: { $sum: 1 },
        },
      });
    } else if (chartBy == "monthly") {
      query.push({
        $group: {
          _id: {
            month: { $month: { date: "$postOn", timezone: "Asia/Kolkata" } },
          },
          postOn: {
            $first: { $dateToString: { format: "%m-%Y", date: "$postOn" } },
          },
          totalPosts: { $sum: 1 },
        },
      });
    } else if (chartBy == "yearly") {
      query.push({
        $group: {
          _id: {
            year: { $year: { date: "$postOn", timezone: "Asia/Kolkata" } },
          },
          postOn: {
            $first: { $dateToString: { format: "%Y", date: "$postOn" } },
          },
          totalPosts: { $sum: 1 },
        },
      });
    }

    query.push.apply(query, [
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          postCounts: "$totalPosts",
          postOn: 1,
          _id: 0,
        },
      },
      {
        $group: {
          _id: null,
          stats: { $push: "$$ROOT" },
        },
      },
      {
        $project: {
          stats: {
            $map: {
              input: xAxis,
              as: "date",
              in: {
                $let: {
                  vars: {
                    dateIndex: { $indexOfArray: ["$stats.postOn", "$$date"] },
                  },
                  in: {
                    $cond: {
                      if: { $ne: ["$$dateIndex", -1] },
                      then: { $arrayElemAt: ["$stats", "$$dateIndex"] },
                      else: { postCounts: 0 },
                    },
                  },
                },
              },
            },
          },
        },
      },
    ]);

    let postStatistics = await Post.aggregate(query);

    if (postStatistics.length) {
      for (const unit of postStatistics[0].stats) {
        data.push(unit.postCounts);
      }
    }
    res.json({ type: "success", xAxis, data });
  } catch (error) {
    console.log(error);
    res.json({ type: "error", message: "something went wrong" });
  }
};

// exports.chart = async function (req, res, next) {
//   try {
//     let { chartBy } = req.params;

//     let tillThen = {
//       hourly: 1000 * 60 * 60 * 7,
//       daily: 1000 * 60 * 60 * 24 * 7,
//       monthly: 1000 * 60 * 60 * 24 * 30 * 7,
//       yearly: 1000 * 60 * 60 * 24 * 30 * 12 * 7,
//     };

//     let query = [
//       {
//         $match: {
//           postOn: {
//             $gt: new Date(new Date().getTime() - tillThen[chartBy]),
//           },
//         },
//       },
//     ];

//     if (chartBy == "hourly") {
//       query.push({
//         $group: {
//           _id: {
//             hour: { $hour: { date: "$postOn" } },
//           },
//           postOn: {
//             $first: {
//               $dateToString: {
//                 format: "%H",
//                 date: "$postOn",
//               },
//             },
//           },
//           totalPosts: { $sum: 1 },
//         },
//       });
//       query.push({ $sort: { "_id.hour": -1 } });
//     } else if (chartBy == "daily") {
//       query.push({
//         $group: {
//           _id: {
//             day: { $dayOfMonth: { date: "$postOn", timezone: "Asia/Kolkata" } },
//           },
//           postOn: {
//             $first: { $dateToString: { format: "%d-%m", date: "$postOn" } },
//           },
//           totalPosts: { $sum: 1 },
//         },
//       });
//       query.push({ $sort: { "_id.day": -1 } });
//     } else if (chartBy == "monthly") {
//       query.push({
//         $group: {
//           _id: {
//             month: { $month: { date: "$postOn", timezone: "Asia/Kolkata" } },
//           },
//           postOn: {
//             $first: { $dateToString: { format: "%m-%Y", date: "$postOn" } },
//           },
//           totalPosts: { $sum: 1 },
//         },
//       });
//       query.push({ $sort: { "_id.month": -1 } });
//     } else if (chartBy == "yearly") {
//       query.push({
//         $group: {
//           _id: {
//             year: { $year: { date: "$postOn", timezone: "Asia/Kolkata" } },
//           },
//           postOn: {
//             $first: { $dateToString: { format: "%Y", date: "$postOn" } },
//           },
//           totalPosts: { $sum: 1 },
//         },
//       });
//       query.push({ $sort: { "_id.year": -1 } });
//     }

//     let postStatistics = await Post.aggregate(query);
//     console.log(postStatistics);
//     res.json({ type: "success", postStatistics: postStatistics });
//   } catch (error) {
//     console.log(error);
//     res.json({ type: "error", message: "something went wrong" });
//   }
// };

exports.getPieChart = async function (req, res, next) {
  try {
    let query = [
      {
        $group: {
          _id: "$postBy",
          totalPosts: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "users",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$userId"],
                },
              },
            },
            { $project: { name: 1, _id: 0 } },
          ],
          as: "user",
        },
      },

      {
        $project: {
          user: { $arrayElemAt: ["$user", 0] },
          totalPosts: 1,
        },
      },
    ];

    let post = await Post.aggregate(query);
    res.json({ postStatistics: post });
  } catch (error) {
    console.log(error);
  }
};
