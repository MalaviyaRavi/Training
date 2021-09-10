$(function () {
  $("form[name='registration']").validate({
    rules: {
      firstname: {
        required: true,
        minlength: 5,
      },
      lastname: {
        required: true,
        minlength: 5,
      },
      email: {
        required: true,

        email: true,
      },
      password: {
        required: true,
        minlength: 5,
        password: true,
      },
    },

    messages: {
      firstname: {
        required: "Please provide a firstname",
        minlength: "Your password must be at least 5 characters long",
      },
      lastname: {
        required: "Please provide a lastname",
        minlength: "Your password must be at least 5 characters long",
      },
      password: {
        required: "Please provide a password",
        minlength: "Your password must be at least 5 characters long",
      },
      email: "Please enter a valid email address",
    },

    submitHandler: function (form) {
      form.submit();
    },
  });
});
