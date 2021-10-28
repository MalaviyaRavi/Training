const otpGenerator = require("otp-generator");

console.log(
  otpGenerator.generate(6, {
    upperCase: false,
    specialChars: false,
    alphabets: false,
  })
);
