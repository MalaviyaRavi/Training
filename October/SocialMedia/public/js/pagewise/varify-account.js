$(document).ready(function () {
  $("#btnSendOtp").on("click", function (e) {
    $.get("/api/users/sendotp", function (data, success) {
      console.log(data);
    });
  });
});
