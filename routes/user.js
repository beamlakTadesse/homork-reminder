var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var fs = require('fs');
var path = require('path');
var jwt = require('jsonwebtoken');

const passport = require('passport');

const User = require('../models/user');
const user = require('../models/user');
const { config } = require('process');
const route = express.Router();
const configg = require('../config');
const { auth } = require('firebase-admin');
const authenticate = require('../authentication');
// var storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads')
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.fieldname + '-' + Date.now())
//     }
// });

// var upload = multer({ storage: storage });

route.get('/', (req, res, next) => {
    res.send('Started....');
});

// route.post('/',upload.single('image'),(req,res,next)=>{
//     User.register(new User({ username: req.body.username ,
//         name:req.body.name,
//         email:req.body.email,
//         img: {
//             data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
//             contentType: 'image/png'
//         }}),req.body.password
//    , (err, user) => {
//       if (err) {
//         res.statusCode = 500;
//         res.setHeader('content-Type', 'applicatio/json');
//         res.json({ err: err });
//       }
//       else { res.statusCode = 200;
//         res.setHeader('content-Type', 'applicatio/json');
//         res.json({ user: user});
//       }
//     })
// });


var upload = multer();
// upload.single('img'),
route.post('/signup', (req, res, next) => {
    User.register(new User({
        username: req.body.username,
        name: req.body.name,
        email: req.body.email,
      //  img: req.file.buffer 
    }), req.body.password, (err, user) => {

        if (err) {
            res.statusCode = 500;
            res.setHeader('content-Type', 'applicatio/json');
            res.json({ err: err });
        }
        else {
            passport.authenticate('local')(req, res, () => {
                res.statusCode = 200;
                res.setHeader('content-Type', 'applicatio/json');
                res.json({ user: user  });
            });
        }
    }), (err, req, res, next) => res.status(404).send({ error: err });
});

route.post('/login', passport.authenticate('local'), (req, res, next) => {
    var token = authenticate.getToken({_id:req.user._id});
    User.findOne({ username: req.body.username}, (err, user) => {
        if (err) {
            res.statusCode = 500;
            res.setHeader('content-Type', 'applicatio/json');
            res.json({ success: false, status: 'login not successful', error: err });
        }
        else {
            res.statusCode = 200;
            res.setHeader('content-Type', 'applicatio/json');
            res.json({ success: true,token:token,status: 'login successful', user: user });

        }
    });

});

route.get('/logout', (req, res,next) => {
    if (req.session) {
      req.session.destroy();
      res.clearCookie('session-id');
     res.send('logged out ');
    }
    else {
      var err = new Error('You are not logged in!');
      err.status = 403;
      next(err);
    }
  });




module.exports = route;
