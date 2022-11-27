import React, { Component, useState, useEffect } from 'react';

import Map from '/client/components/Map.jsx';
import Sidebar from '/client/components/Sidebar.jsx'
import styles from '/client/styles.css'
import Navbar from '/client/components/Navbar.jsx';
import List from '/client/components/List.jsx';
import Favorites from '/client/components/Favorites.jsx';
const App = props => {

  // Using state to store, update and display location pins on the map.
  const [savedLocations, setSavedLocations] = useState([]);
  const [savedUser, setSavedUser] = useState(""); //the user logged in - populate at post request at log in
  const [savedStatus, setSavedStatus] = useState(null) //when user is logged in status changed to true
  const [userLocations, setUserLocations] = useState([]);
  const [userId, setUserId] = useState('');
  // Using state to receive user input about new locations to pass to database.
  const [userData, setAddress] = useState({
    name: '',
    street_address: '',
    city: '',
    state: '',
    zip: '',
    caption: '',
    category: '',
    public: true,
  })
  const [testImage, setTestImage] = useState('');

  // UseEffect to update the saved locations after rendering. 
  // SavedLocations/[] was passedin as a second arg to prevent constant rerendering. 
  // Can be changed to rerender once when when a new location is added.
  useEffect(() => {
    fetch('api/getList')
      .then(res => res.json())
      .then((locations) => {
        if (!Array.isArray(locations)) locations = [];
          setSavedLocations(locations);
      })
  }, savedLocations)

  // useEffect(() => {
  //   fetch(`/api/getPersonalList/${username}`)
  //     .then(res => res.json())
  //     .then((locations) => {
  //       if (!Array.isArray(locations)) locations = [];
  //         setUserLocations(locations);
  //     })
  // }, userLocations)

  return (
    
    <div>
      <div className="w-screen h-auto flex flex-col font-bold"> <Navbar setUserId={setUserId} savedUser={savedUser} setSavedUser={setSavedUser} savedStatus={savedStatus} setSavedStatus={setSavedStatus} setUserLocations={setUserLocations}/> 
      </div> 
            <div className="grid grid-cols-4 pt-8"> 
            <div className="max-w-s col-span-1 max-h-2.5">
              <List savedLocations={savedLocations} /> 
            </div>
            <div className="col-span-2 pt-10">
                <Map savedLocations={savedLocations} testImage={testImage} /> 
          <div className="bg-[#D6CDA4]">
            <div id="sidebardiv"> <Sidebar savedLocations={savedLocations} setSavedLocations={setSavedLocations} savedUser={savedUser} userData={userData} userId={userId} setAddress={setAddress} setUserLocations={setUserLocations} setTestImage={setTestImage} /> </div>
          </div>
            </div>
            <div className="col-span-1 pt-10">
                <Favorites userLocations={userLocations}/> 
            </div>
            
          </div>
        </div>
  )
}


export default App;