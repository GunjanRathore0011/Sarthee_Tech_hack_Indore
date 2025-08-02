const express = require("express")
const dbconnect=require("../backend/config/database");
require("dotenv").config();


const app= express()
const PORT=process.env.PORT;

app.listen(PORT,()=>{
    console.log("server is running.")
})

// connnect with database;
dbconnect();