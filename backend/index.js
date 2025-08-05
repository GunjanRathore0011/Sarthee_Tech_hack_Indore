const express = require("express");
const cors = require("cors"); // ✅ 1. Import CORS
const dbconnect = require("../backend/config/database");
require("dotenv").config();
const MongoStore = require("connect-mongo");
const session = require("express-session");


const app = express();
const PORT = process.env.PORT;

// ✅ 2. Use CORS middleware before your routes
app.use(cors({
  origin: "http://localhost:5173", // React frontend origin
  credentials: true, // Optional: needed for cookies/auth headers
}));

// ✅ 3. Middleware to parse JSON requests
// Session Setup
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
      mongoUrl: process.env.DATABASE_URL,
      ttl: 7 * 24 * 60 * 60, // Session expiry time (7 day)
  }),
  cookie: {
    maxAge: 7*24*60 * 60 * 1000 // 7 day
  },
}));
// Middleware to parse JSON requests
app.use(express.json());
const fileUpload = require("express-fileupload");
app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" }));


// ✅ 4. Routes
const userRouter = require("./router/User");

// Test route
app.get("/", (req, res) => {
  res.send("Welcome to the API");
});

app.use("/api/v1/auth", userRouter);
if (!PORT || !process.env.DATABASE_URL || !process.env.JWT_SECRET) {
    console.error("Missing environment variables!");
    process.exit(1);
}

app.get("/check-session", (req, res) => {
    res.send(req.session);
});

// ✅ 5. Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// ✅ 6. Connect to the database
dbconnect();
