const express = require("express");
const cors = require("cors"); // ✅ 1. Import CORS
const dbconnect = require("../backend/config/database");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT;

// ✅ 2. Use CORS middleware before your routes
app.use(cors({
  origin: "http://localhost:5173", // React frontend origin
  credentials: true, // Optional: needed for cookies/auth headers
}));

// ✅ 3. Middleware to parse JSON requests
app.use(express.json());

// ✅ 4. Routes
const userRouter = require("./router/User");

// Test route
app.get("/", (req, res) => {
  res.send("Welcome to the API");
});

app.use("/api/v1/auth", userRouter);

// ✅ 5. Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// ✅ 6. Connect to the database
dbconnect();
