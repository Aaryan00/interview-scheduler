require('dotenv').config()
const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const Meeting=mongoose.model("Meeting");
const User=mongoose.model("User");

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

router.post("/createMeeting",(req,res)=>{
    schedule(req.body,null,res);
})

router.post("/edit/:meetingId",(req,res)=>{
    schedule(req.body,req.params.meetingId,res);
})

function schedule(body,meetingId,res){
    let {title,date,startTime,endTime,email1,email2}=body;
    if(!title || !date || !startTime || !endTime || !email1 || !email2){
        return res.status(422).json({error:"Please add all the fields"});
    }
    if(email1==email2){
        return res.status(422).json({error:"emails cannot be same"});
    }
    let startString=startTime;
    let endString=endTime;
    startTime=timeToNumber(startString);
    endTime=timeToNumber(endString);

    if(endTime<startTime){
        return res.status(422).json({error:"end time cannot be smaller than start time"});
    }

    // check if emails are valid
    User.findOne({email:email1})
    .then(savedUser1=>{
        if(!savedUser1){
            return res.status(422).json({error:"Inavalid email1"});
        }
        User.findOne({email:email2})
        .then(savedUser2=>{
            if(!savedUser2){
                return res.status(422).json({error:"Inavalid email2"});
            }

            // check if users are available
            let user1Available=true;
            Meeting.find({ $or: [ {date:date,user1:savedUser1._id}, {date:date,user2:savedUser1._id} ] })
            .then(meetings=>{
                // console.log(meetings);
                for(meeting of meetings){
                    if(meetingId!=null && meetingId==meeting._id){
                        continue;
                    }
                    if(startTime < meeting.endTime && meeting.startTime < endTime){
                        user1Available=false;
                        break;
                    }
                }

                let user2Available=true;
                Meeting.find({ $or: [ {date:date,user1:savedUser2._id}, {date:date,user2:savedUser2._id} ] })
                .then(meetings=>{
                    
                    for(meeting of meetings){
                        if(meetingId!=null && meetingId==meeting._id){
                            continue;
                        }
                        if(startTime < meeting.endTime && meeting.startTime < endTime){
                            user2Available=false;
                            break;
                        }
                    }

                    if(user1Available && user2Available){
                        const meeting=new Meeting({
                            title,
                            date,
                            startTime,
                            endTime,
                            user1:savedUser1,
                            user2:savedUser2
                        })
                        if(meetingId!=null){
                            Meeting.updateOne({_id:meetingId},{$set:{title,date,startTime,endTime,user1:savedUser1,user2:savedUser2}})
                            .then(result=>{
                                res.json({meeting:result});
                            })
                            .catch(err=>{
                                console.log(err);
                            })
                        }
                        else{
                            meeting.save()
                            .then(result=>{
                                res.json({meeting:result});
                            })
                            .catch(err=>{
                                console.log(err);
                            })
                        }

                        sendMail(title,date,startString,endString,email1,email2,meetingId)

                        
                    }
                    else{
                        var user1String="";
                        var user2String="";
                        if(user1Available){
                            user1String="is available at the selected time";
                        }
                        else{
                            user1String="is not available at the selected time";
                        }
                        if(user2Available){
                            user2String="is available at the selected time";
                        }
                        else{
                            user2String="is not available at the selected time";
                        }
                        return res.status(422).json({"error":"user1 "+user1String+" and user2 "+user2String});
                    }

                })

            })

        })
        .catch(err=>{
            console.log(err);
        })

    })
    .catch(err=>{
        console.log(err);
    })
}


function sendMail(title,date,startString,endString,email1,email2,meetingId){
    let html=`
    <div style="padding:10px;display:flex;justifyContent:space-evenly;margin:5px;border:1px solid lightslategrey;font-weight:bold;">
        <table>
            <tr>
                <td>Title</td>
                <td>${title}</td>
            </tr>
            <tr>
                <td>Email1</td>
                <td>${email1}</td>         
            </tr>
            <tr>
                <td>Email2</td>
                <td>${email2}</td>        
            </tr>
            <tr>
                <td>Date</td>
                <td>${date}</td></tr>
            <tr>
                <td>Start Time</td>
                <td>${startString}</td>
            </tr>
            <tr>
                <td>End Time</td>
                <td>${endString}</td>
            </tr>
        </table>
    </div>`

    let msg={
        from: 'pshrimal000@gmail.com',
        html
    }
    if(meetingId!=null){
        msg.subject="Meeting Updated"
    }
    else{
        msg.subject="Meeting Created"
    }

    msg.to=email1;
    sgMail
    .send(msg)
    .then(() => {
        console.log('Email sent')
    })
    .catch((error) => {
        console.error(error)
    })

    msg.to=email2;
    sgMail
    .send(msg)
    .then(() => {
        console.log('Email sent')
    })
    .catch((error) => {
        console.error(error)
    })
}

function timeToNumber(sTime){
    let time=sTime.replace(":","");
    return Number(time);
}

module.exports=router;