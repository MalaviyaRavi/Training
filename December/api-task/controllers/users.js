const CsvMetaData = require("../models/csvMetaData")

exports.getLogin = function (req, res, next) {
  if (req.cookies.authToken) {
    return res.redirect("/users");
  }
  res.render("pages/login");
};

exports.getUsers = async function (req, res, next) {
  let files = await CsvMetaData.aggregate([{
      $lookup: {
        from: "users",
        let: {
          userId: "$uploadBy",

        },
        pipeline: [{
            $match: {
              $expr: {
                $and: [{
                  $eq: ["$_id", "$$userId"]
                }, ]
              }
            }
          },
          {
            $project: {
              email: 1,
              _id: 0
            }
          }
        ],
        as: "uploadBy"
      }
    },
    {
      $project: {
        Name: 1,
        status: 1,
        uploadBy: {
          $arrayElemAt: ["$uploadBy", 0]
        },
      }
    }


  ])

  console.log(files);
  res.render("pages/users", {
    files
  });
};