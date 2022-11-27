import React, { useState, useEffect } from 'react'
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
// import dotenv from 'dotenv'

// initiate dotenv
// dotenv.config();

// This component imports the React Google Maps API library and implements it.
// Data is passed down to the GoogleMap component as props.

// This sets the map size in the app. This gets passed into the GoogleMap component in the mapContainerStyle attribute
const mapStyle = {
    height: '55vh',
    width: '100%',
  }

// This constant sets the center point of the map, currently Los Angeles
const center = {
  lat: 34.052,
  lng: -118.244
};

function MyComponent(props) {
  const testImage = props.testImage;

  // This is the array of saved locations pulled from the database
  const savedLocations = props.savedLocations;

  // This is the current selected pin on the map
  const [selected, setSelected] = useState({});

  const onSelect = item => {
    setSelected(item);
  }

  // useEffect(() => {
  //   fetch('api/locations')
  //     .then(res => res.json())
  //     .then((locations) => {
  //       if (!Array.isArray(locations)) locations = [];
  //       setSavedLocations(locations);
  //     })
  // })

  // Refer to the slim google maps API library documentation for built in methods an props
  return (
    <div className="border mt-14 shadow-2xl rounded-full">
    <LoadScript
     // Add in your own Google Maps API key here
        googleMapsApiKey={process.env.GOOGLE_MAPS_API_KEY}
    >
      <GoogleMap
        center={center}
        zoom={10}
        mapContainerStyle={mapStyle}
      >
        {
          savedLocations.map(item => {
            return (
              <Marker key={item.name} position={item.location} onClick={() => onSelect(item)} />
            )
          })
        }
        {
          selected.location && 
          (
            <InfoWindow position={selected.location} clickable={true} onCloseClick={() => setSelected({})}>
              <p>
                <p><strong>{selected.name}</strong></p>
                <p>{selected.street_address}</p>
                <p>{selected.city}, {selected.state} {selected.zip_code}</p>
                <p>"{selected.caption}" - Somebody</p>
                <p><img class="w-60" src={testImage} alt="test" /></p>
              </p>
            </InfoWindow>
          )
        }
        <></>
      </GoogleMap>
    </LoadScript>
    </div>
  )
}

export default React.memo(MyComponent)