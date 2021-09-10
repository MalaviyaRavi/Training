function validateFields(e) {
  var errorMsg = "";
  //console.log(e.target.options[e.target.selectedIndex].value);
  if (e.target.value == "") {
    errorMsg = `${e.target.name} should not be empty!!`;
    document.getElementById(e.target.name).innerText = errorMsg;
    e.target.focus();
  } else {
    document.getElementById(e.target.name).innerText = "";
  }

  if (e.target.name == "phone") {
    console.log(typeof e.target.value);
    if (e.target.value.length != 10) {
      errorMsg = `${e.target.name} length must be 10 digit!!`;
      document.getElementById(e.target.name).innerText = errorMsg;
      e.target.focus();
    } else {
      document.getElementById(e.target.name).innerText = "";
    }
  }

  if (e.target.name == "email") {
    if (!validateEmail(e.target.value)) {
      document.getElementById(e.target.name).innerText = "Enter valid email...";
      e.target.focus();
    } else {
      document.getElementById(e.target.value).innerText = "";
    }
  }
}

function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function validateDropdown(e) {
  let msg = "";
  if (e.target.options[e.target.selectedIndex].value == "Course") {
    errorMsg = `please select ${e.target.name} !!`;
    document.getElementById(e.target.name).innerText = errorMsg;
    e.target.focus();
  } else {
    document.getElementById(e.target.name).innerText = "";
  }
}

let password = "";
let repassword = "";
function validatePassword(e) {
  var msg = "";
  if (e.target.name == "password") {
    password = e.target.value;
    if (e.target.value.length < 6) {
      document.getElementById(e.target.name).innerText =
        "Password Length At Least 6";
      e.target.focus();
    } else {
      document.getElementById(e.target.name).innerText = "";
    }
    return;
  } else if (e.target.name == "password-repeat") {
    if (e.target.value.length < 6) {
      document.getElementById(e.target.name).innerText =
        "Password Length At Least 6";
      e.target.focus();
    } else if (e.target.value != password) {
      document.getElementById(e.target.name).innerText =
        "password dost not match!!";
      e.target.focus();
    } else {
      document.getElementById(e.target.name).innerText = "";
    }
  }
}
function validateRadio(e) {
  console.log(e.target.checked);
  let msg = "";
  if (e.target.checked === false) {
    errorMsg = `please select ${e.target.name} !!`;
    document.getElementById(e.target.name).innerText = errorMsg;
    e.target.focus();
  } else {
    document.getElementById(e.target.name).innerText = "";
  }
}
