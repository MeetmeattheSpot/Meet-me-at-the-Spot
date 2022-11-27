import React, { useState, useEffect } from 'react'

const Post = props => {
	const [hasClickedLocation, setLocationModal] = useState(false); // for modal popup
	const [currentImage, setCurrentImage] = useState('');

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
			<button className="font-bold text-lg underline border-none" id='displayName' onClick={() => {
					// setLocationModal(true);
					setCurrentImage(`http://localhost:8080/api/images/${props.savedLocations._id}`);
				}}>{props.savedLocations.name}</button>
			<div id='displayAddress'> {props.savedLocations.street_address}, {props.savedLocations.state}</div>
			<div className="text-sm" id='displayCaption'>{props.savedLocations.caption}</div>
			{/* currently just displaying the picture down here on click, we were thinking a modal? idk */}
			{currentImage !== '' ? <img src={currentImage} /> : null}
		</div>
	)
}

export default Post;