const db = require('../models/databaseModel.js');
const path = require('path');

const imageController = {};

imageController.uploadImage = (req, res, next) => {
  console.log('made it to uploadImage middleware');
  console.log('req.file is: ', req.file);
  const { name, mimetype, size } = req.file;
  // const { location_id } = req.body;
  const filepath = req.file.path;
  const text = 'INSERT INTO image_files(filename, filepath, mimetype, size) VALUES($1, $2, $3, $4);';
  const params = [name, filepath, mimetype, size];
    db.query(text, params, (err, res2) => {
      if (err) {
        next({
          log: 'Express error handler caught unknown middleware error',
          status: 500,
          message: { err: 'Unable to upload image' },
        });
      } else {
        res.locals.filename = filename;
        console.log('successfully uploaded image to db');
        return next();
      }
    }
  )
}

imageController.getImage = (req, res, next) => {
  const { filename } = req.params;
  const query = 'SELECT * FROM image_files WHERE filename = $1';
  db.query(query, [filename])
    .then(dbResponse => {
      if (dbResponse.rows[0] === undefined) {
        next({
          log: 'Express error handler caught unknown middleware error',
          status: 500,
          message: { err: 'Unable to retrieve image' },
        });
        } else {
          const dirname = path.resolve();
          console.log(`the db response is dbResponse.rows[0].filepath: ${dbResponse.rows[0].filepath}`);
          res.locals.fullfilepath = path.join(dirname, dbResponse.rows[0].filepath);
          res.locals.mimetype = dbResponse.rows[0].mimetype;
          return next();
        }
      }
    )
    .catch(err => next(err))
}

module.exports = imageController;