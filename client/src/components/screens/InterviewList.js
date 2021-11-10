import React, { useEffect, useState } from 'react';
import M from "materialize-css";
import EditPage from './EditPage';
import { Link, useHistory } from 'react-router-dom';

const InterviewList = ()=>{
    let [data,setData]=useState([]);
    useEffect(()=>{
        fetch("/allMeetings")
        .then(res=>res.json())
        .then(data=>{
            setData(data.meetings);
        })
        .catch(err=>{
            console.log(err);
        })
    },[])
    const history=useHistory();
    function calTime(stime){
        let hr=parseInt(stime/100);
        let min=stime%100+"";
        let time=hr+":"+(min.length==1?"0":"")+min;
        return time;
    }

    return (
        <div style={{padding:"10px 15px",textAlign:"left"}}>
            <h3 class="page-heading">Interview List</h3>
            <div style={{border:"1px solid black"}}>
            <div style={{"padding":"10px","display":"flex","justifyContent":"space-evenly","margin":"5px"}}>
                <div className="s4">Title</div>
                <div className="s4">Email1</div>
                <div className="s4">Email2</div>
                <div className="s4">Date</div>
                <div className="s4">Start Time</div>
                <div className="s4">End Time</div>
            </div>
            {
            data.map(item => {
                return (
                    <div onClick={()=>{history.push("/edit/"+item._id)}} key={item._id} style={{"padding":"05px","display":"flex","justifyContent":"space-evenly","margin":"5px","backgroundColor":"yellow",textAlign:"left"}}>
                        <div className="s4">{item.title}</div>
                        <div className="s4">{item.user1.email}</div>
                        <div className="s4">{item.user2.email}</div>
                        <div className="s4">{item.date}</div>
                        <div className="s4">{calTime(item.startTime)}</div>
                        <div className="s4">{calTime(item.endTime)}</div>
                    </div>
                )
            })
            }
            </div>
        </div>
        
    )
}

export default InterviewList;