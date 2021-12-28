var express = require('express');
var router = express.Router();
const formidable = require('formidable');
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

router.post("/", function (req, res, next) {
  const form = formidable({
    multiples: true,
    uploadDir: __dirname
  });
  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }
    console.log(JSON.stringify({
      fields,
      files
    }, null, 2));
    // res.end();
    // res.json({
    //   type: 'successs'
    // });
  });
})

module.exports = router;