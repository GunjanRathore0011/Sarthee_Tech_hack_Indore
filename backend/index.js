const express = require("express");
const cors = require("cors");
const dbconnect = require("../backend/config/database");
const connectCloudinary = require("../backend/config/cloudinary");
require("dotenv").config();
const MongoStore = require("connect-mongo");
const session = require("express-session");
const fileUpload = require("express-fileupload");
const path = require('path');

const app = express();
const PORT = process.env.PORT;

// ✅ 2. Use CORS middleware before your routes
// ✅ CORS setup
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

// ✅ 3. Middleware to parse JSON requests
// Session Setup
// ✅ File upload middleware (ONLY ONCE!)
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: "/tmp/",
  limits: { fileSize: 20 * 1024 * 1024 },
}));

// ✅ JSON middleware
app.use(express.json());

// ✅ Session setup
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.DATABASE_URL,
    ttl: 7 * 24 * 60 * 60,
  }),
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
}));
// Middleware to parse JSON requests
app.use(express.json());
app.use('/pdfs', express.static(path.join(__dirname, 'pdfs')));

// ✅ Routes
const userRouter = require("./router/User");
const adminRouter = require("./router/Admin");
const investigatorRouter = require("./router/Investigator");

app.get("/", (req, res) => {
  res.send("Welcome to the API");
});

app.use("/api/v1/auth", userRouter);
app.use("/api/v1/admin",adminRouter);
app.use("/api/v1/investigator", investigatorRouter);


if (!PORT || !process.env.DATABASE_URL || !process.env.JWT_SECRET) {
  console.error("Missing environment variables!");
  process.exit(1);
}

app.get("/check-session", (req, res) => {
  res.send(req.session);
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// ✅ Connect DB
dbconnect();
connectCloudinary();
