const express = require("express");
const router = express.Router();
const { authSchema } = require("../helpers/validationSchema");
const createError = require("http-errors");
const { signAccessToken } = require("../helpers/jwthelper");
const User = require("../models/user");
router.post("/register", async (req, res, next) => {
  try {
    // const { email, password } = req.body;
    // if (!email || !password) throw createError.BadRequest();
    const result = await authSchema.validateAsync(req.body);
    console.log(result);
    const doesExist = await User.findOne({ email: result.email });
    if (doesExist)
      throw createError.Conflict("This email is already been registered !");
    const user = new User(result);
    const savedUser = await user.save();
    const accessToken = await signAccessToken(savedUser.id);
    res.send({ accessToken });
  } catch (err) {
    if (err.isJoi == true) {
      err.status = 422;
    }
    next(err);
  }
});
router.post("/login", async (req, res, next) => {
  try {
    const result = await authSchema.validateAsync(req.body);
    const user = await User.findOne({ email: result.email });
    if (!user) {
      throw createError.NotFound("User not registerd");
    }

    const isMatch = await user.isValidPassword(result.password);
    if (!isMatch)
      throw createError.Unauthorized("Username / Password is not valid");

    const accessToken = await signAccessToken(user.id);
    res.send({ accessToken });
  } catch (err) {
    console.log(err.isJoi);
    if (err.isJoi == true) {
      return next(createError.BadRequest("Invalid Username or password"));
    }
    next(err);
  }
});
router.post("/refresh-token", async (req, res, next) => {
  res.send("refresh token");
});
router.delete("/logout", async (req, res, next) => {
  res.send("logout");
});
module.exports = router;
