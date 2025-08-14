const express = require("express");
const cors = require("cors");
const dbconnect = require("../backend/config/database");
const connectCloudinary = require("../backend/config/cloudinary");
require("dotenv").config();
const MongoStore = require("connect-mongo");
const session = require("express-session");
const fileUpload = require("express-fileupload");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT;

// ✅ Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

// ✅ 3. Middleware to parse JSON requests
// Session Setup
// ✅ File upload middleware (ONLY ONCE!)
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: "/tmp/",
  limits: { fileSize: 20 * 1024 * 1024 },
  // abortOnLimit: true,
}));
// ✅ Export io so controllers can use it
module.exports.io = io;

// ✅ CORS middleware before routes
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);



// ✅ JSON middleware
app.use(express.json());

// ✅ Session setup
app.use(
  session({
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
  })
);

// ✅ Static PDF serving
app.use("/pdfs", express.static(path.join(__dirname, "pdfs")));

// ✅ Routes
const userRouter = require("./router/User");
const adminRouter = require("./router/Admin");
const investigatorRouter = require("./router/Investigator");
const patternsRouter = require("./router/Patterns");

app.use("/api/v1/patterns", patternsRouter);

app.get("/", (req, res) => {
  res.send("Welcome to the API");
});

app.use("/api/v1/auth", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/investigator", investigatorRouter);

// ✅ Session check route
app.get("/check-session", (req, res) => {
  res.send(req.session);
});

// ✅ Socket.IO connection listener
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// ✅ Start server with Socket.IO
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// ✅ Connect DB & Cloudinary
dbconnect();
connectCloudinary();
