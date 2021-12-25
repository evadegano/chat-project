const express = require("express");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const favicon = require("serve-favicon");
const path = require("path");


module.exports = app => {
  // get access to the body property in the request
  app.use(express.json());
  app.use(express.urlencoded({ extended: false}));
  app.use(cookieParser());

  // set access to static folder
  app.use(express.static(path.join(__dirname, "..", "public")));
  // normalize path to views folder
  app.set("views", path.join(__dirname, "..", "views"));
  // set view engine as hbs
  app.set("view engine", "hbs");

  // set access to favicon
  app.use(
    favicon(path.join(__dirname, "..", "public", "images", "favicon.ico"))
  );

  // use flash messages
  app.use(flash());
}