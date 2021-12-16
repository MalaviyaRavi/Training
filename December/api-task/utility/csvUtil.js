function checkEmail(email) {
    let validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return email.match(validRegex);
}

function checkMobile(mobile) {
    let validRegex = /^[0-9]{10}$/;
    return mobile.match(validRegex);
}