const express = require("express")
const dbconnect=require("../backend/config/database");
require("dotenv").config();

const app= express()
const PORT=process.env.PORT;

// Middleware to parse JSON requests
app.use(express.json());

const userRouter = require("./router/User");

// Use the user router for handling user-related routes
app.get('/', (req, res) => {
    res.send('Welcome to the API');
});
app.use('/api/v1/auth', userRouter);


app.listen(PORT,()=>{
    console.log("server is running.")
})

// connnect with database;
dbconnect();