$(document).ready(function () {
  let responseDiv = $("#btnSendOtp").on("click", function (e) {
    if ($("div.responseAlert").length) {
      $("div.responseAlert").remove();
    }
    $.get("/api/users/sendotp", function (data, success) {
      if (data.success) {
        $(
          "<div class='alert responseAlert alert-success alert-dismissible fade show' role='alert'> " +
            data.successMsg +
            ". <button type='button' class='btn-close' data-bs-dismiss='alert' aria-label='Close'></button></div>"
        ).insertAfter("#otp_label");
      } else {
        $(
          "<div class='alert responseAlert alert-danger alert-dismissible fade show' role='alert'> " +
            data.errorMsg +
            ". <button type='button' class='btn-close' data-bs-dismiss='alert' aria-label='Close'></button></div>"
        ).insertAfter("#otp_label");
      }
    });
  });
});
