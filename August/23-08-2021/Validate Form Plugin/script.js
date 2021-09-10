$(function () {
  $("form[name='registration']").validate({
    rules: {
      name: {
        required: true,
        minlength: 5,
      },
      "Contact Number": {
        required: true,
        digits: true,
        minlength: 10,
        maxlength: 10,
      },
      age: {
        required: true,

        min: 18,
        max: 35,
      },
      email: {
        required: true,
        email: true,
      },
      "Date Of Birth": {
        required: true,
        date: true,
      },

      profilepic: {
        required: true,
        accept: "image/*",
      },

      password: {
        required: true,
        minlength: 8,
        password: true,
      },
      password_again: {
        equalTo: "#password",
        required: true,
      },
    },

    messages: {
      name: {
        required: "Please provide a firstname",
        minlength: "Your name must be at least 5 characters long",
      },
      "Contact Number": {
        required: "Please provide a contact Number",
        minlength: "Your Contact Nummber must be 10 digits long",
        maxlength: "Your Contact Nummber must be 10 digits long",
      },
      "Date Of Birth": {
        required: "Please provide your date of birth",
        date: "Your date of birth must in 03/07/1995 format",
      },
      age: {
        required: "Please provide your age",
        min: "you are under age for registration",
        max: "you are over age for registration",
      },
      profilepic: {
        required: "Please choose your  profile picture",
        accept: "please choose only image file",
      },
      password: {
        required: "Please provide a password",
        minlength: "Your password must be at least 8 characters long",
      },
      password_again: {
        equalTo: "#please enter password same as above",
        required: "Please provide a password",
      },
      email: "Please enter a valid email address",
    },

    submitHandler: function (form) {
      form.submit();
    },
  });
});
