var express = require("express");
var router = express.Router();

var CountryModel = require("../model/country");
var StateModel = require("../model/state");
var CityModel = require("../model/city");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

/*


Country start


*/

//country form
router.get("/countryadd", function (req, res, next) {
  res.render("country/countryreg", { title: "Express" });
});
router.post("/countryadd", function (req, res, next) {
  const mybodydata = {
    c_name: req.body.cname,
  };
  var data = CountryModel(mybodydata);

  data.save(function (err) {
    if (err) {
      console.log("Error in Add Record" + err);
    } else {
      console.log("Record Added");
      res.send("Record Successfully Added");
    }
  });
});

// country display
router.get("/displaycountry", function (req, res, next) {
  CountryModel.find(function (err, data) {
    if (err) {
      console.log("Error in Fetch Data" + err);
    } else {
      console.log("Record Data is " + data);
      res.render("country/displaycountry", { mycountry: data });
    }
  }).lean();
});

//country delete
router.get("/deletec/:id", function (req, res, next) {
  var deleteid = req.params.id;
  CountryModel.findByIdAndDelete(deleteid, function (err, data) {
    if (err) {
      console.log("Error in Delete " + err);
    } else {
      console.log("Record Deleted " + deleteid);
      res.redirect("/displaycountry");
    }
  });
});

//country edit
router.get("/editcountry/:id", function (req, res, next) {
  var editid = req.params.id;
  CountryModel.findById(editid, function (err, data) {
    if (err) {
      console.log("Error in Edit" + err);
    } else {
      console.log(data);
      res.render("country/editcountry", { mycountry: data });
    }
  }).lean();
});
router.post("/editcountry/:id", function (req, res, next) {
  var editid = req.params.id;
  const mybodydata = {
    c_name: req.body.cname,
  };

  CountryModel.findByIdAndUpdate(editid, mybodydata, function (err, data) {
    if (err) {
      console.log("Error in Edit" + err);
    } else {
      console.log("Record Updated" + data);

      res.redirect("/displaycountry");
    }
  }).lean();
});

/*
state start
*/

//state form
router.get("/stateadd", function (req, res, next) {
  CountryModel.find(function (err, db_country_array) {
    if (err) {
      console.log("Error in Fetch Data " + err);
    } else {
      console.log(db_country_array);

      res.render("state/statereg", { mydata: db_country_array });
    }
  });
  //res.render('add-category');
});

router.post("/stateadd", function (req, res, next) {
  console.log(req.body);

  //Create an Array
  const mybodydata = {
    state_name: req.body.state_name,
    _country: req.body._country,
  };

  console.log("Name is " + req.body.state_name);
  console.log("ID is " + req.body._country);

  var data = StateModel(mybodydata);

  data.save(function (err) {
    if (err) {
      console.log("Error in Insert Record");
    } else {
      res.send("Data Added");
    }
  });
});

//state display
router.get("/displaystate", function (req, res, next) {
  StateModel.find(function (err, db_state_array) {
    console.log(db_state_array);

    if (err) res.json({ message: "There are no posts here." });

    StateModel.find({})
      .populate("_country")

      .exec(function (err, db_state_array) {
        console.log(db_state_array);

        res.render("state/displaystate", { state_array: db_state_array });
      });
  });
});

//state delete
router.get("/deletestate/:id", function (req, res) {
  StateModel.findByIdAndDelete(req.params.id, function (err, project) {
    if (err) {
      console.log("Error in Record Delete " + err);
      res.redirect("/display");
    } else {
      console.log(" Record Deleted ");
      res.redirect("/displaystate");
    }
  });
});

//state edit
router.get("/editstate/:id", function (req, res) {
  console.log(req.params.id);

  StateModel.findById(req.params.id, function (err, db_state_array) {
    if (err) {
      console.log("Edit Fetch Error " + err);
    } else {
      console.log(db_state_array);

      res.render("state/editstate", { state_array: db_state_array });
    }
  });
});
router.post("/editstate/:id", function (req, res) {
  console.log("Edit ID is" + req.params.id);

  const mybodydata = {
    state_name: req.body.state_name,
    _country: req.body._country,
  };

  StateModel.findByIdAndUpdate(req.params.id, mybodydata, function (err) {
    if (err) {
      console.log("Error in Record Update");
      res.redirect("/state/displaystate");
    } else {
      res.redirect("/displaystate");
    }
  });
});

/*
city start

*/

//city form
router.get("/cityadd", function (req, res, next) {
  StateModel.find(function (err, db_state_array) {
    if (err) {
      console.log("Error in Fetch Data " + err);
    } else {
      //Print Data in Console
      console.log(db_state_array);

      CountryModel.find(function (err, db_country_array) {
        if (err) {
          console.log("Error in Fetch Data " + err);
        } else {
          //Print Data in Console
          console.log(db_country_array);
          //Render User Array in HTML Table
          return res.render("city/cityreg", {
            mydata: db_state_array,
            mycountry: db_country_array,
          });
        }
      });
    }
  });
  //res.render('add-category');
});

router.post("/cityadd", function (req, res, next) {
  //Create an Array
  const mybodydata = {
    city_name: req.body.city_name,
    _state: req.body._state,
    _country: req.body._country,
  };

  var data = CityModel(mybodydata);

  data.save(function (err) {
    if (err) {
      console.log("Error in Insert Record");
    } else {
      res.send("Data Added");
    }
  });
});

//city display
router.get("/displaycity", function (req, res, next) {
  CityModel.find(function (err, db_city_array) {
    console.log(db_city_array);

    if (err) res.json({ message: "There are no posts here." });

    CityModel.find({})
      .populate("_state")

      .exec(function (err, db_city_array) {
        console.log(db_city_array);

        res.render("city/displaycity", { city_array: db_city_array });
      });
  });
});

//city delete
router.get("/deletecity/:id", function (req, res) {
  CityModel.findByIdAndDelete(req.params.id, function (err, project) {
    if (err) {
      console.log("Error in Record Delete " + err);
      res.redirect("/display");
    } else {
      console.log(" Record Deleted ");
      res.redirect("/displaycity");
    }
  });
});

//city edit
router.get("/editcity/:id", function (req, res) {
  console.log(req.params.id);

  CityModel.findById(req.params.id, function (err, db_city_array) {
    if (err) {
      console.log("Edit Fetch Error " + err);
    } else {
      console.log(db_city_array);

      res.render("city/editcity", { city_array: db_city_array });
    }
  });
});
router.post("/editcity/:id", function (req, res) {
  console.log("Edit ID is" + req.params.id);

  const mybodydata = {
    city_name: req.body.city_name,
    _state: req.body._state,
    _country: req.body._country,
  };

  CityModel.findByIdAndUpdate(req.params.id, mybodydata, function (err) {
    if (err) {
      console.log("Error in Record Update");
      res.redirect("/city/displaycity");
    } else {
      res.redirect("/displaycity");
    }
  });
});

module.exports = router;
