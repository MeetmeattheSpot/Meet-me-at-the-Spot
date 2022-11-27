import React, { Component, useState } from "react";

const Input = (props) => {
    const userId = props.userId;
    const savedUser = props.savedUser;
    const savedLocations = props.savedLocations;
    const setSavedLocations = props.setSavedLocations;
    const setUserLocations = props.setUserLocations;
    const userData = props.userData;
    const setAddress = props.setAddress;
    const [file, setFile] = useState(null);
    const setTestImage = props.setTestImage;
    

    // This function takes values from input fields and updates the userData piece of state,
    const handleChange = (e, property) => {

			  if (property === 'category'){
					let updatedValue = {};
					let categoryNumber = 0;
					if (e.target.value === 'photospot'){
						categoryNumber = 1;
					}
					else if (e.target.value === 'food'){
						categoryNumber = 2;
					}
					else if (e.target.value === 'hiking'){
						categoryNumber = 3;
					}
					else if (e.target.value === 'other'){
						categoryNumber = 4;
					}
					else{
						console.log("error. Incorrect category field");
						return;
					}
					updatedValue = {[property]: categoryNumber};
					setAddress(userData => ({
							...userData,
							...updatedValue
					}))
				}
        else if (property === 'public'){
            let updatedValue = {};
            const publicVal = document.getElementById('public'); 
            if(publicVal.checked){
                updatedValue = {[property]: false};
            }
            else{
                updatedValue = {[property]: true};
            }
            setAddress(userData => ({
                ...userData,
                ...updatedValue
            }))
        }
        else if (property === 'zip') { // this is to coerece the zip code inputted as a string, into an integer 
            let updatedValue = {};
        updatedValue = {[property]: parseInt(e.target.value)};
        setAddress(userData => ({
            ...userData,
            ...updatedValue
        }))}
        else { 
            let updatedValue = {};
            updatedValue = {[property]: e.target.value};
            setAddress(userData => ({
                ...userData,
                ...updatedValue
            }))
        }
    }

    // This function submits user inputted data from input fields
    // and sends to database. The final .then() statement is supposed to cause
    // a re-render with thew newly inputted pin, but it isn't working yet.
    // Addresses are geocded by the back end into lat/long coordinates that the
    // map library uses.
    const submitFunc = () => {
        const userDataWithUserID = {...userData, created_by_id: userId }
        console.log(userDataWithUserID)
        fetch('/api/newLocation', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userDataWithUserID)
        })
        .then((res) => res.json())
        .then((res) => setSavedLocations(res))
        .then(() => {
            const fetchString = `/api/getPersonalList/${savedUser}`
            fetch(fetchString)
            .then(res => res.json())
            .then((locations) => {
              if (!Array.isArray(locations)) {
                locations = [];
              }
                setUserLocations(locations);
                // console.log(locations);
                // console.log('the file submitted in body is', file)
                let formData = new FormData();
                formData.append('image', file);
                formData.append('user_id', userId);
                formData.append('location_id', locations[locations.length - 1].id);
                fetch('/api/images', {
                    method: 'POST',
                    body: formData
                })
                    .then((res) => res.json())
                    .then((res) => {
                        setTestImage(`api/images/${res.filename}`);
                    })
                    .then(fetch)
                    .catch(err => console.log('could not upload image'))
            })
            .then(()=>console.log('user locations updated'))
          }) 
        //fetch request to userlocations
        //set userlocations to whatever we get back from the server
        .catch(err => console.log('error after submit'))
        
    }

    // const addImage = (e) => {
    //     console.log(e.target.files[0]);
    //     ;
    // }

    // function addImage (event) {
    //     var file = event.target.files[0];
    //     var reader = new FileReader();
    //     reader.onload = function(event) {
    //       // The file's text will be printed here
    //       console.log(event.target.result)
    //     };
      
    //     reader.readAsText(file);
    //   }

    return (
        <div className="mt-3 flex flex-col text-center bg-[#A1C298] rounded-xl"> 
        <h1 id="add-location" className="pt-5 p-3 pl-7 pr-5 pb-6 font-bold text-3xl">Add a Pin</h1>
            <div className="inputContainer"> 
                
                <input
                type="text"
                name="apt"
                placeholder="Name"
                defaultValue={userData.name}
                onChange={(e) => handleChange(e, "name")}
                />

                <input
                type="text"
                name="caption"
                placeholder="Caption"
                defaultValue={userData.caption}
                onChange={(e) => handleChange(e, "caption")}
                />

                <input
                type="text"
                name="street_address"
                placeholder="Address"
                defaultValue={userData.street_address}
                onChange={(e) => handleChange(e, "street_address")}
                />
                <input
                type="text"
                name="city"
                placeholder="City"
                defaultValue={userData.city}
                onChange={(e) => handleChange(e, "city")}
            />
            
                <input
                type="text"
                name="state"
                placeholder="State"
                defaultValue={userData.state}
                onChange={(e) => handleChange(e, "state")}
                />
                <input
                type="text"
                name="zip"
                placeholder="Zip Code"
                defaultValue={userData.zip}
                onChange={(e) => handleChange(e, "zip")}
                />

                
            </div>
			<div className="inputContainer">
						{/* <label>
                <input placeholder="Category" list="categories" name="category" defaultValue={userData.category} onChange={(e) => handleChange(e, "category")} onblur="this.readOnly=true" required/>
            </label> */}
                {/* <datalist id="categories">
                    <option className="categoryDropDown" value="photospot"/>
                    <option className="categoryDropDown" value="food"/>
                    <option className="categoryDropDown" value="hiking"/>
                    <option className="categoryDropDown" value="other"/>
                </datalist> */}
                <select required onChange={(e) => handleChange(e, "category")}>
                <option>--Choose a Category--</option>
                <option value="photospot">Photospot</option>
                <option value="food">Food</option>
                <option value="hiking">Hiking</option>
                <option value="other">Other</option>
                </select>
			</div> 
            <div className="publicCheckBoxContainer">
                <label>Private</label>
                <input 
                id="public"
                type="checkbox"
                name="public"
                defaultValue={userData.public}
                onChange={(e) => handleChange(e, "public")}></input>
            </div> 
        
           <div className="inputContainer">
                    <input
                    type="file"
                    accept="image/*"
                    name="neededimage"
                    id="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    />
                    <br />
           <button className="bg-[#FA7070] hover:bg-orange-300 text-white font-bold py-2 px-4 rounded" onClick={submitFunc}>Submit</button>
           </div>
        </div>
    )

}





export default Input;