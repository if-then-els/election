const express = require("express");
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

// Log environment variables for debugging (remove this in production)
console.log("SESSION_SECRET:", process.env.SESSION_SECRET);
console.log("mongoConnect:", process.env.mongoConnect);

// Check if required environment variables are set
if (!process.env.SESSION_SECRET || !process.env.mongoConnect) {
  console.error("Missing required environment variables.");
  process.exit(1);
}

//session
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Use env variable
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.mongoConnect,
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production", // Secure cookies in production
      httpOnly: true,
      sameSite: "none", // Mitigate CSRF attacks
      maxAge: 1000 * 60 * 60,
    },
  })
);

//db mongoose connect
mongoose
  .connect(process.env.mongoConnect, {})
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.error("Database connection error:", err));

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3001",
    credentials: true, // Allow cookies/session
    methods: ["GET", "POST", "PUT", "DELETE"], // Ensure all HTTP methods are allowed
    allowedHeaders: ["Content-Type", "Authorization"], // Ensure correct headers
  })
);
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

//routes
const userAuth = require("./src/routes/userAuth");
const adminRoutes = require("./src/routes/adminRoutes");
app.use("/", userAuth);
app.use("/admin", adminRoutes);

// Serve the add-candidate.html page
app.get("/add-candidate", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "add-candidate.html"));
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
