//const { resourceLimits } = require('worker_threads');
const db = require('../models/databaseModel.js');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({
  path: path.resolve(__dirname, '../../.env')
});


const locationController = {};

// use google maps api to get location data
locationController.geoCode = (req, res, next) => {
  const { street_address, city, state } = req.body;
  fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${street_address},+${city},+${state}&key=${process.env.GOOGLE_MAPS_API_KEY}`)

    .then((data) => data.json())
    .then((data) => {
      // console.log('Made the fetch');
      // console.log('data : ', data);
      const lat = data.results[0].geometry.location.lat;
      const lng = data.results[0].geometry.location.lng;
      const addy = data.results[0].formatted_address;

      res.locals.newEntry = {
        street_address: street_address,
        city: city,
        state: state,
        lat: lat,
        lng: lng,
        formatted_address: addy
      }
      next();
    })
    .catch(err => next({
      log: 'Express error handler caught unknown middleware error',
      status: 500,
      message: { err: 'Unable to fetch geocode' },
    }));
}

//.addLocation
//this is the middleware method to add the new entry into the locations table and receive back the location _id
//the location _id will then be passed on to be used so cave the entry in captions table with a reference to the location
locationController.addLocation = (req, res, next) => {
  // console.log('hello, from ADD LOCATION');
  const { name, caption, zip, category, created_by_id } = req.body;
    const location_public = req.body.public;
  const { street_address, city, state, lat, lng, formatted_address } = res.locals.newEntry;
  const text = 'INSERT INTO locations(street_address, city, state, created_by_id, zip_code, lat, lng,  name, formatted_address, category, public) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING _id;';
  const params = [street_address, city, state, created_by_id, zip, lat, lng, name, formatted_address, category, location_public];

  db.query(text, params, (err, res2) => {
    if (err) {
      next({
        log: 'Express error handler caught unknown middleware error',
        status: 500,
        message: { err: 'Unable to add a new location' },
      });
    } else {
      // console.log('entry made :', res2.rows[0]._id);
      //saves the _id of the entry just made to res.locals
      res.locals.newEntryID = res2.rows[0]._id;
      next();
    }

  });
}

// retrieve user-submitted locations
locationController.getUserLocations = (req, res, next) => {
  // console.log(req.params.user);
  const username = req.params.user;
  const query = 'SELECT * FROM users WHERE username = $1';

  // query database to find the corresponding user ID
  db.query(query, [username])
    .then(dbResponse => {
      if (dbResponse.rows[0] === undefined) {
        // if file is not returned
        return res.status(401).json('failed to retrieve user-submitted locations');
      } else {
        // if a file is returned next
        const { username, _id } = dbResponse.rows[0];
        // console.log(`retrieving locations for ${username}, ${_id}`);
        // console.log(_id);
        res.locals.user_id = _id;
        return next();
      }})
    .catch(err => next(err))

}

// join locations & captions tables
locationController.getLocationsAndCaptions = (req, res, next) => {
  let text;
  // if user is logged in, retrieve user-specific locations
  if (res.locals.user_id) {
    text = `SELECT * FROM locations l
            LEFT OUTER JOIN captions c
            ON c.location_id = l._id
            WHERE l.created_by_id = ${res.locals.user_id}`;
  }
  // if user is not logged in, retrieve all public locations
  else {
    text = `SELECT * FROM locations l
        LEFT OUTER JOIN captions c
        ON c.location_id = l._id
        WHERE l.public = true`;
  }

  // The purpose of entriesFormatter is to return an array with objects.
  // We should only receive one object per location and each object contains an array of captions.
  // We use entriesFormatter to prevent duplicate objects and create an array with all the captions. Time-Complexity O(n)
  const entriesFormatter = (array) => {
    // Use a map to store a key linked to the objects' id's and store as a value an array containing all captions from that location
    let mapp = new Map();
    array.forEach(el => {
      if (mapp.has(el._id)) {
        let value = mapp.get(el._id)
        if (el.caption) value.push(el.caption);
        mapp.set(el._id, value);
      } else {
        el.caption ? mapp.set(el._id, [el.caption]) : mapp.set(el._id, ['']);
      }
    })

    // Output will have one object per each locations
    let output = []
    // Use a set to keep track what objects I have added to my output array
    let setOfVisitedId = new Set();
    array.forEach(el => {
      // If it's not in the set then we add the object and the captions array to the output array
      if (!setOfVisitedId.has(el._id)) {
        el.caption = mapp.get(el._id)
        el.location = {
          lat: el.lat,
          lng: el.lng
        };
        output.push(el);
        setOfVisitedId.add(el._id);
      }
    });
    return output;
  };

  // Query the database to obtain all locations and captions
  db.query(text)
    .then(data => {
      let newArr = entriesFormatter(data.rows);
      res.locals.bigList = newArr;
      // console.log(res.locals.bigList);
      next();
    })
    .catch((err) => {
      next({
        log: 'Express error handler caught unknown middleware error',
        status: 500,
        message: { err: 'Unable to get all locations and captions' },
      })
    })
}

locationController.filterLocations = (req, res, next) => {
/* selecting multiple categories to filter with

query : SELECT * FROM locations l LEFT OUTER JOIN captions c ON c.location_id = l._id WHERE l.category = 1 OR l.category = 2 OR l.category 3;

if req.body.categories.length = 1
const text = `SELECT * FROM locations l LEFT OUTER JOIN captions c ON c.location_id = l._id WHERE l.category = $1;`;

if req.body.categories.length = 2
const text = `SELECT * FROM locations l LEFT OUTER JOIN captions c ON c.location_id = l._id WHERE l.category = $1 OR l.category = $2`;

if req.body.categories.length = 3
const text = `SELECT * FROM locations l LEFT OUTER JOIN captions c ON c.location_id = l._id WHERE l.category = $1 OR l.category = $2 OR l.category = $3`;

*/
  const text = `SELECT * FROM locations l LEFT OUTER JOIN captions c ON c.location_id = l._id WHERE l.category = $1;`;
  db.query(text, [req.params.id])
    .then(data => {
      res.locals.bigList = data.rows;
      console.log(res.locals.bigList);
      next();
    })
    .catch((err) => {
      console.log(err);
      next({
        log: 'Express error handler caught unknown middleware error',
        status: 500,
        message: { err: err },
      })
    })
}
      

module.exports = locationController;