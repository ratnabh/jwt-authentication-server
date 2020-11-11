const jwt = require("jsonwebtoken");
const createError = require("http-errors");

module.exports = {
  signAccessToken: (userid) => {
    return new Promise((resolve, reject) => {
      const payload = {};
      const secret = process.env.ACCESS_TOKEN_SECRET;
      const options = {
        expiresIn: "1h",
        audience: userid,
      };
      jwt.sign(payload, secret, options, (err, token) => {
        if (err) {
          reject(createError.InternalServerError());
        }
        resolve(token);
      });
    });
  },
  verifyAccesToken: (req, res, next) => {
    if (!req.headers["authorization"]) return next(createError.Unauthorized());
    const authHeader = req.headers["authorization"];
    const bearerToken = authHeader.split(" ");
    const token = bearerToken[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
      if (err) {
          console.log(err.message)
        if (err.name == "JsonWebTokenError") {
          return next(createError.Unauthorized());
        } else {
          return next(createError.Unauthorized(err.message));
        }
      }
      req.payload = payload;
      next();
    });
  },
};
