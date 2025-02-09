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
mongoose
  .connect(process.env.Localmongodb, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.error("Database connection error:", err));

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3001", // Set to your frontend URL
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

//session
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Use env variable
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.Localmongodb,
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production", // Secure cookies in production
      httpOnly: true,
      sameSite: "strict", // Mitigate CSRF attacks
      maxAge: 1000 * 60 * 60,
    },
  })
);
//routes
const userAuth = require("../routes/userAuth");
app.use("/", userAuth);
