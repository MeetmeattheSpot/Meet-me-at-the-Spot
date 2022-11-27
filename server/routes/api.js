const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController.js');
const captionsController = require('../controllers/captionsController.js');
const loginController = require('../controllers/loginController.js');
const signupController = require('../controllers/signupController.js');
const cookieController = require('../controllers/cookieController.js');
const imageController = require('../controllers/imageController.js');
const multer = require('multer');
const path = require('path');

router.post('/newLocation',
  locationController.geoCode,
  locationController.addLocation,
  captionsController.addCaption,
  locationController.getLocationsAndCaptions,
  (req, res) => {
    // console.log('made it to the router');
    return res.status(200).json(res.locals.bigList);
  })

  router.get('/filter/:id',
  locationController.filterLocations,
  (req, res) => {
    return res.status(200).json(res.locals.bigList);
  });

  router.get('/getList/',
  locationController.getLocationsAndCaptions,
  (req, res) => {
    // console.log('made it to the getList router');
    return res.status(200).json(res.locals.bigList);
  })
  
router.get('/getPersonalList/:user',
  locationController.getUserLocations,
  locationController.getLocationsAndCaptions,
  (req, res) => {
    // console.log('made it to the getList for User router');
    console.log(res.locals.bigList);
    return res.status(200).json(res.locals.bigList);
  })

router.post('/signup',
  signupController.createUser,
  cookieController.setCookie,
  signupController.createSession,
  (req, res) => {
    console.log('signed up successfully');
    return res.status(200).json({});
  });

router.post('/login', 
  loginController.checkCredentials,
  loginController.checkCookies, 
  (req, res) => res.status(200).json(res.locals.user));

router.post('/fetch-user',
  loginController.fetchUser, 
  (req, res) => {
      return res.status(200).json({ message: 'user found', user: res.locals.user });
  });

router.delete('/logout', 
  (req, res) => {
    res.clearCookie();
    return res.redirect('/');
  });


// image upload handling
const imageUpload = multer({
    dest: 'images',
});

router.get('/images/:id',
  imageController.getImageFromLocation,
  (req, res) => {
  res.type(res.locals.mimetype).sendFile(res.locals.fullfilepath);
});

// router.get('/images/:filename',
//   imageController.getImage,
//   (req, res) => {
//   res.type(res.locals.mimetype).sendFile(res.locals.fullfilepath);
// });

router.post('/images',
  imageUpload.single('image'),
  imageController.uploadImage,
  (req, res) =>  
  res.json({ success: true, filename: res.locals.filename })
);






    



module.exports = router;


// onst app = require('../server');
// const express = require('express');
// const router = express.Router();
// // const locationController = require('../controllers/locationController.js');
// // const captionsController = require('../controllers/captionsController.js');

// const locations = [
//   {
//     name: "Los Angeles",
//     street_address: "123 Main St",
//     location: { 
//       lat: 34.052,
//       lng: -118.244
//     },
//     captions: ["Test 1", "Test 2", "Test 3"],
//   },
//   {
//     name: "Location 2",
//     location: { 
//       lat: 34.072,
//       lng: -118.284
//     },
//   },
//   {
//     name: "Location 3",
//     location: { 
//       lat: 41.3773,
//       lng: 2.1585
//     },
//   },
//   {
//     name: "Location 4",
//     location: { 
//       lat: 41.3797,
//       lng: 2.1682
//     },
//   },
//   {
//     name: "Location 5",
//     location: { 
//       lat: 41.4055,
//       lng: 2.1915
//     },
//   }
// ];

// router.post('/newLocation',
//     // locationController.geoCode,
//     // locationController.addLocation,
//     (req, res) => {
//         console.log('made it to the router');
//         console.log(req.body)
//         return res.status(200).json(req.body);
//     })

// router.get('/getList', (req, res) => {
//   return res.status(200).json(locations);
// })





// module.exports = router;

