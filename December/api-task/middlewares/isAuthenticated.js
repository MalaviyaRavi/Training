const jwt = require("jsonwebtoken");
const isAuthenticated = function (req, res, next) {
  let token = req.headers.authorization;
  if (token && req.cookies.authToken) {
    let payLoad = jwt.verify(token, "ravi");
    req.user = payLoad;
    next();
    return;
  }
  res.json({ type: "invalidToken", statusCode: 401 });
};

module.exports = isAuthenticated;
