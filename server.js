const express =require("express");
const mongoose = require("mongoose");
const bodyParser=require("body-parser")
const app=express();

// 引入users.js
const users=require("./routes/api/users")


// db config
const db=require("./config/keys.js").mongoURI

// 使用body-parser中间件
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())


// connect to mongodb
mongoose.connect(db)
        .then(()=>console.log("MongoDB Connected"))
        .catch(err=>(console.log(err)));



// 路由
app.get("/",(req,res)=>{
    res.send("Hello world!")
})

// 使用routes
app.use("/api/users",users);

const port = process.env.PORT || 5000;

app.listen(port,()=>{
    console.log(`Server running on port ${port}`);
})