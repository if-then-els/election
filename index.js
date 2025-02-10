const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const session = require("express-session");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const MongoStore = require("connect-mongo");
const app = express();

// Load environment variables from .env file
dotenv.config();

//session
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Use env variable
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl:
        process.env.Localmongodb || "mongodb://localhost:27017/election",
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production", // Secure cookies in production
      httpOnly: true,
      sameSite: "strict", // Mitigate CSRF attacks
      maxAge: 1000 * 60 * 60,
    },
  })
);

//db mongoose connect
mongoose
  .connect(process.env.Localmongodb || "mongodb://localhost:27017/election", {
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

//routes
const userAuth = require("./src/routes/userAuth");
app.use("/", userAuth);

// Serve the add-candidate.html page
app.get("/add-candidate", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "add-candidate.html"));
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
