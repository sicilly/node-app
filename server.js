const express =require("express");
const mongoose = require("mongoose");
const app=express();

// db config
const db=require("./config/keys.js").mongoURI

// connect to mongodb
mongoose.connect(db)
        .then(()=>console.log("MongoDB Connected"))
        .catch(err=>(console.log(err)));



// 路由
app.get("/",(req,res)=>{
    res.send("Hello world!")
})

const port = process.env.PORT || 5000;

app.listen(port,()=>{
    console.log(`Server running on port ${port}`);
})