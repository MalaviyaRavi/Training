$(document).ready(function () {
  //get current location
  $("button#get-location").on("click", function (e) {
    event.preventDefault();
    navigator.geolocation.getCurrentPosition(function (position) {
      let latitude = position.coords.latitude;
      let longitude = position.coords.longitude;

      $.get(
        "/api/address/currentlocation/" + latitude + "/" + longitude + "",
        function ({ country, state, city }) {
          $("#country option[value=" + country._id + "]").attr(
            "selected",
            true
          );
          $("#state").html("");
          $("#state").append("<option value='' disabled>Select State</option>");
          $("#state").append("<option value='add'>add state</option>");

          for (let stateobj of country._states) {
            if (stateobj.statename == state.statename) {
              $("#state").append(
                "<option value=" +
                  stateobj._id +
                  " selected >" +
                  stateobj.statename +
                  "</option>"
              );
            } else {
              $("#state").append(
                "<option value=" +
                  stateobj._id +
                  ">" +
                  stateobj.statename +
                  "</option>"
              );
            }
          }

          $("#city").html("");
          $("#city").append("<option value='' disabled>Select city</option>");
          $("#city").append("<option value='add'>add city</option>");

          for (let cityobj of state._cities) {
            if (cityobj.cityname == city.cityname) {
              $("#city").append(
                "<option value=" +
                  cityobj._id +
                  " selected >" +
                  cityobj.cityname +
                  "</option>"
              );
            } else {
              $("#city").append(
                "<option value=" +
                  cityobj._id +
                  ">" +
                  cityobj.cityname +
                  "</option>"
              );
            }
          }
        }
      );
    });
  });

  //country dropdown change event
  $("#country").on("change", function (e) {
    let value = e.target.value;

    if (value == "add") {
      let countryname = prompt("Enter Country Name");

      if (!countryname) {
        return;
      }

      $.post("/api/address/countries", { countryname }, function (country) {
        $("#country").append(
          "<option value=" +
            country._id +
            " selected>" +
            country.countryname +
            "</option>"
        );
      });
    } else {
      $.get("/api/address/states/" + value + "", function ({ states }) {
        $("#state").html("");
        $("#state").append(
          "<option value='' selected disabled>Select State</option>"
        );
        $("#state").append("<option value='add'>add state</option>");

        if (states.length) {
          for (let state of states) {
            $("#state").append(
              "<option value=" + state._id + ">" + state.statename + "</option>"
            );
          }
        }
      });
    }
  });

  //state dropdown change event
  $("#state").on("change", function (e) {
    let value = e.target.value;
    if (value == "add") {
      let countryValue = $("#country").val();
      if (countryValue == "add" || countryValue == "") {
        alert("please first select country");
        return;
      }
      let stateName = prompt("Enter State Name");
      if (!stateName) {
        return;
      }

      let countryId = countryValue;
      $.post("/api/address/states", { stateName, countryId }, function (data) {
        $("#state").append(
          "<option value=" +
            data._id +
            " selected>" +
            data.statename +
            "</option>"
        );
      });
    } else {
      $.get("/api/address/cities/" + value + "", function ({ cities }) {
        $("#city").html("");
        $("#city").append(
          "<option value='' selected disabled>Select City</option>"
        );
        $("#city").append("<option value='add'>add city</option>");

        if (city.length) {
          for (let city of cities) {
            $("#city").append(
              "<option value=" + city._id + ">" + city.cityname + "</option>"
            );
          }
        }
      });
    }
  });

  //city dropdown change event
  $("#city").on("change", function (e) {
    let value = e.target.value.toLowerCase();
    if (value == "add") {
      let stateId = $("#state").val();
      let cityName = prompt("Enter City Name");
      if (!cityName) {
        return;
      }
      $.post("/api/address/cities", { cityName, stateId }, function (data) {
        $("#city").append(
          "<option value=" +
            data._id +
            " selected>" +
            data.cityname +
            "</option>"
        );
      });
    }
  });

  //Jquery Validate

  //password strength checker
  $.validator.addMethod("pwcheck", function (value) {
    return (
      /^[A-Za-z0-9\d=!\-@._*]*$/.test(value) && // consists of only these
      /[a-z]/.test(value) && // has a lowercase letter
      /\d/.test(value)
    ); // has a digit
  });

  //profile image type checker
  $.validator.addMethod("checkfiletype", function (value) {
    let extensions = ["jpg", "jpeg", "png"];
    let fileExtension = value.split(".")[1];
    return extensions.includes(fileExtension);
  });

  //mobile number check
  $.validator.addMethod(
    "checkMobile",
    function (value, element) {
      return /^[789]\d{9}$/.test(value);
    },
    "Please enter a valid phone number"
  );

  //validation
  let validate = $("#signup_form").validate({
    rules: {
      username: {
        required: true,
        minlength: 3,
      },
      email: {
        required: true,
        email: true,
        remote: {
          url: "/api/users/checkemail",
        },
      },
      password: {
        required: true,
        minlength: 8,
        pwcheck: true,
      },
      cpassword: {
        required: true,
        minlength: 8,
        equalTo: "#password",
      },
      gender: {
        required: true,
      },
      mobile: {
        required: true,
        checkMobile: true,
      },
      country: {
        required: true,
      },
      state: {
        required: true,
      },
      city: {
        required: true,
      },
      address: {
        required: true,
      },
      image: {
        required: true,
        checkfiletype: true,
      },
    },
    messages: {
      username: {
        required: "username is required.",
        minlength: "username should be 3 characters long.",
      },
      email: {
        required: "email is required.",
        email: "please enter valid email",
        remote: "email is already registered try new one!",
      },
      password: {
        required: "password is required",
        minlength: "password length should be minimum 8 characters long",
        pwcheck:
          "password should have lowercase, digit and special character!! ",
      },
      cpassword: {
        required: "confirm password is required",
        minlength:
          "confirm password length should be minimum 8 characters long",
        equalTo: "confirm password must same as password",
      },
      gender: {
        required: "gender is required",
      },
      mobile: {
        required: "contact number is required",
      },
      country: {
        required: "select country, country is required",
      },
      state: {
        required: "select state, state is required",
      },
      city: {
        required: "select city, city is required",
      },
      address: {
        required: "address is required",
      },
      image: {
        required: "upload image, profile image is required",
        checkfiletype: "profile image must be jpg, jpeg and png type",
      },
    },
    errorClass: "error fail-alert",
    errorPlacement: function (error, element) {
      if (element.is(":radio")) {
        error.insertAfter(element.parent().parent());
      } else {
        error.insertAfter(element);
      }
    },

    submitHandler: function (form, event) {
      event.preventDefault();

      let image = $("#image")[0].files[0];

      let fd = new FormData();

      fd.append("profile", image);
      fd.append("email", $("#email").val());
      fd.append("username", $("#username").val());
      fd.append("password", $("#password").val());
      fd.append("gender", $("input[name='gender']:checked").val());
      fd.append("mobile", $("#mobile").val());
      fd.append("_country", $("#country").val());
      fd.append("_state", $("#state").val());
      fd.append("_city", $("#city").val());
      fd.append("address", $("#address").val());
      $.ajax({
        url: "/api/users",
        type: "post",
        data: fd,
        contentType: false,
        processData: false,
        success: function ({ success, data }) {
          if (!success) {
            return alert(data);
          }
          alert(data.successMsg);
        },
      });
    },
  });
});
