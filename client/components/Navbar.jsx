import React, { Component, useState, useEffect } from 'react';
import logo from './images/logo3.png';
// import arrow from '../images/Arrow.png';
import Signup from './Signup.jsx';
import Login from './Login.jsx';

const Navbar = props => {
  const setSavedUser = props.setSavedUser;
  const savedUser = props.savedUser;
  const savedStatus = props.savedStatus;
  const setUserId = props.setUserId;
  // this is all for the modal
  const [hasClickedSignUp, setSignUpModal] = useState(false);
  const [hasClickedLogIn, setLoginModal] = useState(false);

  // modal sign up toggle rendering
  function signupModal(){
    setSignUpModal(!hasClickedSignUp);
  }

  //modal log in toggle rendering
  function loginModal(){
    setLoginModal(!hasClickedLogIn);
  }
  
  const logOut = () => {
    window.location.reload();
  }

    return (
        
      <header className="fixed z-50 w-full p-3 bg-[#1C6758]">
          
          <div id="head" className="md:flex">
            <div className="flex gap-2">
            <img className="flex flex-col float-left w-20" src={logo} alt=""/>
            <div id='navWords'>
              <div className="meet">MEET ME AT THE SPOT</div>
            </div>
            <div className="relative items-right ml-20">
            
              {!savedUser ? <button className="p-1 justify-right bg-[#FA7070] hover:bg-orange-300 text-white font-bold py-2 px-4 rounded" onClick={loginModal}>Log In</button>: null}
              <div className="w-40 bg-white shadow-xl rounded-lg flex flex-col absolute right-0 top-12">
          {hasClickedLogIn ? <Login setSavedUser={setSavedUser} savedStatus={savedStatus} setLoginModal={setLoginModal} setUserLocations={props.setUserLocations} setUserId={setUserId}/> : null}
          {savedUser ? <button className="p-1 bg-[#FA7070] hover:bg-orange-300 text-white font-bold py-2 px-4 rounded" onClick={logOut}>Log Out</button>: null}
          </div>
            </div>
            <div className="relative">
            {!savedUser ? <button className="bg-[#FA7070] hover:bg-orange-300 text-white font-bold py-2 px-4 rounded"
            Button onClick={signupModal}>Sign Up</button> : <span className="text-white">Welcome {savedUser}! </span>}
            <div className="w-40 bg-white shadow-xl rounded-lg flex flex-col absolute right-0 top-12">
              {hasClickedSignUp ? <Signup setSavedUser={setSavedUser} setSignUpModal={setSignUpModal} setLoginModal={setLoginModal}/> : null}
              </div>
              </div>
            </div>
            </div>

        </header>
       
    )
}


export default Navbar;