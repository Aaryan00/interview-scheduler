require('dotenv').config()
const express=require('express');
const app=express();
const mongoose=require('mongoose');
const PORT= process.env.PORT || 5000;

const connect = mongoose
  .connect("mongodb://Aryan_agrawal:mnaamnaa11@cluster0-shard-00-00.gc7yg.mongodb.net:27017,cluster0-shard-00-01.gc7yg.mongodb.net:27017,cluster0-shard-00-02.gc7yg.mongodb.net:27017/interview_bit?ssl=true&replicaSet=atlas-nevph8-shard-0&authSource=admin&retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

require("./models/user");
require("./models/meeting");
app.use(express.json());

app.use(require("./routes/user"));
app.use(require("./routes/schedule"));
app.use(require("./routes/getMeetings"));

if(process.env.NODE_ENV=="production"){
    app.use(express.static("client/build"));
    const path=require("path");
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'));
    })
}

app.listen(PORT,()=>{
    console.log("Server is running on ",PORT);
})