$(document).ready(function () {
  //Jquery Validate

  //profile image type check
  $.validator.addMethod("checkfiletype", function (value) {
    let extensions = ["jpg", "jpeg", "png", "JPEG", "JPG", "PNG"];
    let fileExtension = value.split(".")[1];
    return extensions.includes(fileExtension);
  });

  //validation
  $("#signup_form").validate({
    rules: {
      firstname: {
        required: true,
        minlength: 3,
      },
      lastname: {
        required: true,
        minlength: 3,
      },
      gender: {
        required: true,
      },
      address: {
        required: true,
      },
      interest: {
        required: true,
      },
      hobby: {
        required: true,
      },
      image: {
        required: true,
        checkfiletype: true,
      },
    },
    messages: {
      firstname: {
        required: "firstname is required.",
        minlength: "firstname should be 3 characters long.",
      },
      lastname: {
        required: "lastname is required.",
        minlength: "lastname should be 3 characters long.",
      },
      gender: {
        required: "gender is required",
      },
      address: {
        required: "address is required",
      },
      interest: {
        required: "interest is required",
      },
      hobby: {
        required: "select at least one hobby",
      },
      image: {
        required: "upload image, profile image is required",
        checkfiletype: "profile image must be jpg, jpeg and png type",
      },
    },
    errorClass: "error fail-alert",
    errorPlacement: function (error, element) {
      if (element.is(":radio") || element.is(":checkbox")) {
        error.insertAfter(element.parent().parent());
      } else {
        error.insertAfter(element);
      }
    },

    submitHandler: function (form, event) {
      event.preventDefault();

      let image = $("#image")[0].files[0];
      let hobbies = [];

      $("input:checkbox[name=hobby]:checked").each(function () {
        hobbies.push($(this).val());
      });

      let fd = new FormData();

      fd.append("image", image);
      fd.append("firstname", $("#firstname").val());
      fd.append("lastname", $("#lastname").val());
      fd.append("address", $("#address").val());
      fd.append("gender", $("input[name='gender']:checked").val());
      fd.append("hobby", hobbies);
      fd.append("interest", $("#interest").val());

      $.ajax({
        url: "/api/users",
        type: "post",
        data: fd,
        contentType: false,
        processData: false,
        success: function ({ success, messages, data }) {
          if (success) {
            let newUser =
              "<tr class = " +
              data.id +
              '><td><img src="/img/' +
              data.image +
              '" alt="userimage" width="50" height="50"></td><td>' +
              data.name +
              "</td><td>" +
              data.gender +
              "</td> <td>" +
              data.address +
              "</td><td><button class='btn btn-success edit-btn' data-id='" +
              data.id +
              "'>Edit</button> <button type='button' class='btn btn-danger delete-btn' data-id='" +
              data.id +
              "'>Delete</button> </td></tr>";
            $("tbody").append(newUser);
          }
        },
      });
    },
  });

  $(document)
    .off("click", ".delete-btn")
    .on("click", ".delete-btn", function () {
      $.confirm({
        title: "Delete User",
        content: "Are You Sure Want To Delete??",
        buttons: {
          confirm: function () {
            let userId = $(".delete-btn").data("id");
            $.ajax({
              url: "/api/users/" + userId + "",
              type: "delete",
              success: function ({ success, message, data }) {
                if (success) {
                  $("." + userId).remove();
                  $.alert(message);
                }
                if (!success) {
                  $.alert(message);
                }
              },
            });
          },
          cancel: function () {},
        },
      });
    });

  //   $(".delete-btn").click(function () {

  //   });
});
