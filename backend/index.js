const express = require("express")
const dbconnect=require("../backend/config/database");
require("dotenv").config();
const MongoStore = require("connect-mongo");
const session = require("express-session");


const app= express()
const PORT=process.env.PORT;

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

const userRouter = require("./router/User");

// Use the user router for handling user-related routes
app.get('/', (req, res) => {
    res.send('Welcome to the API');
});
app.use('/api/v1/auth', userRouter);

if (!PORT || !process.env.DATABASE_URL || !process.env.JWT_SECRET) {
    console.error("Missing environment variables!");
    process.exit(1);
}

app.get("/check-session", (req, res) => {
    res.send(req.session);
});

app.listen(PORT,()=>{
    console.log("server is running.")
})

// connnect with database;
dbconnect();