const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const authRoute=require('./routes/auth')
const app = express();
const {verifyAccesToken}=require("./helpers/jwthelper")
const morgan = require("morgan");
const createError = require("http-errors");
require("dotenv").config();
let cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/",verifyAccesToken, async (req, res, next) => {
  console.log(req.headers['authorization'])
  res.send("Heelo");
});
app.use('/auth',authRoute)
app.use(async (req, res, next) => {
  // const error = new Error("not found");
  // error.status = 404;
  // next(error);
  next(createError.NotFound())
});
app.use(async(req, res, next) => {
  console.log('areee yrr')
})
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: { status: err.status || 500, message: err.message },
  });
});
mongoose
  .connect(
    "mongodb+srv://ananya:LDO9F8tc1Yq88dcu@cluster0-bxzzc.mongodb.net/shop?retryWrites=true&w=majority"
  )
  .then((result) => {
    app.listen(5000, () => console.log("running 5000"));
  })
  .catch((err) => {
    console.log(err);
  });
