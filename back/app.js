// var createError = require("http-errors");
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";

import authRouter from "./routes/auth.js";
import songRouter from "./routes/song.js";

var app = express();

// const mongoose = require("mongoose");

// mongoose.connect("mongodb://localhost:27017/mydb");

app.listen(5000);

// view engine setup
// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "ejs");

app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "public")));

app.use("/api/", authRouter);
app.use("/api/", songRouter);

// const User = require("./schemas/book");

// EJS static page
// app.get("/", function (req, res, next) {
//   res.render("index", { title: "Express" });
// });

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// module.exports = app;
