const router = require('express').Router()
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require('../model/userModel')

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback: true
},
async (request, accessToken, refreshToken, profile, done) => {
    const newUser = {
        googleId: profile.id,
        displayName: profile.displayName,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        profileImage: profile.photos[0].value
    }
    try {
        let user = await User.findOne({googleId: profile.id})
        if(user){
            done(null, user)
        } else {
            user = await User.create(newUser);
            done(null, user)
        }
    } catch (error) {
        console.log(error);
    }
}
));

router.get('/auth/google', passport.authenticate('google', {scope: ['email', 'profile']}))
router.get('/google/callback', passport.authenticate('google', {failureRedirect: '/login-failure', successRedirect: '/dashboard'}))
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if(err){
            console.log(err);
            res.send("Error logout!")
        } else{
            res.redirect('/')
        }
    })
})
passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser((id, done) => {
    // User.findById(id, (err, user) => {
    //   done(err, user);
    // });
    User.findById(id).then(user => {
        done(null, user)
    }).catch(err => {
        done(err, null)
    })
  });

module.exports = router