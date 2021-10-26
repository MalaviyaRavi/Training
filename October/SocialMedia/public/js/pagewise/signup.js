$(document).ready(function () {
  //check password strength
  $.validator.addMethod("pwcheck", function (value) {
    let isValid =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/.test(value);
    return isValid;
  });

  //check indian mobile number

  $.validator.addMethod(
    "checkMobile",
    function (value, element) {
      return /^[789]\d{9}$/.test(value);
    },
    "Please enter a valid phone number"
  );

  $("#signup_form").validate({
    rules: {
      username: {
        required: true,
        minlength: 3,
      },
      email: {
        required: true,
        email: true,
        remote: {
          url: "/api/users/check/" + $("#email").val() + "",
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
        pwcheck: true,
      },
      gender: {
        required: true,
      },
      mobile: {
        required: true,
        checkMobile: true,
        url: "/api/users/check" + $("#mobile").val() + "",
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
          "password should have one lowercase, uppercase, digit & special symbol - !@#$%^&*",
      },
      cpassword: {
        required: "confirm password is required",
        minlength:
          "confirm password length should be minimum 8 characters long",
        equalTo: "confirm password must same as password",
        pwcheck:
          "password should have one lowercase, uppercase, digit & special symbol - !@#$%^&*",
      },
      gender: {
        required: "gender is required",
      },
      mobile: {
        required: "contact number is required",
        checkMobile: "please enter correct mobile number",
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
  });
});
