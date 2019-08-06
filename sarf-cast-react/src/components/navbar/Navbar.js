import React from 'react';
import {Link, NavLink} from 'react-router-dom';



function Navbar(props){

    const logoutNow = () =>{
        props.userLogOut()
        .then(()=>{
            props.getUser();
        })

    }

    return(



        <nav>
{/*             
            {props.theUser && 
        <Link to="/region" style={{ textDecoration: 'none', margin: '10px' }}>Region</Link>
            } */}


        {!props.theUser && 
        <span>
        <button onClick = {()=> props.toggleForm('login')} > Login </button>
        <button onClick = {()=> props.toggleForm('signup')}>Sign Up</button>
        </span>
        }

        {props.theUser && 
        <span>

        <button onClick = {logoutNow} >Log Out </button>

            <span>Hello, {props.theUser.username}</span>
        </span>
        }

    



        </nav>
    )








}

export default Navbar;