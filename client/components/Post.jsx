import React, { useState, useEffect } from 'react'

	// function LocationModal() {
	// 	return (
	// 		<div>
	// 			{/* <img src={picture from db} /> */}
	// 		</div>
	// 	)
	// }


const Post = props => {
	const [hasClickedLocation, setLocationModal] = useState(false);
	const [currentImage, setCurrentImage] = useState('');

	 // modal location name rendering
//  function handleLocationModal(id){
//     setLocationModal(!hasClickedLocation);
// 		fetch('api/images/locations', {
// 			method: 'POST',
// 			headers: {
// 				Accept: 'application/json',
// 				'Content-Type': 'application/json'
// 				},
// 				body: JSON.stringify({location_id: id})
// 				})
// 				.then(res => setCurrentImage(res))
// 				.catch(err => console.log('error fetching image'))
// 		}

	const fetchImage = (id) => {
		fetch('api/images/locations', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
				},
			body: JSON.stringify({location_id: id})
			})
		.then(res => setCurrentImage(res))
		.catch(err => console.log('error fetching image'))
	}

	let locCard = [];
	if (props.savedLocations.category === 1){
		locCard.push(<div className='photospot'><div>{props.savedLocations.name}</div>
		<div>{props.savedLocations.street_address}</div>
		<div>{props.savedLocations.city}, {props.savedLocations.state} {props.savedLocations.zip_code}</div>
		<div>{props.savedLocations.caption}</div></div>)
	}
	else if (props.savedLocations.category === 2){
		locCard.push(<div className='food'><div>{props.savedLocations.name}</div>
		<div>{props.savedLocations.street_address}</div>
		<div>{props.savedLocations.city}, {props.savedLocations.state} {props.savedLocations.zip_code}</div>
		<div>{props.savedLocations.caption}</div></div>)
	}

	else if (props.savedLocations.category === 3){
		locCard.push(<div className='hiking'><div>{props.savedLocations.name}</div>
		<div>{props.savedLocations.street_address}</div>
		<div>{props.savedLocations.city}, {props.savedLocations.state} {props.savedLocations.zip_code}</div>
		<div>{props.savedLocations.caption}</div></div>)
	}

	else{
		locCard.push(<div className='other'><div>{props.savedLocations.name}</div>
		<div>{props.savedLocations.street_address}</div>
		<div>{props.savedLocations.city}, {props.savedLocations.state} {props.savedLocations.zip_code}</div>
		<div>{props.savedLocations.caption}</div></div>)
	}

	return (
		<div className="bg-[#EEF2E6] w-xs rounded-xl p-5 m-2">
			<button className="font-bold text-lg underline border-none" id='displayName'>{props.savedLocations.name}</button>
			<div id='displayAddress'> {props.savedLocations.street_address}, {props.savedLocations.state}</div>
			<div className="text-sm" id='displayCaption'>{props.savedLocations.caption}</div>
			{/* {currentImage !== '' ? <img src={currentImage} /> : null} */}
		</div>
	)
}


export default Post;