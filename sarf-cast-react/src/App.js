import React from 'react';
import logo from './logo.svg';
import './App.css';
import {Route, Link, Switch} from 'react-router-dom';
import Signup from './components/signup/Signup.js';
import Login from './components/login/Login.js';

import AuthService from './services/AuthService.js';

import Navbar from './components/navbar/Navbar.js'


import axios from 'axios';


class App extends React.Component {

  constructor(props){
    super(props)
    this.state = { 
      currentlyLoggedIn: null,
      ready: false,
      signupShowing: false,
      loginShowing: false,
   };

   this.service = new AuthService();
  
  
  }


getCurrentlyLoggedInUser = () =>{
  this.service.currentUser()
  .then((theUser)=>{
    this.setState({currentlyLoggedIn: theUser})
  })
  .catch(()=>{
    this.setState({currentlyLoggedIn: null})
  })
}


toggleForm = (whichForm) =>{

  let theForm;

  if(whichForm === "signup"){
    theForm = 'signupShowing'
  } else {
    theForm = 'loginShowing'
  }

  this.setState({[theForm]: !this.state[theForm]})

  

}



  componentDidMount() {
      this.getCurrentlyLoggedInUser();

  }


render(){

  console.log('This is my state',this.state);


    return (
      <div>


      <Navbar 
      theUser = {this.state.currentlyLoggedIn} 
      userLogOut = {()=> this.service.logout()}
      toggleForm = {this.toggleForm}
      getUser = {this.getCurrentlyLoggedInUser}
      
      />

      {this.state.signupShowing && 
        <Signup getUser = {this.getCurrentlyLoggedInUser}
        toggleForm = {this.toggleForm}
         />
      }

      {this.state.loginShowing && 
        <Login getUser = {this.getCurrentlyLoggedInUser}
        toggleForm = {this.toggleForm}
        />
      }


      
    
      </div>
    );
  }
}

export default App;
