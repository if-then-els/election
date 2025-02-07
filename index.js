const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const session = require("express-session");
const User = require("../models/users");
const dontenv = require("dotenv");
const esj = require("ejs");
const mongoose = require("mongoose");
const app = express();

//session
app.use(
  session({
    secret: process.env.session_secret,
  })
);

//db mongoose connect
mongoose.connect(process.env.mongoConnect);

//routes
