const mongoose=require("mongoose");
const {ObjectId}=mongoose.Schema.Types

const meetingSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    date:{
        type:String,
        required:true
    },
    startTime: {
        type:Number, 
        required:true
    },
    endTime: {
        type:Number,
        required:true
    },
    user1:{
        type:ObjectId,
        ref:"User"
    },
    user2:{
        type:ObjectId,
        ref:"User"
    }
})

mongoose.model("Meeting",meetingSchema);

