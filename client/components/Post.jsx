import React, { useState, useEffect } from 'react'

const Post = props => {

	return (
		<div className='postContainer'>
			{props.savedLocations.name}
			{props.savedLocations.created_by_id}
			{props.savedLocations.category}
		</div>
	)
}


export default Post;