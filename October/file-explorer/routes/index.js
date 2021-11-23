const express = require("express");
const router = express.Router();

const fs = require("fs");

const path = require("path");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

let types = {
  media: ["mp4", "mkv"],
  archives: ["zip", "7z", "rar", "tar", "gz", "ar", "iso", "xz"],
  documents: [
    "docx",
    "doc",
    "pdf",
    "xlsx",
    "xls",
    "odt",
    "ods",
    "odp",
    "odg",
    "odf",
    "txt",
    "ps",
    "tex",
  ],
  app: ["exe", "dmg", "pkg", "deb"],
};

function getCategory(name) {
  let ext = path.extname(name);
  ext = ext.slice(1);
  for (let type in types) {
    let cTypeArray = types[type];
    for (let i = 0; i < cTypeArray.length; i++) {
      if (ext == cTypeArray[i]) {
        return type;
      }
    }
  }
  return "others";
}
let files = {};
let publicDirPath = path.join(__dirname, "..", "public");
function getAllFiles(publicDirPath) {
  let totalDirs = fs.readdirSync(publicDirPath);

  if()
}

router.get("/files", function (req, res, next) {
  try {
    res.json({ files });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
