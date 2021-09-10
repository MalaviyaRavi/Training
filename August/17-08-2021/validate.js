function submitValidation() {
  var firstname = document.getElementsByName("firstname")[0];
  var middlename = document.getElementsByName("middlename")[0];
  var lastname = document.getElementsByName("lastname")[0];
  var course = document.getElementsByName("course")[0];
  var phone = document.getElementsByName("phone")[0];
  var email = document.getElementsByName("email")[0];
  var password = document.getElementsByName("password")[0];
  var password_repeat = document.getElementsByName("password_repeat")[0];
  var flag = true;
  if (firstname.value === "") {
    document.getElementById("firstname").innerHTML = "please fill firstname";
    firstname.focus();
    flag = false;
  } else if (firstname.value.length < 3) {
    document.getElementById("firstname").innerHTML =
      "firstname atleast 3 character required!";
    firstname.focus();
    flag = false;
  } else {
    document.getElementById("firstname").innerHTML = "";
  }

  if (middlename.value === "") {
    document.getElementById("middlename").innerHTML = "please fill middlename";
    middlename.focus();
    flag = false;
  } else if (middlename.value.length < 3) {
    document.getElementById("middlename").innerHTML =
      "middlename atleast 3 character required!";
    middlename.focus();
    flag = false;
  } else {
    document.getElementById("middlename").innerHTML = "";
  }

  if (lastname.value === "") {
    document.getElementById("lastname").innerHTML = "please fill lastname";
    lastname.focus();
    flag = false;
  } else if (lastname.value.length < 3) {
    document.getElementById("lastname").innerHTML =
      "lastname atleast 3 character required!";
    lastname.focus();
    flag = false;
  } else {
    document.getElementById("lastname").innerHTML = "";
  }

  if (phone.value === "") {
    document.getElementById("phone").innerHTML = "please fill phone number";
    phone.focus();
    flag = false;
  } else if (phone.value.length != 10) {
    document.getElementById("phone").innerHTML =
      "phone number must be 10 digit long";
    phone.focus();
    flag = false;
  } else {
    document.getElementById("phone").innerHTML = "";
  }

  if (email.value === "") {
    document.getElementById("email").innerHTML = "please fill email";
    email.focus();
    flag = false;
  } else if (!validateEmail(email.value)) {
    document.getElementById("email").innerHTML =
      "please enter valid email address";
    email.focus();
    flag = false;
  } else {
    document.getElementById("email").innerHTML = "";
  }

  if (password.value === "") {
    document.getElementById("password").innerHTML = "please fill password";
    password.focus();
    flag = false;
  } else if (password.value.length < 8) {
    document.getElementById("password").innerHTML =
      "password should have length 8";
    password.focus();
    flag = false;
  } else {
    document.getElementById("password").innerHTML = "";
  }

  if (password_repeat.value === "") {
    document.getElementById("password_repeat").innerHTML =
      "please fill password_repeat";
    password_repeat.focus();
    flag = false;
  } else if (password_repeat.value.length < 8) {
    document.getElementById("password_repeat").innerHTML =
      "password_repeat should have length 8";
    password_repeat.focus();
    flag = false;
  } else if (password.value != password_repeat.value) {
    document.getElementById("password_repeat").innerHTML =
      "password does not match";
    password_repeat.focus();
    flag = false;
  } else {
    document.getElementById("password_repeat").innerHTML = "";
  }

  return flag;
}

function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
