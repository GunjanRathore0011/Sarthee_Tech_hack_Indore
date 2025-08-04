const mongoose = require("mongoose");
require("dotenv").config();

const dbconnect=()=>{
    mongoose.connect(process.env.DATABASE_URL).then(()=>{
        console.log("Connected with the database successfully.") }).catch((error)=>{
            "Error in connecting with the database.:", error.message;
        process.exit(1);                    
        // Exit the process with failure    
        })
}

module.exports=dbconnect;