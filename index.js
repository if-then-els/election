const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const MongoStore = require("connect-mongo");
const User = require("./src/models/users");
const app = express();

// Load environment variables from .env file
dotenv.config();

// Log environment variables for debugging (remove this in production)
console.log("SESSION_SECRET:", process.env.SESSION_SECRET);
console.log("JWT_SECRET:", process.env.JWT_SECRET);
console.log("localconnect:", process.env.localconnect);

// Check if required environment variables are set
if (!process.env.SESSION_SECRET || !process.env.JWT_SECRET || !process.env.localconnect) {
  console.error("Missing required environment variables.");
  process.exit(1);
}

//session
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Use env variable
    resave: false,
    saveUninitialized: false, // Changed from true to false
    store: MongoStore.create({
      mongoUrl: process.env.localconnect,
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production", // Secure cookies in production
      httpOnly: true,
      sameSite: "lax", // Changed from "none" to "lax" for better compatibility
      maxAge: 1000 * 60 * 60,
    },
  })
);

//db mongoose connect
mongoose
  .connect(process.env.localconnect, {})
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
const adminAuth = require("./src/routes/adminAuth");

app.use("/", userAuth);
app.use("/admin", adminRoutes);
app.use("/admin", adminAuth);

// Serve the add-candidate.html page
app.get("/add-candidate", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "add-candidate.html"));
});

// Serve the admin login page
app.get("/admin-login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin-login.html"));
});

// Debug route to check session
app.get("/session-debug", (req, res) => {
  res.json({
    session: req.session,
    sessionId: req.sessionID,
    cookies: req.headers.cookie
  });
});

// Protect admin dashboard - check if user is logged in as admin
app.get("/admin-dashboard", async (req, res) => {
  try {
    console.log('Dashboard access attempt - Session:', {
      userId: req.session.userId,
      isAdmin: req.session.isAdmin,
      sessionId: req.sessionID
    });
    
    if (!req.session.userId) {
      console.log('No session userId, redirecting to login');
      return res.redirect("/admin-login");
    }
    
    // Check if user is admin
    const user = await User.findById(req.session.userId);
    console.log('User found:', user ? { id: user._id, role: user.role } : 'null');
    
    if (!user || user.role !== 'admin') {
      console.log('User not found or not admin, redirecting to login');
      return res.redirect("/admin-login");
    }
    
    console.log('Admin verified, serving dashboard');
    res.sendFile(path.join(__dirname, "public", "admin-dashboard.html"));
  } catch (err) {
    console.error('Error checking admin status:', err);
    res.redirect("/admin-login");
  }
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
