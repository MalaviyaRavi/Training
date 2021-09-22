function ValidateEmail(mail) {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
    return true;
  }

  return false;
}

exports.signupValidate = (username, email, password, password2, res) => {
  if (!username || !email || !password || !password2) {
    return res.render("signup", {
      error: "Please Fill Up All Fields",
      isError: true,
    });
  }

  if (username.length < 5) {
    return res.render("signup", {
      error: "username should be 5 characters long.!",
      isError: true,
    });
  }

  if (!ValidateEmail(email)) {
    return res.render("signup", {
      error: "please enter valid email address",
      isError: true,
    });
  }

  if (password.length < 6 || password2.length < 6) {
    return res.render("signup", {
      error: "password should be 6 characters long",
      isError: true,
    });
  }

  if (password != password2) {
    return res.render("signup", {
      error: "password must be same",
      isError: true,
    });
  }
};
