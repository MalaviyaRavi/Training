const loginEventHandler = function () {
  this.init = function () {
    _this.login();
  };

  this.login = function () {
    $("#btnLogin").on("click", function (e) {
      let emailOrMobile = $("#emailOrMobile").val();
      let password = $("#password").val();
      if (!emailOrMobile.length || !password.length) {
        alert("please enter correct user details");
        return;
      }

      $.ajax({
        url: "/api/login",
        method: "POST",
        data: {
          emailOrMobile,
          password,
        },
        success: function (loginResponse) {
          if (loginResponse.statusCode != 200) {
            return alert(loginResponse.message);
          }
          let authToken = loginResponse.token;
          $(document)[0].cookie = `authToken=${authToken}`;
          alert(loginResponse.message);
          $(location).attr("href", "/users");
        },
      });
    });
  };

  let _this = this;
  this.init();
};
