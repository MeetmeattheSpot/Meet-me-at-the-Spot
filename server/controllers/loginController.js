const db = require('../models/databaseModel');
const bcrypt = require('bcrypt');

const loginController = {};

const createErr = (method) => {
  return ({
    log: `This error occured in ${method} method inside loginController`,
    message: `This error occured in ${method} method inside loginController, check terminal for error info`
  });
};


loginController.checkCredentials = (req, res, next) => {
  // get credentials from req.body and destructure them
  const { username, password: pw } = req.body;
  // console.log(pw);
  // create a query
    const query = 'SELECT * FROM users WHERE username = $1;';
    // query database to see if that username exists
    db.query(query, [username])
      .then(dbResponse => {
        if (dbResponse.rows[0] === undefined) {
          // if nothing is found, return 401 status
          return res.status(401).json({ message: 'no username found' });
        } else {
          // if record is found, compare password
          const { password } = dbResponse.rows[0];
          bcrypt.compare(req.body.password, password, (err, result) => { 
            // if bcrypt.compare returns an unknown error, return global error handler
            if (err) { 
              return next({
                log: `userController.verifyUser: ERROR: Error comparing password: ${err}`,
                message: { err: 'Error comparing password' },
              });
            }
            if (result) {
            // if password is correct, save user & user id to session
              const { username, _id } = dbResponse.rows[0];
              // console.log(username, _id);
              res.locals.user = {
                id: _id,
                username: username
              };
            return next()
            }
            else {
              // if passwords don't match, return 401 status
              return res.status(401).json({ message: 'incorrect password' });
              }
          });
        }
      })
      .catch(err => {
        console.log(err);
        return next(createErr(err));
      });
};

loginController.checkCookies = (req, res, next) => {
  // check if there is a current cookie
  console.log(`this is the cookie sent in request ${req.cookies.ssid}`);
  // return next();
  const checkCookie = 'SELECT * FROM sessions WHERE $1 = username;';
  db.query(checkCookie, [req.cookies.ssid]) //
    .then(dbRes => {
      // console.log('dbRes: ',dbRes.rows[0]);
      //if there is no response, redirect
      if (dbRes.rows[0] === undefined) {
        res.status(401).json('unauthorized');
      }
      // if there is a response, proceed
      else return next();
    })
    .catch(err => { next(createErr(err)) });
}

// middleware if wanting to make fetch request to server to check if user is logged in
loginController.fetchUser = (req, res, next) => {
  // check if there is a current cookie
  const checkCookie = 'SELECT * FROM sessions WHERE $1 = username;';
  db.query(checkCookie, [req.cookies.ssid]) //
    .then(dbRes => {
      // if there is no response, return 'no user session found'
      if (dbRes.rows[0] === undefined) {
        return res.status(401).json({message: 'no user session found'});
      }
      // if there is a response, proceed
      else {
        const { username } = dbRes.rows[0];
        res.locals.user = username;
        return next();
      }
    })
    .catch(err => { next(createErr(err)) });
}

loginController.logout = (req, res, next) => {
  // delete cookie in databse
  const deleteCookie = 'DELETE FROM sessions WHERE $1 = session;';
  db.query(deleteCookie, [req.cookies.SSID]) //
    .then(dbRes => {
      console.log('dbRes: ',dbRes.rows[0]);
      return next();
    })
    .catch(err => { next(createErr(err)) });
}


module.exports = loginController;