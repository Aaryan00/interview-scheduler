import React from 'react';
import {Link} from 'react-router-dom';

const Navbar=()=>{
    return (  
        <nav>
            <div className="nav-wrapper" style={{padding:"0 20px"}}>
                <Link to="/" className="brand-logo left" style={{fontFamily:"monospace",color:"blue"}}>Interview Bit</Link>
                <ul id="nav-mobile" class="right hide-on-med-and-down">
                    <li><Link to="/">Interview List</Link></li>
                    <li><Link to="/create">Create Meeting</Link></li>
                </ul>
            </div>
        </nav>
    )
}

export default Navbar;