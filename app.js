const express = require("express");
var bodyParser = require("body-parser");
const mongoose = require("mongoose");
const profileRoutes = require("./routes/profile");

const app= express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-type, Authorization');
    next();
})

app.use("/profile", profileRoutes);


mongoose.connect(
    "mongodb+srv://AleksaOpacic:opacicaleksa32@cluster0-cplrq.mongodb.net/MTDSmartCard?retryWrites=true&w=majority"
).then(result=>{
    app.listen(3003);
}).catch(err => console.log(err));
