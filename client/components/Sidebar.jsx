import React, { Component } from 'react';
import Input from './Input.jsx';

const Sidebar = props => {

  const savedLocations = props.savedLocations;
  const setSavedLocations = props.setSavedLocations;
  const savedUser = props.savedUser;
  const setUserLocations = props.setUserLocations;
  const setTestImage = props.setTestImage;

    return (

        <div className="">
          <Input 
          setUserLocations={setUserLocations} 
          userId={props.userId} 
          savedUser={savedUser} 
          savedLocations={savedLocations} 
          setSavedLocations={setSavedLocations} 
          userData={props.userData} 
          setAddress={props.setAddress}
          setTestImage={props.setTestImage} />
        </div>
       
    )
}


export default Sidebar;