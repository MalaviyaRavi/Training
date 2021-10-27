const { Auth } = require("two-step-auth");

async function login(emailId) {
  //   const res = await Auth(emailId);
  // You can follw the above approach, But we recommend you to follow the one below, as the mails will be treated as important
  const res = await Auth(emailId, "Social Media");
  console.log(res);
  console.log(res.mail);
  console.log(res.OTP);
  console.log(res.success);
}

login("kishan.l@webcodegenie.com");
