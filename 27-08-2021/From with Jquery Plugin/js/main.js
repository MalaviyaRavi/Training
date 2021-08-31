$(document).ready(function () {
  /* $.validator.setDefaults({
    submitHandler: function () {
      $(form).submit();
    },
  });*/
  //chosen
  $(".hobyOption").chosen({ width: "660px" });
  $(".option").chosen({
    width: "660px",
    no_results_text: "Oops, nothing found!",
  });
  $(window).on("load", function () {
    CKEDITOR.replace("introduction");
    ClassicEditor.create(document.querySelector("#yourself"), {});
  });
  //CKEditor

  //Datepicker
  $("#datepicker").datepicker({
    changeMonth: true,
    changeYear: true,
    yearRange: "-100:+0",
    autoSize: true,
    timeFormat: "hh:mm:ss p",

    beforeShow: function (input, inst) {
      setTimeout(function () {
        inst.dpDiv.css({
          top: 350,
          left: 500,
        });
      }, 0);
    },
  });

  //timepicker
  $("#timepicker").timeselector({
    min: "00:00",
    step: 1,
    max: "23:59",
    hours12: true,
  });

  //lightbox
  lightbox.option({
    resizeDuration: 700,
    wrapAround: true,
    fadeDuration: 1500,
    positionFromTop: 130,
    albumLabel: "",
  });

  // $.validator.setDefaults({ ignore: ":hidden:not(select)" });

  //Custom Validation
  $.validator.addMethod("validateName", function (value, element) {
    let re = /^[A-Za-z]+$/;
    if (re.test(value)) return true;
    else return false;
  });

  $.validator.addMethod("validateAddress", function (value, element) {
    if (value != "") {
      return true;
    } else {
      return false;
    }
  });

  $.validator.addMethod("validateCity", function (value, element) {
    if (value != "") {
      return true;
    } else {
      return false;
    }
  });

  $.validator.addMethod("validateYourself", function (value, element) {
    if (value != "") {
      return true;
    } else {
      return false;
    }
  });

  $.validator.addMethod("validateHobby", function (value, element) {
    if (value.length != 0) {
      return true;
    } else {
      return false;
    }
  });

  $.validator.addMethod("validateIntroduction", function (value, element) {
    if (value.length != 0) {
      return true;
    } else {
      return false;
    }
  });

  //Validation
  $(registration).validate({
    // ignore: "input:hidden:not(input:hidden.required)",
    ignore: [],
    //focusout: true,
    /*onkeyup: function (element) {
      this.element(element); // <- "eager validation"
    },*/
    /* onkeyup: function (element) {
      $("registration").valid(); // <- "eager validation"
    },*/
    rules: {
      firstname: {
        required: true,
        minlength: 3,
        maxlength: 10,
        validateName: true,
      },
      Mobile: {
        required: true,
        digits: true,
        minlength: 10,
        maxlength: 10,
      },
      email: {
        required: true,
        email: true,
      },
      address: {
        validateAddress: true,
      },
      city: {
        validateCity: true,
      },
      dob: {
        required: true,
      },
      timepicker: {
        required: true,
      },
      hobby: {
        validateHobby: true,
      },
      yourself: {
        validateYourself: true,
      },
      introduction: {
        validateIntroduction: true,
      },
    },
    messages: {
      firstname: {
        validateName: "firstname should contain only alphabates",
      },
      city: "Please choose city",
      address: "please fill address",
      dob: "Please select your birthdate",
      timepicker: "Please select time",
      hobby: "please select your hobbies",
      yourself: "please write something about yourself",
      introduction: "Please fill in introduction field",
    },

    errorPlacement: function (error, element) {
      if (element.attr("name") == "city") {
        error.insertAfter($("#city"));
      } else if (element.attr("name") == "yourself") {
        error.insertAfter($(".self"));
      } else if (element.attr("name") == "introduction") {
        error.insertAfter($(".intro"));
      } else if (element.attr("name") == "hobby") {
        error.insertAfter($("#hobby"));
      } else {
        error.insertAfter(element);
      }
    },
  });
});
