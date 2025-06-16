const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require('passport');
const userSchema = require('../models/user.model');
require('dotenv').config();

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_KEY;

passport.use(new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
        const user = await userSchema.findOne({ email: jwt_payload.email });

        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (error) {
        return done(error, false);
    }
}));

