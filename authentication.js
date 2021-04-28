var passport = require('passport');
var strategy = require('passport-local').Strategy;
const User = require('./models/user');
var jwtStrategy = require('passport-jwt').Strategy;
var extractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');

var config = require('./config');

module.local = passport.use(new strategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function(user){
    return jwt.sign(user,config.secretKey,{expiresIn: 3600});
}

var opts = {};
opts.jwtFromRequest = extractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new jwtStrategy(opts,
    (jwt_payload,done)=>{
        User.findOne({_id:jwt_payload._id},(user,err)=>{
            if(err){
                return done(err,false);
            }
            else if(user){
                return done(null,user);
            }
            else{
                return done(null,user);
            }
        })

    }));

    exports.verifyUser = passport.authenticate('jwt',{session:false});