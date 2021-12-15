const jwt = require("jsonwebtoken");
const User = require("../models/user");
global.isAuthenticated = async function (req, res, next) {
  let token = req.headers.authorization;
  if (token && req.cookies.authToken) {
    let payLoad = jwt.verify(token, config.JWT.secret);

    try {
      let user = await User.findOne({ email: payLoad.userEmail });
      if (user) {
        req.user = payLoad;
        return next();
      } else {
        return res.json({ type: "invalidToken", statusCode: 401 });
      }
    } catch (error) {
      return res.json({ type: "invalidToken", statusCode: 500 });
    }
  }
  res.json({ type: "invalidToken", statusCode: 401 });
};
